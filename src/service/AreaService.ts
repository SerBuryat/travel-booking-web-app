import { AreaEntity } from '@/entity/AreaEntity';
import { AreaRepository } from '@/repository/AreaRepository';

export class AreaService {
  private areaRepository: AreaRepository;

  constructor() {
    this.areaRepository = new AreaRepository();
  }

  /**
   * Get all areas
   */
  async getAllAreas(): Promise<AreaEntity[]> {
    return this.areaRepository.findAll();
  }

}
