/**
 * Отправка сообщений через Telegram Bot API
 * 
 * @description Функции для отправки сообщений пользователям через Telegram бота
 */

// Интерфейс для запроса отправки сообщения
export interface SendMessageRequest {
  chat_id: string;
  text: string;
}

// Интерфейс для ответа от Telegram Bot API при отправке сообщения
export interface SendMessageResponse {
  ok: boolean;
  result?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username: string;
    };
    chat: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      type: string;
    };
    date: number;
    text: string;
  };
  error_code?: number;
  description?: string;
}

// Интерфейс для результата отправки сообщения
export interface SendMessageResult {
  success: boolean;
  messageId?: number;
  error?: string;
}

/**
 * Отправляет сообщение пользователю через Telegram Bot API
 * 
 * @description Выполняет POST запрос к Telegram Bot API для отправки сообщения
 * 
 * @param {string} chatId - ID чата получателя
 * @param {string} message - Текст сообщения для отправки
 * @returns {Promise<SendMessageResult>} Результат отправки сообщения
 * 
 * @throws {Error} "BOT_TOKEN is not defined" - если не задан токен бота
 * @throws {Error} "Failed to send message" - если произошла ошибка при отправке
 */
export async function sendMessage(chatId: string, message: string): Promise<SendMessageResult> {
  const botToken = process.env.BOT_TOKEN;
  
  if (!botToken) {
    throw new Error('BOT_TOKEN is not defined');
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const requestBody: SendMessageRequest = {
    chat_id: chatId,
    text: message
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SendMessageResponse = await response.json();

    if (!data.ok) {
      return {
        success: false,
        error: data.description || 'Unknown error from Telegram API'
      };
    }

    return {
      success: true,
      messageId: data.result?.message_id
    };

  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message'
    };
  }
}
