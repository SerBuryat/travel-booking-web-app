import {type NextRequest, NextResponse} from 'next/server';
import {ProviderService} from '@/service/ProviderService';
import {getUserAuthOrThrow} from "@/lib/auth/userAuth";
import {withErrorHandling} from '@/lib/api/errorHandler';

export interface ProviderProfileResponse {
  success: boolean;
  hasProviderAccount: boolean;
  provider?: {
    id: number;
    company_name: string;
    phone: string;
    status: string;
    created_at: string;
  };
  error?: string;
}

async function handleGet(_request: NextRequest) {
  const userAuth = await getUserAuthOrThrow();

  const providerService = new ProviderService();
  const provider = await providerService.getProviderForClient(userAuth.userId);

  if (!provider) {
    return NextResponse.json({
      success: true,
      hasProviderAccount: false
    } as ProviderProfileResponse);
  }

  return NextResponse.json({
    success: true,
    hasProviderAccount: true,
    provider: {
      id: provider.id,
      company_name: provider.company_name,
      phone: provider.phone,
      status: provider.status,
      created_at: provider.created_at.toISOString()
    }
  } as ProviderProfileResponse);
}

export const GET = withErrorHandling(handleGet);
