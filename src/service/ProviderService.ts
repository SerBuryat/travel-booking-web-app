import { ProviderRepository } from '@/repository/ProviderRepository';
import { ProviderEntity } from '@/entity/ProviderEntity';

export class ProviderService {
  private providerRepository: ProviderRepository;

  constructor() {
    this.providerRepository = new ProviderRepository();
  }

  /**
   * Получить провайдера по ID клиента
   */
  async getProviderForClient(clientId: number): Promise<ProviderEntity | null> {
    try {
      return await this.providerRepository.findByClientId(clientId);
    } catch (error) {
      console.error('Error getting provider:', error);
      return null;
    }
  }

}
