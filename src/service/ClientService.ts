import {ClientRepository} from '@/repository/ClientRepository';
import {ClientWithAuthType} from '@/model/ClientType';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  /**
   * Обновить refresh token
   */
  async updateRefreshToken(authId: number, refreshToken: string, expiresAt: Date): Promise<boolean> {
    return await this.clientRepository.updateRefreshToken(authId, refreshToken, expiresAt);
  }

  /**
   * Деактивировать аутентификацию клиента
   */
  async deactivateAuth(authId: number): Promise<boolean> {
    return await this.clientRepository.deactivateAuth(authId);
  }

  /**
   * Получить клиента по ID с аутентификацией
   */
  async getByIdWithAuth(id: number): Promise<ClientWithAuthType | null> {
    return await this.clientRepository.findByIdWithAuth(id);
  }
}