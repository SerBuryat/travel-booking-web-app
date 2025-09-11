import {ProviderRepository} from '@/repository/ProviderRepository';
import {ProviderEntity} from '@/entity/ProviderEntity';

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

  /**
   * Создать нового провайдера или получить существующего
   */
  async createOrGetProvider(clientId: number, companyName: string, phone: string, contactPerson: string): Promise<ProviderEntity> {
    try {
      // Сначала проверяем, есть ли уже провайдер у этого клиента
      const existingProvider = await this.getProviderForClient(clientId);
      
      if (existingProvider) {
        // Если провайдер уже существует, возвращаем его
        return existingProvider;
      }
      
      // Если провайдера нет, создаем нового
      return await this.providerRepository.createProvider(clientId, companyName, phone, contactPerson);
    } catch (error) {
      console.error('Error creating or getting provider:', error);
      throw error;
    }
  }
}
