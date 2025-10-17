/**
 * Обработка входящих сообщений от Telegram Bot API
 * 
 * @description Функции для обработки и логирования входящих сообщений от Telegram бота
 */

// Упрощенный интерфейс для входящего сообщения от Telegram Bot API
export interface TelegramMessage {
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

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

/**
 * Обрабатывает входящее сообщение от Telegram Bot API
 * 
 * @description Логирует основную информацию о сообщении (пользователь, чат, текст, время)
 * 
 * @param {TelegramUpdate} update - Объект обновления от Telegram Bot API
 * @returns {Object} Результат обработки сообщения
 */
export function processIncomingMessage(update: TelegramUpdate): { success: boolean; message: string } {
  try {
    // Логируем только основную информацию
    if (update.message) {
      const user = update.message.from;
      const chat = update.message.chat;
      const messageTime = new Date(update.message.date * 1000).toISOString();
      
      console.log(`[TELEGRAM] ${user.first_name} ${user.last_name || ''} (@${user.username || 'no_username'}) в чате ${chat.type} (ID: ${chat.id}): "${update.message.text || '[не текстовое сообщение]'}" - ${messageTime}`);
    }
    
    return { 
      success: true, 
      message: 'Message received and logged successfully' 
    };
    
  } catch (error) {
    console.error('Error processing Telegram message:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
