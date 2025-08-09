import {ServiceClickModel, ServicesClicksRepository} from '@/repository/ServicesClicksRepository';

export class ServicesClicksService {
  private repo: ServicesClicksRepository;

  constructor() { 
    this.repo = new ServicesClicksRepository();
  }

  async create(clientId: number, serviceId: number) {
    return this.repo.createUnique(clientId, serviceId);
  }

  async getByClientId(clientId: number): Promise<ServiceClickModel[]> {
    return  await this.repo.findAllByClientId(clientId);
  }

}