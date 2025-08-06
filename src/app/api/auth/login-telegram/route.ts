import { NextRequest, NextResponse } from 'next/server';
import { setJWTCookie, setRefreshTokenCookie, getClientIP, logLoginAttempt } from '@/lib/auth';
import { AuthService } from '@/service/AuthService';
import { validateAuthRequest, validateTelegramUser } from '@/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Валидация запроса
    const validatedRequest = validateAuthRequest(body);
    if (!validatedRequest) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Валидация Telegram пользователя
    const user = validateTelegramUser(validatedRequest.telegramUser);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid Telegram user data' },
        { status: 400 }
      );
    }

    // Аутентификация
    const authService = new AuthService();
    const result = await authService.authenticateWithTelegram(user);

    if (!result) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }

    const { user: authUser, tokens } = result;

    // Логирование
    const clientIP = getClientIP(request);
    logLoginAttempt(authUser.id, true, clientIP);

    // Создание ответа
    const response = NextResponse.json({
      success: true,
      user: authUser
    });

    // Установка cookies
    setJWTCookie(tokens.jwtToken, response);
    setRefreshTokenCookie(tokens.refreshToken, response);
    
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 