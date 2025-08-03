import { NextRequest, NextResponse } from 'next/server';
import { validate } from '@telegram-apps/init-data-node';
import { TelegramAuthResponse, TelegramInitData } from '@/types/telegram';

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
        { error: 'Server configuration error' },
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

      // Parse user data from URL-encoded JSON
      const user = JSON.parse(decodeURIComponent(userData));
      
      const response: TelegramAuthResponse = {
        success: true,
        user: user
      };
      
      return NextResponse.json(response);

    } catch (validationError) {
      console.error('Telegram validation error:', validationError);
      const errorResponse: TelegramAuthResponse = {
        success: false,
        error: 'Invalid Telegram data',
        details: validationError instanceof Error ? validationError.message : 'Validation failed'
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

  } catch (error) {
    console.error('Telegram auth error:', error);
    const errorResponse: TelegramAuthResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 