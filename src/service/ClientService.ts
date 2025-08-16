import { ClientRepository } from '@/repository/ClientRepository';
import {
  ClientWithAuthType
} from '@/model/ClientType';
import { TelegramUser } from "@/types/telegram";
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
   * Получить клиента по ID с аутентификацией
   */
  async getByIdWithAuth(id: number): Promise<ClientWithAuthType | null> {
    return await this.clientRepository.findByIdWithAuth(id);
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
      console.log(telegramData);
      const client = await this.clientRepository.findByAuthId(authId);
      
      if (client) {
        return await this.updateExistingClient(client, telegramData);
      } else {
        return await this.createNewClient(telegramData, authId, tokenExpiresAt);
      }
    } catch (error) {
      console.error('Error in createOrUpdateWithTelegramAuth:', error);
      return null;
    }
  }

  /**
   * Обновить существующего клиента
   */
  private async updateExistingClient(
    client: ClientWithAuthType,
    telegramData: TelegramUser
  ): Promise<ClientWithAuthType | null> {
    const updateData = TelegramDataBuilder.buildClientUpdateData(telegramData);
    
    if (client.tclients_auth.length > 0) {
      return await this.clientRepository.updateWithAuth(client.id, {
        ...updateData,
        tclients_auth: {
          update: {
            where: { id: client.tclients_auth[0].id },
            data: { last_login: new Date() , is_active: true, role: 'user'}
          }
        }
      });
    }

    return await this.clientRepository.updateWithAuth(client.id, updateData);
  }

  /**
   * Создать нового клиента
   */
  private async createNewClient(
    telegramData: TelegramUser,
    authId: string,
    tokenExpiresAt: Date
  ): Promise<ClientWithAuthType | null> {
    const createData = TelegramDataBuilder.buildClientCreateData(telegramData);
    const authData = TelegramDataBuilder.buildAuthCreateData(authId, telegramData, tokenExpiresAt);
    
    return await this.clientRepository.createWithAuth({
      ...createData,
      tclients_auth: {
        create: authData
      }
    });
  }

  /**
   * Обновить роль аутентификации клиента
   */
  async updateAuthRole(clientId: number, authId: number, newRole: string): Promise<ClientWithAuthType | null> {
    try {
      return await this.clientRepository.updateWithAuth(clientId, {
        tclients_auth: {
          update: {
            where: { id: authId },
            data: { role: newRole }
          }
        }
      });
    } catch (error) {
      console.error('Error updating auth role:', error);
      return null;
    }
  }
}