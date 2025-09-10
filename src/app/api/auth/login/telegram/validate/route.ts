import { NextRequest, NextResponse } from 'next/server';
import {TelegramService, TelegramUserDataValidationResponse} from "@/service/TelegramService";
import {TelegramUserInitData} from "@/types/telegram";

export async function POST(request: NextRequest) {
  try {
    const telegramUserInitData : TelegramUserInitData = await request.json();
    return NextResponse.json(TelegramService.validateTelegramInitData(telegramUserInitData));
  } catch (error) {
    const errorResponse: TelegramUserDataValidationResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}