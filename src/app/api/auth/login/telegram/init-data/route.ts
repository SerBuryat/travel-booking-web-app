import { NextRequest, NextResponse } from 'next/server';
import { validate } from '@telegram-apps/init-data-node';

export interface TelegramUserDataValidationResponse {
  success: boolean;
  error?: string;
  details?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { initData } = body;

    if (!initData) {
      return NextResponse.json(
        { error: 'Missing initData parameter' },
        { status: 400 }
      );
    }

    // Get BOT_TOKEN from environment
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) {
      console.error('BOT_TOKEN not found in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: BOT_TOKEN not found in `.env`' },
        { status: 500 }
      );
    }

    try {
      // Используем тг либу для валидации `initData` при помощи `BOT_TOKEN`
      // (пользователь пришел через ссылку mini app, созданного через этого бота)
      validate(initData, botToken);
      
      const response: TelegramUserDataValidationResponse = {
        success: true
      };
      
      return NextResponse.json(response);

    } catch (validationError) {
      const errorResponse: TelegramUserDataValidationResponse = {
        success: false,
        error: 'Invalid Telegram user `initData`',
        details: validationError instanceof Error ? validationError.message : 'Validation failed'
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

  } catch (error) {
    console.error('Telegram `initData` validation error:', error);
    const errorResponse: TelegramUserDataValidationResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}