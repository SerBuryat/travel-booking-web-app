import { prisma } from '@/lib/prisma';
import { ServiceEntity } from '@/entity/ServiceEntity';

export class ServiceRepository {
  /**
   * Find all services by category IDs
   */
  static async findAllByCategoryIdIn(categoryIds: number[]): Promise<ServiceEntity[]> {
    const services = await prisma.tservices.findMany({
      where: {
        tcategories_id: { in: categoryIds },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tcategories_id: true,
      },
      orderBy: { id: 'asc' },
    });
    
    return services.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description ?? '',
      price: s.price ? String(s.price) : '0',
      tcategories_id: s.tcategories_id,
    }));
  }

  /**
   * Get service by ID
   */
  static async findById(serviceId: number): Promise<ServiceEntity | null> {
    const service = await prisma.tservices.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tcategories_id: true,
        provider_id: true,
        status: true,
        created_at: true,
      },
    });
    if (!service) return null;
    
    return {
      id: service.id,
      name: service.name,
      description: service.description ?? '',
      price: service.price ? String(service.price) : '0',
      tcategories_id: service.tcategories_id,
      provider_id: service.provider_id,
      status: service.status,
      created_at: service.created_at instanceof Date ? service.created_at.toISOString() : String(service.created_at),
    };
  }

  /**
   * Find all services by name search
   */
  static async findAllByNameLike(search: string): Promise<ServiceEntity[]> {
    if (!search || search.length < 3) return [];
    const services = await prisma.tservices.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tcategories_id: true,
        priority: true,
      },
      orderBy: { priority: 'desc' },
    });
    
    return services.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description ?? '',
      price: s.price ? String(s.price) : '0',
      tcategories_id: s.tcategories_id,
      priority: s.priority ? String(s.priority) : '0',
    }));
  }

  /**
   * Get popular services by name search
   */
  static async findPopularByLikeName(search: string): Promise<ServiceEntity[]> {
    if (!search || search.length < 3) return [];
    const services = await prisma.tservices.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tcategories_id: true,
        priority: true,
      },
      orderBy: { priority: 'desc' },
    });
    
    return services.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description ?? '',
      price: s.price ? String(s.price) : '0',
      tcategories_id: s.tcategories_id,
      priority: s.priority ? String(s.priority) : '0',
    }));
  }

  /**
   * Get popular services by name search and filter by category IDs
   */
  static async findPopularByLikeNameAndCategoryIn(search: string, categoryIds: number[]): Promise<ServiceEntity[]> {
    if (!search || search.length < 3) return [];
    const services = await prisma.tservices.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        tcategories_id: {
          in: categoryIds,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tcategories_id: true,
        priority: true,
      },
      orderBy: { priority: 'desc' },
    });
    
    return services.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description ?? '',
      price: s.price ? String(s.price) : '0',
      tcategories_id: s.tcategories_id,
      priority: s.priority ? String(s.priority) : '0',
    }));
  }

  /**
   * Get popular services
   */
  static async findPopular(popularCount: number = 10): Promise<ServiceEntity[]> {
    const services = await prisma.tservices.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tcategories_id: true,
        priority: true,
      },
      orderBy: { priority: 'desc' },
      take: popularCount,
    });
    
    return services.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description ?? '',
      price: s.price ? String(s.price) : '0',
      tcategories_id: s.tcategories_id,
      priority: s.priority ? String(s.priority) : '0',
    }));
  }
} 