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

  /**
   * Get all parent areas (areas with no parent)
   */
  async getAllParentAreas(): Promise<AreaEntity[]> {
    return this.areaRepository.findAllParent();
  }

  /**
   * Get areas by parent ID
   */
  async getAreasByParentId(parentId: number): Promise<AreaEntity[]> {
    return this.areaRepository.findByParentId(parentId);
  }

  /**
   * Get area by ID
   */
  async getAreaById(areaId: number): Promise<AreaEntity | null> {
    return this.areaRepository.findById(areaId);
  }
}
