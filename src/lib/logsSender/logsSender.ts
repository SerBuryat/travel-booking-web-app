'use server';

/**
 * Модуль для отправки логов клиентских ошибок в сервис логирования
 */

// Интерфейс для запроса к сервису логирования
export interface LoggerRequest {
  chatId: string;
  msg: string;
  details: {
    type: string;
    description: string;
    info: Record<string, any>;
  };
}

// Интерфейс для ответа от сервиса логирования
export interface LoggerResponse {
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
      first_name?: string;
      last_name?: string;
      username?: string;
      type: string;
    };
    date: number;
    document?: {
      file_name: string;
      mime_type: string;
      file_id: string;
      file_unique_id: string;
      file_size: number;
    };
    caption?: string;
    caption_entities?: Array<{
      offset: number;
      length: number;
      type: string;
      url?: string;
    }>;
  };
  error_code?: number;
  description?: string;
}

// Интерфейс для результата отправки лога
export interface SendLogResult {
  success: boolean;
  messageId?: number;
  error?: string;
}

// Типы ошибок для логирования
export type ErrorType = 
  | 'react_error_boundary'
  | 'console_error'
  | 'unhandled_error'
  | 'unhandled_promise_rejection'
  | 'custom_error';

/**
 * Получает префикс окружения из переменной STAGE
 */
function getStagePrefix(): string {
  const stage = process.env.STAGE || 'UNKNOWN';
  return `[${stage}]`;
}

/**
 * Форматирует сообщение об ошибке для отправки в логгер
 */
function formatErrorMessage(
  errorType: ErrorType,
  error: Error | string | { message: string; stack?: string; name?: string },
  url?: string
): string {
  const stagePrefix = getStagePrefix();
  let errorMessage: string;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    errorMessage = error.message;
  } else {
    errorMessage = String(error);
  }
  
  let typeLabel: string;
  switch (errorType) {
    case 'react_error_boundary':
      typeLabel = 'React Error Boundary';
      break;
    case 'console_error':
      typeLabel = 'Console Error';
      break;
    case 'unhandled_error':
      typeLabel = 'Unhandled Error';
      break;
    case 'unhandled_promise_rejection':
      typeLabel = 'Unhandled Promise Rejection';
      break;
    case 'custom_error':
      typeLabel = 'Custom Error';
      break;
    default:
      typeLabel = 'Unknown Error';
  }
  
  let message = `${stagePrefix} ${typeLabel}: ${errorMessage}`;
  
  if (url) {
    message += ` <a href='${url}'>${url}</a>`;
  }
  
  return message;
}

/**
 * Собирает детальную информацию об ошибке
 */
function collectErrorDetails(
  errorType: ErrorType,
  error: Error | string | { message: string; stack?: string; name?: string },
  context?: Record<string, any>
): {
  type: string;
  description: string;
  info: Record<string, any>;
} {
  const baseInfo: Record<string, any> = {
    timestamp: Date.now(),
  };

  // Обрабатываем Error объект или сериализуемый объект
  if (error instanceof Error) {
    baseInfo.message = error.message;
    if (error.stack) {
      // Ограничиваем длину stack trace
      baseInfo.stack = error.stack.substring(0, 1000);
    }
    if (error.name) {
      baseInfo.name = error.name;
    }
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    baseInfo.message = error.message;
    if (error.stack) {
      // Ограничиваем длину stack trace
      baseInfo.stack = error.stack.substring(0, 1000);
    }
    if (error.name) {
      baseInfo.name = error.name;
    }
  } else {
    baseInfo.message = String(error);
  }

  // Добавляем контекст, если передан (url и userAgent передаются из клиента)
  if (context) {
    Object.assign(baseInfo, context);
  }

  // Формируем описание
  let description: string;
  if (error instanceof Error) {
    description = error.message || 'Unknown error';
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    description = error.message || 'Unknown error';
  } else {
    description = String(error);
  }

  // Ограничиваем длину описания
  if (description.length > 500) {
    description = description.substring(0, 500) + '...';
  }

  return {
    type: errorType,
    description,
    info: baseInfo,
  };
}

/**
 * Отправляет лог ошибки в сервис логирования
 * 
 * @param error - Объект ошибки (сериализуемый), строка с сообщением, или объект с полями {message, stack?, name?}
 * @param errorType - Тип ошибки
 * @param context - Дополнительный контекст для логирования
 * @returns Promise с результатом отправки
 */
export async function sendLogs(
  error: Error | string | { message: string; stack?: string; name?: string },
  errorType: ErrorType = 'custom_error',
  context?: Record<string, any>
): Promise<SendLogResult> {
  const loggerUrl = process.env.LOGGER_URL;
  const chatId = process.env.LOGGER_CHAT_ID;

  // Проверяем наличие необходимых переменных окружения
  if (!loggerUrl || !chatId) {
    const missingVars = [];
    if (!loggerUrl) missingVars.push('LOGGER_URL');
    if (!chatId) missingVars.push('LOGGER_CHAT_ID');
    
    console.error(
      `[Logger] Не удалось отправить лог: отсутствуют переменные окружения: ${missingVars.join(', ')}`
    );
    return {
      success: false,
      error: `Missing environment variables: ${missingVars.join(', ')}`,
    };
  }

  try {
    // Формируем сообщение
    // URL берем из контекста, который передается с клиента
    const url = context?.url;
    const msg = formatErrorMessage(errorType, error, url);

    // Собираем детали ошибки
    const details = collectErrorDetails(errorType, error, context);

    // Формируем тело запроса
    const requestBody: LoggerRequest = {
      chatId,
      msg,
      details,
    };

    // Отправляем запрос
    const response = await fetch(loggerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LoggerResponse = await response.json();

    if (!data.ok) {
      console.error(
        `[Logger] Сервис логирования вернул ошибку: ${data.description || 'Unknown error'}`
      );
      return {
        success: false,
        error: data.description || 'Unknown error from logger service',
      };
    }

    // Логируем успешную отправку
    const messageText = data.result?.caption || msg;
    console.log(`[Logger] Отправили сообщение: '${messageText.substring(0, 100)}${messageText.length > 100 ? '...' : ''}'`);

    return {
      success: true,
      messageId: data.result?.message_id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send log';
    console.error(
      `[Logger] Не удалось отправить лог в сервис логирования: ${errorMessage}`,
      error
    );
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}
