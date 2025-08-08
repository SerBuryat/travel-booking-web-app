import { ClientService } from '../ClientService';
import { ClientRepository } from '@/repository/ClientRepository';
import { TelegramDataBuilder } from '@/utils/telegramDataBuilder';
import { TelegramUser } from '@/types/telegram';
import { ClientWithAuthType } from '@/model/ClientType';

// Мокаем зависимости
jest.mock('@/repository/ClientRepository');
jest.mock('@/utils/telegramDataBuilder');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    tclients: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    tclients_auth: {
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('ClientService', () => {
  let clientService: ClientService;
  let mockClientRepository: jest.Mocked<ClientRepository>;
  let mockTelegramDataBuilder: jest.Mocked<typeof TelegramDataBuilder>;

  // Мок данные
  const mockTelegramUser: TelegramUser = {
    id: 123456789,
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    language_code: 'en',
    photo_url: 'https://t.me/i/userpic/320/johndoe.jpg'
  };

  const mockAuthId = 'auth_123456789';
  const mockTokenExpiresAt = new Date('2024-12-31T23:59:59Z');

  const mockExistingClient: ClientWithAuthType = {
    id: 1,
    tarea_id: null,
    name: 'John Doe',
    email: null,
    photo: 'https://t.me/i/userpic/320/johndoe.jpg',
    additional_info: { telegram_id: 123456789 },
    created_at: new Date(),
    tclients_auth: [
      {
        id: 1,
        tclients_id: 1,
        auth_type: 'telegram',
        auth_id: mockAuthId,
        last_login: new Date('2024-01-01T10:00:00Z'),
        auth_context: mockTelegramUser,
        refresh_token: 'old_token',
        token_expires_at: new Date('2024-01-01T11:00:00Z'),
        is_active: true,
        role: 'user'
      }
    ]
  };

  const mockNewClient: ClientWithAuthType = {
    id: 2,
    tarea_id: null,
    name: 'John Doe',
    email: null,
    photo: 'https://t.me/i/userpic/320/johndoe.jpg',
    additional_info: { telegram_id: 123456789 },
    created_at: new Date(),
    tclients_auth: [
      {
        id: 2,
        tclients_id: 2,
        auth_type: 'telegram',
        auth_id: mockAuthId,
        last_login: null,
        auth_context: mockTelegramUser,
        refresh_token: '',
        token_expires_at: mockTokenExpiresAt,
        is_active: true,
        role: 'user'
      }
    ]
  };

  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();

    // Создаем моки
    mockClientRepository = new ClientRepository() as jest.Mocked<ClientRepository>;
    mockTelegramDataBuilder = TelegramDataBuilder as jest.Mocked<typeof TelegramDataBuilder>;

    // Создаем экземпляр сервиса с мок репозиторием
    clientService = new ClientService();
    (clientService as any).clientRepository = mockClientRepository;
  });

  describe('createOrUpdateWithTelegramAuth', () => {
    describe('кейс с обновлением существующего пользователя', () => {
      beforeEach(() => {
        // Настраиваем моки для сценария обновления
        mockClientRepository.findByAuthId = jest.fn().mockResolvedValue(mockExistingClient);
        mockClientRepository.updateWithAuth = jest.fn().mockResolvedValue(mockExistingClient);
        
        mockTelegramDataBuilder.buildClientUpdateData = jest.fn().mockReturnValue({
          name: 'John Doe Updated',
          photo: 'https://t.me/i/userpic/320/johndoe.jpg',
          additional_info: { telegram_id: 123456789, updated: true }
        });
      });

      it('должен найти существующего клиента и обновить его', async () => {
        // Act
        const result = await clientService.createOrUpdateWithTelegramAuth(
          mockTelegramUser,
          mockAuthId,
          mockTokenExpiresAt
        );

        // Assert
        expect(result).toEqual(mockExistingClient);
        
        // Проверяем, что методы вызывались с правильными аргументами
        expect(mockClientRepository.findByAuthId).toHaveBeenCalledTimes(1);
        expect(mockClientRepository.findByAuthId).toHaveBeenCalledWith(mockAuthId);
        
        expect(mockTelegramDataBuilder.buildClientUpdateData).toHaveBeenCalledTimes(1);
        expect(mockTelegramDataBuilder.buildClientUpdateData).toHaveBeenCalledWith(mockTelegramUser);
        
        expect(mockClientRepository.updateWithAuth).toHaveBeenCalledTimes(1);
        expect(mockClientRepository.updateWithAuth).toHaveBeenCalledWith(
          mockExistingClient.id,
          {
            name: 'John Doe Updated',
            photo: 'https://t.me/i/userpic/320/johndoe.jpg',
            additional_info: { telegram_id: 123456789, updated: true },
            tclients_auth: {
              update: {
                where: { id: mockExistingClient.tclients_auth[0].id },
                data: { last_login: expect.any(Date), is_active: true }
              }
            }
          }
        );
      });

      it('должен обновить last_login в аутентификации', async () => {
        // Act
        await clientService.createOrUpdateWithTelegramAuth(
          mockTelegramUser,
          mockAuthId,
          mockTokenExpiresAt
        );

        // Assert
        const updateCall = mockClientRepository.updateWithAuth.mock.calls[0];
        const updateData = updateCall[1];
        
        expect(updateData.tclients_auth).toBeDefined();
        expect(updateData.tclients_auth?.update).toBeDefined();
        expect(updateData.tclients_auth?.update?.where.id).toBe(mockExistingClient.tclients_auth[0].id);
        expect(updateData.tclients_auth?.update?.data.last_login).toBeInstanceOf(Date);
      });

      it('должен обработать случай, когда у клиента нет аутентификации', async () => {
        // Arrange
        const clientWithoutAuth = { ...mockExistingClient, tclients_auth: [] };
        mockClientRepository.findByAuthId = jest.fn().mockResolvedValue(clientWithoutAuth);

        // Act
        await clientService.createOrUpdateWithTelegramAuth(
          mockTelegramUser,
          mockAuthId,
          mockTokenExpiresAt
        );

        // Assert
        expect(mockClientRepository.updateWithAuth).toHaveBeenCalledWith(
          clientWithoutAuth.id,
          {
            name: 'John Doe Updated',
            photo: 'https://t.me/i/userpic/320/johndoe.jpg',
            additional_info: { telegram_id: 123456789, updated: true }
          }
        );
      });
    });

    describe('кейс с созданием нового пользователя', () => {
      beforeEach(() => {
        // Настраиваем моки для сценария создания
        mockClientRepository.findByAuthId = jest.fn().mockResolvedValue(null);
        mockClientRepository.createWithAuth = jest.fn().mockResolvedValue(mockNewClient);
        
        mockTelegramDataBuilder.buildClientCreateData = jest.fn().mockReturnValue({
          name: 'John Doe',
          photo: 'https://t.me/i/userpic/320/johndoe.jpg',
          additional_info: { telegram_id: 123456789 }
        });
        
        mockTelegramDataBuilder.buildAuthCreateData = jest.fn().mockReturnValue({
          auth_type: 'telegram',
          auth_id: mockAuthId,
          auth_context: mockTelegramUser,
          refresh_token: '',
          token_expires_at: mockTokenExpiresAt,
          role: 'user'
        });
      });

      it('должен создать нового клиента с аутентификацией', async () => {
        // Act
        const result = await clientService.createOrUpdateWithTelegramAuth(
          mockTelegramUser,
          mockAuthId,
          mockTokenExpiresAt
        );

        // Assert
        expect(result).toEqual(mockNewClient);
        
        // Проверяем, что методы вызывались с правильными аргументами
        expect(mockClientRepository.findByAuthId).toHaveBeenCalledTimes(1);
        expect(mockClientRepository.findByAuthId).toHaveBeenCalledWith(mockAuthId);
        
        expect(mockTelegramDataBuilder.buildClientCreateData).toHaveBeenCalledTimes(1);
        expect(mockTelegramDataBuilder.buildClientCreateData).toHaveBeenCalledWith(mockTelegramUser);
        
        expect(mockTelegramDataBuilder.buildAuthCreateData).toHaveBeenCalledTimes(1);
        expect(mockTelegramDataBuilder.buildAuthCreateData).toHaveBeenCalledWith(
          mockAuthId,
          mockTelegramUser,
          mockTokenExpiresAt
        );
        
        expect(mockClientRepository.createWithAuth).toHaveBeenCalledTimes(1);
        expect(mockClientRepository.createWithAuth).toHaveBeenCalledWith({
          name: 'John Doe',
          photo: 'https://t.me/i/userpic/320/johndoe.jpg',
          additional_info: { telegram_id: 123456789 },
          tclients_auth: {
            create: {
              auth_type: 'telegram',
              auth_id: mockAuthId,
              auth_context: mockTelegramUser,
              refresh_token: '',
              token_expires_at: mockTokenExpiresAt,
              role: 'user'
            }
          }
        });
      });
    });

    describe('обработка ошибок', () => {
      it('должен вернуть null при ошибке в findByAuthId', async () => {
        // Arrange
        mockClientRepository.findByAuthId = jest.fn().mockRejectedValue(new Error('Database error'));

        // Act
        const result = await clientService.createOrUpdateWithTelegramAuth(
          mockTelegramUser,
          mockAuthId,
          mockTokenExpiresAt
        );

        // Assert
        expect(result).toBeNull();
      });

      it('должен вернуть null при ошибке в updateWithAuth', async () => {
        // Arrange
        mockClientRepository.findByAuthId = jest.fn().mockResolvedValue(mockExistingClient);
        mockClientRepository.updateWithAuth = jest.fn().mockRejectedValue(new Error('Update error'));
        mockTelegramDataBuilder.buildClientUpdateData = jest.fn().mockReturnValue({});

        // Act
        const result = await clientService.createOrUpdateWithTelegramAuth(
          mockTelegramUser,
          mockAuthId,
          mockTokenExpiresAt
        );

        // Assert
        expect(result).toBeNull();
      });

      it('должен вернуть null при ошибке в createWithAuth', async () => {
        // Arrange
        mockClientRepository.findByAuthId = jest.fn().mockResolvedValue(null);
        mockClientRepository.createWithAuth = jest.fn().mockRejectedValue(new Error('Create error'));
        mockTelegramDataBuilder.buildClientCreateData = jest.fn().mockReturnValue({});
        mockTelegramDataBuilder.buildAuthCreateData = jest.fn().mockReturnValue({});

        // Act
        const result = await clientService.createOrUpdateWithTelegramAuth(
          mockTelegramUser,
          mockAuthId,
          mockTokenExpiresAt
        );

        // Assert
        expect(result).toBeNull();
      });
    });

    describe('интеграционные тесты', () => {
      it('должен корректно обрабатывать полный цикл создания и обновления', async () => {
        // Arrange - сначала создаем нового пользователя
        mockClientRepository.findByAuthId = jest.fn()
          .mockResolvedValueOnce(null) // Первый вызов - пользователь не найден
          .mockResolvedValueOnce(mockNewClient); // Второй вызов - пользователь найден
        
        mockClientRepository.createWithAuth = jest.fn().mockResolvedValue(mockNewClient);
        mockClientRepository.updateWithAuth = jest.fn().mockResolvedValue(mockExistingClient);
        
        mockTelegramDataBuilder.buildClientCreateData = jest.fn().mockReturnValue({
          name: 'John Doe',
          photo: 'https://t.me/i/userpic/320/johndoe.jpg',
          additional_info: { telegram_id: 123456789 }
        });
        
        mockTelegramDataBuilder.buildAuthCreateData = jest.fn().mockReturnValue({
          auth_type: 'telegram',
          auth_id: mockAuthId,
          auth_context: mockTelegramUser,
          refresh_token: '',
          token_expires_at: mockTokenExpiresAt,
          role: 'user'
        });
        
        mockTelegramDataBuilder.buildClientUpdateData = jest.fn().mockReturnValue({
          name: 'John Doe Updated',
          photo: 'https://t.me/i/userpic/320/johndoe.jpg',
          additional_info: { telegram_id: 123456789, updated: true }
        });

        // Act - создаем пользователя
        const createResult = await clientService.createOrUpdateWithTelegramAuth(
          mockTelegramUser,
          mockAuthId,
          mockTokenExpiresAt
        );

        // Assert - проверяем создание
        expect(createResult).toEqual(mockNewClient);
        expect(mockClientRepository.createWithAuth).toHaveBeenCalledTimes(1);

        // Act - обновляем пользователя
        const updateResult = await clientService.createOrUpdateWithTelegramAuth(
          mockTelegramUser,
          mockAuthId,
          mockTokenExpiresAt
        );

        // Assert - проверяем обновление
        expect(updateResult).toEqual(mockExistingClient);
        expect(mockClientRepository.updateWithAuth).toHaveBeenCalledTimes(1);
      });
    });
  });
});
