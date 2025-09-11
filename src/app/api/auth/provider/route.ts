import {NextRequest, NextResponse} from 'next/server';
import {getJWTFromCookies, setJWTCookie, setRefreshTokenCookie, verifyJWT} from '@/lib/auth/auth-utils';
import {AuthService} from '@/service/AuthService';

export interface ProviderSwitchResponse {
  success: boolean;
  user?: {
    id: number;
    name: string;
    role: string;
    telegram_id: number;
    username?: string;
  };
  tokens?: {
    jwtToken: string;
    refreshToken: string;
    expiresAt: Date;
  };
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const token = await getJWTFromCookies();
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Validate JWT token
    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    if (payload.role === 'provider') {
      return NextResponse.json(
        { success: false, error: 'User is already a provider' },
        { status: 400 }
      );
    }

    // Switch user to provider role
    const authService = new AuthService();
    const result = await authService.authProvider(payload.userId, payload.authId);
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to switch to provider role. Make sure you have a business account.' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
      tokens: result.tokens
    } as ProviderSwitchResponse);

    // Set new tokens in cookies
    if (result.tokens) {
      setJWTCookie(result.tokens.jwtToken, response);
      setRefreshTokenCookie(result.tokens.refreshToken, response);
    }

    return response;

  } catch (error) {
    console.error('Provider switch error:', error);
    
    // Return appropriate error message
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('бизнес-аккаунта')) {
        errorMessage = error.message;
        statusCode = 400;
      } else if (error.message.includes('не найден') || error.message.includes('аутентификации')) {
        errorMessage = error.message;
        statusCode = 401;
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}
