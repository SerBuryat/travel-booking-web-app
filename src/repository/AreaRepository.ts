import { prisma } from '@/lib/prisma';
import { AreaEntity } from '@/entity/AreaEntity';

export class AreaRepository {
  /**
   * Common field selector for area entities
   */
  private readonly AREA_SELECT = {
    id: true,
    name: true,
    sysname: true,
    parent_id: true,
    tier: true,
    created_at: true,
  } as const;

  /**
   * Converts raw Prisma area data to AreaEntity
   */
  private toAreaEntity(data: any): AreaEntity {
    return {
      id: data.id,
      name: data.name,
      sysname: data.sysname,
      parent_id: data.parent_id,
      tier: data.tier,
      created_at: data.created_at,
    };
  }

  /**
   * Find all areas
   */
  async findAll(): Promise<AreaEntity[]> {
    const areas = await prisma.tarea.findMany({
      select: this.AREA_SELECT,
      orderBy: [
        { tier: 'asc' },
        { name: 'asc' }
      ],
    });

    return areas.map(area => this.toAreaEntity(area));
  }

}
