import {prisma} from '@/lib/db/prisma';
import {ServiceEntity} from '@/entity/ServiceEntity';

export class ServiceRepository {

  /**
   * Get all services by provider ID
   */
  async getAllByProviderId(providerId: number): Promise<ServiceEntity[]> {
    const services = await prisma.tservices.findMany({
      where: {
        provider_id: providerId,
        active: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tcategories_id: true,
        status: true,
        created_at: true,
        rating: true,
        view_count: true,
        priority: true,
      },
      orderBy: { created_at: 'desc' },
    });
    
    return services.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description ?? '',
      price: s.price ? String(s.price) : '0',
      tcategories_id: s.tcategories_id,
      status: s.status,
      created_at: s.created_at instanceof Date ? s.created_at.toISOString() : String(s.created_at),
      rating: s.rating ? Number(s.rating) : undefined,
      view_count: s.view_count || 0,
      priority: s.priority ? String(s.priority) : '0',
    }));
  }

} 