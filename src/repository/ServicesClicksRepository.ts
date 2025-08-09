import {prisma} from '@/lib/prisma';

export interface ServiceClickModel {
  id: number;
  tclients_id: number;
  tservices: ClickedService;
  timestamp: Date;
}

export interface ClickedService {
  id: number;
  name: string;
}

export class ServicesClicksRepository {

  async findAllByClientId(clientId: number): Promise<ServiceClickModel[]> {
    return await prisma.tservices_clicks.findMany({
      where: {tclients_id: clientId},
      orderBy: {timestamp: 'desc'},
      include: {
        tservices: true,
      },
    });
  }

  async createUnique(clientId: number, serviceId: number): Promise<{
    id: number;
    timestamp: Date;
  }> {
    // ищем по clientId и serviceId существующий клик
    const existing = await prisma.tservices_clicks.findUnique({
      where: { tclients_id_tservices_id: { tclients_id: clientId, tservices_id: serviceId } },
    });

    // если находим, то обновляем timestamp
    if (existing) {
      const updated = await prisma.tservices_clicks.update({
        where: { id: existing.id },
        data: { timestamp: new Date().toISOString() },
      });
      return {
        id: updated.id,
        timestamp: updated.timestamp,
      };
    }

    // если не находим, то создаем
    const created = await prisma.tservices_clicks.create({
      data: { tclients_id: clientId, tservices_id: serviceId },
    });

    return {
      id: created.id,
      timestamp: created.timestamp,
    };
  }
}


