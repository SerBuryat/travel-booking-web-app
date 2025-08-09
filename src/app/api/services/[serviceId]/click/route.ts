import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/server-auth';
import { ServicesClicksService } from '@/service/ServicesClicksService';

export async function POST(_req: NextRequest, { params }: { params: { serviceId: string } }) {
  const id = Number(params.serviceId);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid serviceId' }, { status: 400 });
  }

  let user;
  try {
    user = await getServerUser();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clicksService = new ServicesClicksService();
  try {
    const created = await clicksService.createUniqueClick(user.id, id);
    return NextResponse.json({ id: created.id, timestamp: created.timestamp }, { status: 201 });
  } catch {
    // If unique violation path reached, createUniqueClick already returns existing
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}


