import {NextRequest, NextResponse} from 'next/server';
import {setJWTCookie, setRefreshTokenCookie} from '@/lib/auth/authUtils';
import {AuthService} from '@/service/AuthService';
import {TelegramUserInitData} from '@/types/telegram';
import {TelegramService} from "@/service/TelegramService";

export async function POST(request: NextRequest) {
  try {
    const telegramUserInitData : TelegramUserInitData = await request.json();

    // todo - пока сделаем так, чтобы валидировать телеграм данные пользователя
    //  (возможно потом, сделаем валидацию и аутентификацию одни endpoint'ом)
    const validation =
        TelegramService.validateTelegramInitData(telegramUserInitData);

    if(!validation.success) {
      return NextResponse.json(
          { error: validation.error },
          { status: 400 }
      );
    }

    const authService = new AuthService();
    const result =
        await authService.authenticateWithTelegram(telegramUserInitData.user);

    if (!result) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }

    const response = NextResponse.json(result.user);

    setJWTCookie(result.tokens.jwtToken, response);
    setRefreshTokenCookie(result.tokens.refreshToken, response);
    
    return response;
  } catch (error) {
    return NextResponse.json(
      {error: `Error: '${error}' while call '/api/auth/login/telegram'`},
      {status: 500}
    );
  }
} 