import {NextRequest, NextResponse} from 'next/server';
import {ServicesClicksService} from '@/service/ServicesClicksService';
import {getUserAuth} from '@/lib/auth/user-auth';
import {withErrorHandling} from '@/lib/api/error-handler';

async function handlePost(_request: NextRequest, { params }: { params: { serviceId: string } }) {
  const id = Number(params.serviceId);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid serviceId' }, { status: 400 });
  }

  const userAuth = await getUserAuth();
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


