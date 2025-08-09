import { prisma } from '@/lib/prisma';

export interface ServiceClickEntity {
  id: number;
  tclients_id: number;
  tservices_id: number;
  timestamp: string;
}

export class ServicesClicksRepository {

  async findByClientId(clientId: number): Promise<ServiceClickEntity[]> {
    const items = await prisma.tservices_clicks.findMany({
      where: { tclients_id: clientId },
      orderBy: { timestamp: 'desc' },
    });
    return items.map((i) => ({
      id: i.id,
      tclients_id: i.tclients_id,
      tservices_id: i.tservices_id,
      timestamp: i.timestamp instanceof Date ? i.timestamp.toISOString() : String(i.timestamp),
    }));
  }

  async createUnique(clientId: number, serviceId: number): Promise<ServiceClickEntity> {
    // If exists, return existing; else create
    try {
      const created = await prisma.tservices_clicks.create({
        data: { tclients_id: clientId, tservices_id: serviceId },
      });
      return {
        id: created.id,
        tclients_id: created.tclients_id,
        tservices_id: created.tservices_id,
        timestamp: created.timestamp instanceof Date ? created.timestamp.toISOString() : String(created.timestamp),
      };
    } catch (e: any) {
      // Unique violation -> return existing
      const existing = await prisma.tservices_clicks.findUnique({
        where: {
          tclients_id_tservices_id: {
            tclients_id: clientId,
            tservices_id: serviceId,
          },
        },
      });
      if (!existing) throw e;
      return {
        id: existing.id,
        tclients_id: existing.tclients_id,
        tservices_id: existing.tservices_id,
        timestamp: existing.timestamp instanceof Date ? existing.timestamp.toISOString() : String(existing.timestamp),
      };
    }
  }
}


