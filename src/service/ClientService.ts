import {ClientRepository} from '@/repository/ClientRepository';
import {ClientWithAuthType} from '@/model/ClientType';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  /**
   * Получить клиента по ID с аутентификацией
   */
  async getByIdWithAuth(id: number): Promise<ClientWithAuthType | null> {
    return await this.clientRepository.findByIdWithAuth(id);
  }
}