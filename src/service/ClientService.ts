import { ClientRepository } from '@/repository/ClientRepository';
import { 
  ClientType, 
  ClientWithAuthType, 
  CreateClientType, 
  UpdateClientType,
  CreateClientAuthType,
  UpdateClientAuthType,
  AuthResult
} from '@/model/ClientType';
import {TelegramUser} from "@/types/telegram";
import { prisma } from '@/lib/prisma';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  /**
   * Найти клиента по ID
   */
  async findById(id: number): Promise<ClientType | null> {
    return await this.clientRepository.findById(id);
  }

  /**
   * Найти клиента по ID с аутентификацией
   */
  async findByIdWithAuth(id: number): Promise<ClientWithAuthType | null> {
    return await this.clientRepository.findByIdWithAuth(id);
  }

  /**
   * Найти клиента по ID с активной аутентификацией
   */
  async findByIdWithActiveAuth(id: number, authId: string): Promise<ClientWithAuthType | null> {
    return await this.clientRepository.findByIdWithActiveAuth(id, authId);
  }

  /**
   * Найти клиента по email
   */
  async findByEmail(email: string): Promise<ClientType | null> {
    return await this.clientRepository.findByEmail(email);
  }

  /**
   * Найти клиента по auth_id
   */
  async findByAuthId(authId: string): Promise<ClientWithAuthType | null> {
    return await this.clientRepository.findByAuthId(authId);
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
   * Обновить клиента
   */
  async update(id: number, data: UpdateClientType): Promise<ClientType | null> {
    // Проверяем, существует ли клиент
    const existingClient = await this.clientRepository.findById(id);
    if (!existingClient) {
      console.error('Client not found');
      return null;
    }

    // Если обновляется email, проверяем уникальность
    if (data.email && data.email !== existingClient.email) {
      const clientWithEmail = await this.clientRepository.findByEmail(data.email);
      if (clientWithEmail) {
        console.error('Client with this email already exists');
        return null;
      }
    }

    return await this.clientRepository.update(id, data);
  }

  /**
   * Создать аутентификацию клиента
   */
  async createAuth(data: CreateClientAuthType): Promise<boolean> {
    // Проверяем, существует ли клиент
    const client = await this.clientRepository.findById(data.tclients_id);
    if (!client) {
      console.error('Client not found');
      return false;
    }

    // Проверяем, существует ли уже аутентификация с таким auth_id
    const existingAuth = await this.clientRepository.findByAuthId(data.auth_id);
    if (existingAuth) {
      console.error('Auth with this auth_id already exists');
      return false;
    }

    const auth = await this.clientRepository.createAuth(data);
    return auth !== null;
  }

  /**
   * Обновить аутентификацию клиента
   */
  async updateAuth(id: number, data: UpdateClientAuthType): Promise<boolean> {
    const auth = await this.clientRepository.updateAuth(id, data);
    return auth !== null;
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
   * Удалить клиента
   */
  async delete(id: number): Promise<boolean> {
    // Проверяем, существует ли клиент
    const client = await this.clientRepository.findById(id);
    if (!client) {
      console.error('Client not found');
      return false;
    }

    return await this.clientRepository.delete(id);
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
   * Проверить, имеет ли пользователь требуемую роль
   */
  async hasRole(userId: number, authId: string, requiredRoles: string[]): Promise<boolean> {
    const userRole = await this.getUserRole(userId, authId);
    
    if (!userRole) {
      return false;
    }

    return requiredRoles.includes(userRole);
  }


  /**
   * Создать или обновить клиента с Telegram аутентификацией в транзакции
   */
  async createOrUpdateWithTelegramAuthInTransaction(
    telegramData: TelegramUser,
    authId: string,
    refreshToken: string,
    tokenExpiresAt: Date
  ): Promise<ClientWithAuthType | null> {
    try {
      return await prisma.$transaction(async (tx) => {
        // Ищем существующего клиента по auth_id используя транзакционную версию
        const client = await this.clientRepository.findByAuthIdTx(tx, authId);

        if (client) {
          // Обновляем существующего клиента
          const updateData: UpdateClientType = {
            name: telegramData.first_name + (telegramData.last_name ? ` ${telegramData.last_name}` : ''),
            additional_info: {
              telegram_id: telegramData.id,
              username: telegramData.username,
              language_code: telegramData.language_code,
              ...telegramData
            }
          };

          await this.clientRepository.updateTx(tx, client.id, updateData);

          // Обновляем аутентификацию с refresh token
          if (client.tclients_auth.length > 0) {
            await this.clientRepository.updateAuthTx(tx, client.tclients_auth[0].id, {
              last_login: new Date(),
              refresh_token: refreshToken,
              token_expires_at: tokenExpiresAt,
            });
          }

          return await this.clientRepository.findByIdWithAuthTx(tx, client.id);
        } else {
          // Создаем нового клиента
          const createData: CreateClientType = {
            name: telegramData.first_name + (telegramData.last_name ? ` ${telegramData.last_name}` : ''),
            additional_info: {
              telegram_id: telegramData.id,
              username: telegramData.username,
              language_code: telegramData.language_code,
              ...telegramData
            }
          };

          const newClient = await this.clientRepository.createTx(tx, createData);
          if (!newClient) {
            return null;
          }

          // Создаем аутентификацию с refresh token
          const authData: CreateClientAuthType = {
            tclients_id: newClient.id,
            auth_type: 'telegram',
            auth_id: authId,
            auth_context: telegramData,
            refresh_token: refreshToken,
            token_expires_at: tokenExpiresAt,
            role: 'user'
          };

          const auth = await this.clientRepository.createAuthTx(tx, authData);
          if (!auth) {
            return null;
          }

          return await this.clientRepository.findByIdWithAuthTx(tx, newClient.id);
        }
      });
    } catch (error) {
      console.error('Error in transaction:', error);
      return null;
    }
  }
}