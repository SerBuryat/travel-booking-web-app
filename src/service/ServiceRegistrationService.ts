import { ServiceRepository } from '@/repository/ServiceRepository';
import { ServiceCreateModel } from '@/model/ServiceCreateModel';
import { CreateServiceEntity } from '@/entity/CreateServiceEntity';

export class ServiceRegistrationService {
  private serviceRepository: ServiceRepository;

  constructor() {
    this.serviceRepository = new ServiceRepository();
  }

  /**
   * Create new service with related entities
   */
  async createService(serviceData: ServiceCreateModel): Promise<CreateServiceEntity> {
    try {
      // Валидация базовых данных (минимальная для MVP)
      if (!serviceData.name || !serviceData.description || !serviceData.price) {
        throw new Error('Required fields are missing');
      }

      if (parseFloat(serviceData.price) <= 0) {
        throw new Error('Price must be greater than 0');
      }

      // Создание сервиса через репозиторий
      const createdService = await this.serviceRepository.createService(serviceData);
      
      return createdService;
    } catch (error) {
      // Логирование ошибки для отладки
      console.error('Error creating service:', error);
      throw error;
    }
  }
}
