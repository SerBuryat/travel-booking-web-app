import { ClientRepository } from '@/repository/ClientRepository';
import { 
  ClientType, 
  ClientWithAuthType, 
  CreateClientType, 
  UpdateClientType,
  CreateClientAuthType,
  AuthResult
} from '@/model/ClientType';
import { TelegramUser } from "@/types/telegram";
import { prisma } from '@/lib/prisma';
import { TelegramDataBuilder } from '@/utils/telegramDataBuilder';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  /**
   * Найти клиента по ID с активной аутентификацией
   */
  async findByIdWithActiveAuth(id: number, authId: string): Promise<ClientWithAuthType | null> {
    return await this.clientRepository.findByIdWithActiveAuth(id, authId);
  }

  /**
   * Создать нового клиента
   */
  async create(data: CreateClientType): Promise<ClientType | null> {
    // Проверяем, существует ли клиент с таким email
    if (data.email) {
      const existingClient = await this.clientRepository.findByEmail(data.email);
      if (existingClient) {
        console.error('Client with this email already exists');
        return null;
      }
    }

    return await this.clientRepository.create(data);
  }

  /**
   * Обновить refresh token
   */
  async updateRefreshToken(authId: string, refreshToken: string, expiresAt: Date): Promise<boolean> {
    return await this.clientRepository.updateRefreshToken(authId, refreshToken, expiresAt);
  }

  /**
   * Деактивировать аутентификацию клиента
   */
  async deactivateAuth(authId: string): Promise<boolean> {
    return await this.clientRepository.deactivateAuth(authId);
  }

  /**
   * Проверить аутентификацию пользователя
   */
  async checkAuth(userId: number, authId: string): Promise<AuthResult> {
    try {
      const user = await this.clientRepository.findByIdWithActiveAuth(userId, authId);
      
      if (!user || user.tclients_auth.length === 0) {
        return { 
          isAuthenticated: false, 
          error: 'User not found or inactive' 
        };
      }

      return { 
        isAuthenticated: true, 
        user 
      };
    } catch (error) {
      console.error('Auth check error:', error);
      return { 
        isAuthenticated: false, 
        error: 'Authentication error' 
      };
    }
  }

  /**
   * Получить роль пользователя
   */
  async getUserRole(userId: number, authId: string): Promise<string | null> {
    const user = await this.clientRepository.findByIdWithActiveAuth(userId, authId);
    
    if (!user || user.tclients_auth.length === 0) {
      return null;
    }

    return user.tclients_auth[0].role || 'user';
  }


  /**
   * Создать или обновить клиента с Telegram аутентификацией
   */
  async createOrUpdateWithTelegramAuth(
    telegramData: TelegramUser,
    authId: string,
    tokenExpiresAt: Date
  ): Promise<ClientWithAuthType | null> {
    try {
      return await prisma.$transaction(async (tx) => {
        const client = await this.clientRepository.findByAuthIdTx(tx, authId);
        
        if (client) {
          return await this.updateExistingClient(tx, client, telegramData);
        } else {
          return await this.createNewClient(tx, telegramData, authId, tokenExpiresAt);
        }
      });
    } catch (error) {
      console.error('Error in transaction:', error);
      return null;
    }
  }

  /**
   * Обновить существующего клиента
   */
  private async updateExistingClient(
    tx: any,
    client: ClientWithAuthType,
    telegramData: TelegramUser
  ): Promise<ClientWithAuthType | null> {
    const updateData = this.buildClientUpdateData(telegramData);
    await this.clientRepository.updateTx(tx, client.id, updateData);

    if (client.tclients_auth.length > 0) {
      await this.clientRepository.updateAuthTx(tx, client.tclients_auth[0].id, {
        last_login: new Date(),
      });
    }

    return await this.clientRepository.findByIdWithAuthTx(tx, client.id);
  }

  /**
   * Создать нового клиента
   */
  private async createNewClient(
    tx: any,
    telegramData: TelegramUser,
    authId: string,
    tokenExpiresAt: Date
  ): Promise<ClientWithAuthType | null> {
    const createData = this.buildClientCreateData(telegramData);
    const newClient = await this.clientRepository.createTx(tx, createData);
    
    if (!newClient) return null;

    const authData = this.buildAuthCreateData(newClient.id, authId, telegramData, tokenExpiresAt);
    const auth = await this.clientRepository.createAuthTx(tx, authData);
    
    if (!auth) return null;

    return await this.clientRepository.findByIdWithAuthTx(tx, newClient.id);
  }

  /**
   * Построить данные для обновления клиента
   */
  private buildClientUpdateData(telegramData: TelegramUser): UpdateClientType {
    return TelegramDataBuilder.buildClientUpdateData(telegramData);
  }

  /**
   * Построить данные для создания клиента
   */
  private buildClientCreateData(telegramData: TelegramUser): CreateClientType {
    return TelegramDataBuilder.buildClientCreateData(telegramData);
  }

  /**
   * Построить данные для создания аутентификации
   */
  private buildAuthCreateData(
    clientId: number,
    authId: string,
    telegramData: TelegramUser,
    tokenExpiresAt: Date
  ): CreateClientAuthType {
    return TelegramDataBuilder.buildAuthCreateData(clientId, authId, telegramData, tokenExpiresAt);
  }
}