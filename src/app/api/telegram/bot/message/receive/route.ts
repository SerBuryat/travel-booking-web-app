import { NextRequest, NextResponse } from 'next/server';

// Упрощенный интерфейс для входящего сообщения от Telegram Bot API
interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  };
  chat: {
    id: number;
    type: string;
  };
  date: number;
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();
    
    // Логируем только основную информацию
    if (update.message) {
      const user = update.message.from;
      const chat = update.message.chat;
      const messageTime = new Date(update.message.date * 1000).toISOString();
      
      console.log(`[TELEGRAM] ${user.first_name} ${user.last_name || ''} (@${user.username || 'no_username'}) в чате ${chat.type} (ID: ${chat.id}): "${update.message.text || '[не текстовое сообщение]'}" - ${messageTime}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message received and logged successfully' 
    });
    
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
