import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/server-auth';
import { ProviderService } from '@/service/ProviderService';

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

export async function GET(request: NextRequest) {
  try {
    // Получаем данные пользователя с валидацией токена
    const user = await getServerUser();
    
    // Проверяем, что пользователь аутентифицирован
    if (!user) {
      return NextResponse.json(
        { success: false, hasProviderAccount: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Проверяем, есть ли у пользователя бизнес-аккаунт
    const providerService = new ProviderService();
    const provider = await providerService.getProviderForClient(user.id);

    if (!provider) {
      // У пользователя нет бизнес-аккаунта
      return NextResponse.json({
        success: true,
        hasProviderAccount: false
      } as ProviderProfileResponse);
    }

    // У пользователя есть бизнес-аккаунт
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

  } catch (error) {
    console.error('Provider profile check error:', error);
    
    // Возвращаем ошибку, но не раскрываем детали
    return NextResponse.json(
      { 
        success: false, 
        hasProviderAccount: false, 
        error: 'Failed to check provider status' 
      } as ProviderProfileResponse,
      { status: 500 }
    );
  }
}
