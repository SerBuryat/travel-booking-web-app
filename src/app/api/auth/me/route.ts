import {type NextRequest, NextResponse} from 'next/server';
import {getUserAuthOrThrow} from '@/lib/auth/getUserAuth';
import {withErrorHandling} from '@/lib/api/errorHandler';

async function handleGet(_request: NextRequest) {
  const userAuth = await getUserAuthOrThrow();
  return NextResponse.json(userAuth);
}

export const GET = withErrorHandling(handleGet);