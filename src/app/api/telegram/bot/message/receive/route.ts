import { NextRequest, NextResponse } from 'next/server';
import { processIncomingMessage, TelegramUpdate } from '@/lib/telegram/bot/receiveMessage';

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();
    
    const result = processIncomingMessage(update);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: result.message 
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to process message',
          details: result.message
        }, 
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error processing Telegram message:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
