import { ServicesClicksRepository, ServiceClickEntity } from '@/repository/ServicesClicksRepository';
import { ServiceRepository } from '@/repository/ServiceRepository';

export interface ServiceClickWithServiceName {
  id: number;
  serviceId: number;
  serviceName: string;
  timestamp: string;
}

export class ServicesClicksService {
  private repo: ServicesClicksRepository;
  private serviceRepo: ServiceRepository;

  constructor() {
    this.repo = new ServicesClicksRepository();
    this.serviceRepo = new ServiceRepository();
  }

  async createUniqueClick(clientId: number, serviceId: number) {
    return this.repo.createUnique(clientId, serviceId);
  }

  async getByClientId(clientId: number): Promise<ServiceClickWithServiceName[]> {
    const clicks = await this.repo.findByClientId(clientId);
    if (clicks.length === 0) return [];

    // load service names in parallel
    const uniqueServiceIds = Array.from(new Set(clicks.map((c) => c.tservices_id)));
    const services = await Promise.all(uniqueServiceIds.map((id) => this.serviceRepo.findById(id)));
    const idToName = new Map<number, string>();
    services.forEach((s, idx) => {
      const id = uniqueServiceIds[idx];
      if (s) idToName.set(id, s.name);
    });

    return clicks.map((c) => ({
      id: c.id,
      serviceId: c.tservices_id,
      serviceName: idToName.get(c.tservices_id) ?? `Сервис #${c.tservices_id}`,
      timestamp: c.timestamp,
    }));
  }

  // alias following the requested naming
  async getByClientsId(clientId: number): Promise<ServiceClickWithServiceName[]> {
    return this.getByClientId(clientId);
  }
}


