import {prisma} from '@/lib/prisma';
import {AreaEntity} from "@/entity/AreaEntity";

export const AreaRepository = {

  async findAll(): Promise<AreaEntity[]> {
    return prisma.tarea.findMany({
      orderBy: [
        {name: 'asc'}
      ]
    });
  }

};
