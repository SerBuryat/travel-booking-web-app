import {type NextRequest, NextResponse} from 'next/server';
import {getUserAuth} from '@/lib/auth/user-auth';
import {withErrorHandling} from '@/lib/api/error-handler';

async function handleGet(_request: NextRequest) {
  const userAuth = await getUserAuth();
  return NextResponse.json(userAuth);
}

export const GET = withErrorHandling(handleGet);