import { NextRequest, NextResponse } from 'next/server';
import { setJWTCookie, setRefreshTokenCookie, getClientIP, logLoginAttempt } from '@/lib/auth';
import { AuthService } from '@/service/AuthService';
import { TelegramUserData } from '@/types/telegram';

// Тип для тела запроса
interface LoginTelegramRequest {
  telegramUser: TelegramUserData;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginTelegramRequest = await request.json();

    // Валидация тела запроса
    if (!body.telegramUser) {
      return NextResponse.json(
        { error: 'Missing telegramUser in request body' },
        { status: 400 }
      );
    }

    // Аутентификация
    const authService = new AuthService();
    const result = await authService.authenticateWithTelegram(body.telegramUser);

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