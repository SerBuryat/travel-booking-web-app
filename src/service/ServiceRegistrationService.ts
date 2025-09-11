import {ServiceRepository} from '@/repository/ServiceRepository';
import {ProviderService} from '@/service/ProviderService';
import {ServiceCreateModel} from '@/model/ServiceCreateModel';
import {CreateServiceEntity} from '@/entity/CreateServiceEntity';

export class ServiceRegistrationService {
  private serviceRepository: ServiceRepository;
  private providerService: ProviderService;

  constructor() {
    this.serviceRepository = new ServiceRepository();
    this.providerService = new ProviderService();
  }

  /**
   * Create new service with related entities
   */
  async createService(serviceData: ServiceCreateModel, clientId: number): Promise<CreateServiceEntity> {
    try {
      // Валидация базовых данных (минимальная для MVP)
      if (!serviceData.name || !serviceData.description || !serviceData.price) {
        throw new Error('Required fields are missing');
      }

      if (parseFloat(serviceData.price) <= 0) {
        throw new Error('Price must be greater than 0');
      }

      // Проверяем обязательные поля провайдера
      if (!serviceData.providerCompanyName || !serviceData.providerContactPerson || !serviceData.providerPhone) {
        throw new Error('Provider information is required');
      }

      // Создаем или получаем существующего провайдера
      const provider = await this.providerService.createOrGetProvider(
        clientId,
        serviceData.providerCompanyName,
        serviceData.providerPhone,
        serviceData.providerContactPerson
      );

      // Создаем сервис с привязкой к провайдеру
      const serviceWithProvider = {
        ...serviceData,
        providerId: provider.id // Добавляем ID провайдера для создания сервиса
      };

      const createdService = await this.serviceRepository.createService(serviceWithProvider);
      
      return createdService;
    } catch (error) {
      // Логирование ошибки для отладки
      console.error('Error creating service:', error);
      throw error;
    }
  }
}
