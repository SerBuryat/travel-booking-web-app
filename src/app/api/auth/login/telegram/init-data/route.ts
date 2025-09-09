import { NextRequest, NextResponse } from 'next/server';
import { validate } from '@telegram-apps/init-data-node';
import {TelegramUserData, TelegramUserInitData} from '@/types/telegram';

export interface ValidatedTelegramUserDataResponse {
  success: boolean;
  user?: TelegramUserData;
  error?: string;
  details?: string;
}

export async function POST(request: NextRequest, ctx: RouteContext<"/api/auth/login/telegram/init-data">) {
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
      // Validate initData using Telegram library
      validate(initData, botToken);
      
      // Parse initData to extract user information
      const urlParams = new URLSearchParams(initData);
      const userData = urlParams.get('user');
      
      if (!userData) {
        return NextResponse.json(
          { error: 'No user data found in initData' },
          { status: 400 }
        );
      }

      // Parse user data from URL-encoded JSON with proper typing
      const parsedUserData = JSON.parse(decodeURIComponent(userData));
      
      // Create properly typed TelegramInitData object
      const telegramInitData: TelegramUserInitData = {
        user: parsedUserData,
        auth_date: parseInt(urlParams.get('auth_date') || '0'),
        query_id: urlParams.get('query_id') || undefined,
        signature: urlParams.get('signature') || undefined,
        hash: urlParams.get('hash') || undefined
      };
      
      const response: ValidatedTelegramUserDataResponse = {
        success: true,
        user: telegramInitData.user
      };
      
      return NextResponse.json(response);

    } catch (validationError) {
      console.error('Telegram validation error:', validationError);
      const errorResponse: ValidatedTelegramUserDataResponse = {
        success: false,
        error: 'Invalid Telegram data',
        details: validationError instanceof Error ? validationError.message : 'Validation failed'
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

  } catch (error) {
    console.error('Telegram auth error:', error);
    const errorResponse: ValidatedTelegramUserDataResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}