import {ServiceEntity} from '@/entity/ServiceEntity';
import {ServiceType, ServiceTypeFull} from '@/model/ServiceType';
import {CategoryService} from './CategoryService';

export class ServiceService {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  /**
   * Maps raw service data to ServiceEntity
   */
  static mapToServiceEntity(rawService: any): ServiceEntity {
    return {
      id: rawService.id,
      name: rawService.name,
      description: rawService.description ?? '',
      price: rawService.price ? String(rawService.price) : '0',
      tcategories_id: rawService.tcategories_id,
      provider_id: rawService.provider_id,
      status: rawService.status,
      created_at: rawService.created_at instanceof Date 
        ? rawService.created_at.toISOString() 
        : String(rawService.created_at),
      priority: rawService.priority ? String(rawService.priority) : '0',
      rating: rawService.rating ? Number(rawService.rating) : undefined,
      view_count: rawService.view_count || 0,
    };
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

  async mapToServiceTypeFull(entity: ServiceEntity & { contacts: any[] }): Promise<ServiceTypeFull> {
    const base = await this.mapToServiceType(entity);
    return {
      ...base,
      contacts: entity.contacts ?? [],
    };
  }

  /**
   * Maps array of ServiceEntity to ServiceType with categories
   */
  async mapToServiceTypes(entities: ServiceEntity[]): Promise<ServiceType[]> {
    return Promise.all(entities.map(entity => this.mapToServiceType(entity)));
  }

  /**
   * Get services by category IDs with category relations
   */
  async getServicesByCategoryIds(categoryIds: number[]): Promise<ServiceType[]> {
    const { ServiceRepository } = await import('@/repository/ServiceRepository');
    const serviceRepository = new ServiceRepository();
    const services = await serviceRepository.findAllByCategoryIdIn(categoryIds);
    return this.mapToServiceTypes(services);
  }

  /**
   * Get service by ID with category relation
   */
  async getServiceById(serviceId: number): Promise<ServiceTypeFull | null> {
    const { ServiceRepository } = await import('@/repository/ServiceRepository');
    const serviceRepository = new ServiceRepository();
    const service = await serviceRepository.findFullById(serviceId);
    if (!service) return null;
    return this.mapToServiceTypeFull(service);
  }

  /**
   * Get popular services by name with category relations
   */
  async getPopularServicesByName(search: string): Promise<ServiceType[]> {
    const { ServiceRepository } = await import('@/repository/ServiceRepository');
    const serviceRepository = new ServiceRepository();
    const services = await serviceRepository.findPopularByLikeName(search);
    return this.mapToServiceTypes(services);
  }

  /**
   * Get popular services by name and filter by category IDs
   */
  async getPopularServicesByNameAndCategoryIn(search: string, categoryIds: number[]): Promise<ServiceType[]> {
    const { ServiceRepository } = await import('@/repository/ServiceRepository');
    const serviceRepository = new ServiceRepository();
    const services = await serviceRepository.findPopularByLikeNameAndCategoryIn(search, categoryIds);
    return this.mapToServiceTypes(services);
  }

  /**
   * Get popular services with category relations
   */
  async getPopularServices(popularCount: number = 10): Promise<ServiceType[]> {
    const { ServiceRepository } = await import('@/repository/ServiceRepository');
    const serviceRepository = new ServiceRepository();
    const services = await serviceRepository.findPopular(popularCount);
    return this.mapToServiceTypes(services);
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