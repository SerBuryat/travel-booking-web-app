import {AreaEntity} from '@/entity/AreaEntity';
import {AreaRepository} from '@/repository/AreaRepository';

export const AreaService = {

  async getAll(): Promise<AreaEntity[]> {
    return AreaRepository.findAll();
  }

}
