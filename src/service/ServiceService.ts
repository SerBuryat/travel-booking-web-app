import {ServiceEntity} from '@/entity/ServiceEntity';
import {ServiceType} from '@/model/ServiceType';
import {CategoryService} from './CategoryService';

export class ServiceService {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }
  /**
   * Maps ServiceEntity to ServiceType with category relation
   */
  async mapToServiceType(entity: ServiceEntity): Promise<ServiceType> {
    const category = await this.categoryService.getById(entity.tcategories_id);
    
    return {
      ...entity,
      category: category ? {
        id: category.id,
        code: category.code,
        sysname: category.sysname,
        name: category.name,
        photo: category.photo,
        parent_id: category.parent_id,
      } : undefined,
    };
  }

  /**
   * Maps array of ServiceEntity to ServiceType with categories
   */
  async mapToServiceTypes(entities: ServiceEntity[]): Promise<ServiceType[]> {
    return Promise.all(entities.map(entity => this.mapToServiceType(entity)));
  }

  /**
   * Get all services by provider ID with category relations
   */
  async getAllServicesByProviderId(providerId: number): Promise<ServiceType[]> {
    const { ServiceRepository } = await import('@/repository/ServiceRepository');
    const serviceRepository = new ServiceRepository();
    const services = await serviceRepository.getAllByProviderId(providerId);
    return this.mapToServiceTypes(services);
  }
} 