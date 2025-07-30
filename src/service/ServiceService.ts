import { ServiceEntity } from '@/entity/ServiceEntity';
import { ServiceType } from '@/model/ServiceType';
import { CategoryService } from './CategoryService';

export class ServiceService {
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
    };
  }

  /**
   * Maps ServiceEntity to ServiceType with category relation
   */
  static async mapToServiceType(entity: ServiceEntity): Promise<ServiceType> {
    const category = await CategoryService.getById(entity.tcategories_id);
    
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
  static async mapToServiceTypes(entities: ServiceEntity[]): Promise<ServiceType[]> {
    return Promise.all(entities.map(entity => this.mapToServiceType(entity)));
  }

  /**
   * Get services by category IDs with category relations
   */
  static async getServicesByCategoryIds(categoryIds: number[]): Promise<ServiceType[]> {
    const { ServiceRepository } = await import('@/repository/ServiceRepository');
    const services = await ServiceRepository.findAllByCategoryIdIn(categoryIds);
    return this.mapToServiceTypes(services);
  }

  /**
   * Get service by ID with category relation
   */
  static async getServiceById(serviceId: number): Promise<ServiceType | null> {
    const { ServiceRepository } = await import('@/repository/ServiceRepository');
    const service = await ServiceRepository.findById(serviceId);
    if (!service) return null;
    return this.mapToServiceType(service);
  }

  /**
   * Search all services by name with category relations
   */
  static async searchServicesByName(search: string): Promise<ServiceType[]> {
    const { ServiceRepository } = await import('@/repository/ServiceRepository');
    const services = await ServiceRepository.findAllByNameLike(search);
    return this.mapToServiceTypes(services);
  }

  /**
   * Get popular services by name with category relations
   */
  static async getPopularServicesByName(search: string): Promise<ServiceType[]> {
    const { ServiceRepository } = await import('@/repository/ServiceRepository');
    const services = await ServiceRepository.findPopularByLikeName(search);
    return this.mapToServiceTypes(services);
  }

  /**
   * Get popular services by name and filter by category IDs
   */
  static async getPopularServicesByNameAndCategoryIn(search: string, categoryIds: number[]): Promise<ServiceType[]> {
    const { ServiceRepository } = await import('@/repository/ServiceRepository');
    const services = await ServiceRepository.findPopularByLikeNameAndCategoryIn(search, categoryIds);
    return this.mapToServiceTypes(services);
  }

  /**
   * Get popular services with category relations
   */
  static async getPopularServices(popularCount: number = 10): Promise<ServiceType[]> {
    const { ServiceRepository } = await import('@/repository/ServiceRepository');
    const services = await ServiceRepository.findPopular(popularCount);
    return this.mapToServiceTypes(services);
  }
} 