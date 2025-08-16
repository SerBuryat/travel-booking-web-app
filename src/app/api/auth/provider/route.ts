import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import {
  getJWTFromRequest, 
  getClientIP, 
  logLoginAttempt,
  setJWTCookie,
  setRefreshTokenCookie
} from '@/lib/auth';
import { AuthService } from '@/service/AuthService';

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
    // Get JWT token from cookies
    const token = getJWTFromRequest(request);
    
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

    // Check if user is already a provider
    if (payload.role === 'provider') {
      return NextResponse.json(
        { success: false, error: 'User is already a provider' },
        { status: 400 }
      );
    }

    // Get client IP for logging
    const clientIP = getClientIP(request);

    // Switch user to provider role
    const authService = new AuthService();
    const result = await authService.authProvider(payload.userId, payload.authId);
    
    if (!result) {
      // Log failed attempt
      logLoginAttempt(payload.userId, false, clientIP);
      
      return NextResponse.json(
        { success: false, error: 'Failed to switch to provider role. Make sure you have a business account.' },
        { status: 400 }
      );
    }

    // Log successful role switch
    logLoginAttempt(payload.userId, true, clientIP);

    // Create response
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
