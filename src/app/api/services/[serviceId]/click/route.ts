import {NextRequest, NextResponse} from 'next/server';
import {ServicesClicksService} from '@/service/ServicesClicksService';
import {getUserAuthOrThrow} from '@/lib/auth/userAuth';
import {withErrorHandling} from '@/lib/api/errorHandler';

async function handlePost(_request: NextRequest, { params }: { params: { serviceId: string } }) {
  const id = Number(params.serviceId);
  console.log("Service id: " + id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid serviceId' }, { status: 400 });
  }

  const userAuth = await getUserAuthOrThrow();
  const clicksService = new ServicesClicksService();

  try {
    const created = await clicksService.create(userAuth.userId, id);
    return NextResponse.json({ id: created.id, timestamp: created.timestamp }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}

export const POST = withErrorHandling(handlePost, {
  authErrorMessage: 'Unauthorized',
  defaultErrorMessage: 'Internal server error'
});


