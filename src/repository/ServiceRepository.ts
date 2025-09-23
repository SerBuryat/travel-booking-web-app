import {prisma} from '@/lib/db/prisma';
import {ServiceEntity} from '@/entity/ServiceEntity';
import {ContactsType} from '@/model/ContactsType';
import {CreateServiceEntity} from '@/entity/CreateServiceEntity';
import {ServiceCreateModel} from '@/model/ServiceCreateModel';

export class ServiceRepository {
  /**
   * Find all services by category IDs
   */
  async findAllByCategoryIdIn(categoryIds: number[]): Promise<ServiceEntity[]> {
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
        rating: true,
      },
      orderBy: { id: 'asc' },
    });
    
    return services.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description ?? '',
      price: s.price ? String(s.price) : '0',
      tcategories_id: s.tcategories_id,
      rating: s.rating ? Number(s.rating) : undefined,
    }));
  }

  /**
   * Get service by ID including contacts
   */
  async findFullById(serviceId: number): Promise<(ServiceEntity & { contacts: ContactsType[] }) | null> {
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
        rating: true,
        tcontacts: {
          select: {
            id: true,
            tservices_id: true,
            email: true,
            phone: true,
            tg_username: true,
            website: true,
            whatsap: true,
          },
        },
      },
    });
    if (!service) return null;
    const base: ServiceEntity = {
      id: service.id,
      name: service.name,
      description: service.description ?? '',
      price: service.price ? String(service.price) : '0',
      tcategories_id: service.tcategories_id,
      provider_id: service.provider_id,
      status: service.status,
      created_at: service.created_at instanceof Date ? service.created_at.toISOString() : String(service.created_at),
      rating: service.rating ? Number(service.rating) : undefined,
    };
    const contacts: ContactsType[] = service.tcontacts.map(c => ({
      id: c.id,
      tservices_id: c.tservices_id,
      email: c.email,
      phone: c.phone,
      tg_username: c.tg_username,
      website: c.website,
      whatsap: c.whatsap,
    }));
    return { ...base, contacts };
  }

  /**
   * Get popular services
   */
  async findPopular(popularCount: number = 10): Promise<ServiceEntity[]> {
    const services = await prisma.tservices.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tcategories_id: true,
        priority: true,
        rating: true,
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
      rating: s.rating ? Number(s.rating) : undefined,
    }));
  }

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

  /**
   * Create service with related entities using prisma include
   */
  async createService(serviceData: ServiceCreateModel & { providerId?: number }): Promise<CreateServiceEntity> {
    const result = await prisma.tservices.create({
      data: {
        name: serviceData.name,
        description: serviceData.description,
        price: parseFloat(serviceData.price),
        tcategories_id: serviceData.tcategories_id,
        provider_id: serviceData.providerId || 7, // Используем переданный providerId или fallback
        active: true,
        status: 'published',
        service_options: serviceData.serviceOptions || null,
        tcontacts: {
          create: {
            email: 'default@example.com', // Обязательное поле в БД
            phone: serviceData.phone || null,
            tg_username: serviceData.tg_username || null,
          }
        },
        tlocations: {
          create: {
            address: serviceData.address,
            tarea_id: serviceData.tarea_id,
          }
        }
      },
      include: {
        tcontacts: true,
        tlocations: true,
      }
    });

    return {
      id: result.id,
      name: result.name,
      description: result.description || '',
      price: String(result.price),
      tcategories_id: result.tcategories_id,
      provider_id: result.provider_id,
      status: result.status,
      created_at: result.created_at.toISOString(),
      serviceOptions: result.serviceOptions as string[] | null,
      tcontacts: result.tcontacts.map(contact => ({
        id: contact.id,
        tservices_id: contact.tservices_id,
        email: contact.email,
        phone: contact.phone,
        tg_username: contact.tg_username,
        website: contact.website,
        whatsap: contact.whatsap,
      })),
      tlocations: result.tlocations.map(location => ({
        id: location.id,
        tservices_id: location.tservices_id,
        name: location.name,
        address: location.address,
        latitude: location.latitude ? String(location.latitude) : null,
        longitude: location.longitude ? String(location.longitude) : null,
        tarea_id: location.tarea_id,
        description: location.description,
      })),
    };
  }
} 