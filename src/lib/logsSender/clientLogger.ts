/**
 * Клиентская обертка для отправки логов через server action
 */

import { sendLogs, ErrorType } from './logsSender';

/**
 * Отправляет лог ошибки с клиента на сервер через server action
 * 
 * @param error - Объект ошибки или строка с сообщением
 * @param errorType - Тип ошибки
 * @param context - Дополнительный контекст для логирования (может содержать url и userAgent)
 * @returns Promise с результатом отправки
 */
export async function sendClientLog(
  error: Error | string,
  errorType: ErrorType = 'custom_error',
  context?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Преобразуем Error в сериализуемый объект для передачи через server action
    // Next.js не может сериализовать Error объекты напрямую
    let serializableError: { message: string; stack?: string; name?: string } | string;
    
    if (error instanceof Error) {
      serializableError = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    } else {
      serializableError = error;
    }

    // Добавляем информацию о браузере и URL в контекст, если доступно
    const enrichedContext: Record<string, any> = { ...context };
    
    if (typeof window !== 'undefined') {
      if (!enrichedContext.url) {
        enrichedContext.url = window.location.href;
      }
      if (!enrichedContext.userAgent) {
        enrichedContext.userAgent = navigator.userAgent;
      }
    }

    // Вызываем server action с сериализуемым объектом
    const result = await sendLogs(serializableError, errorType, enrichedContext);
    
    return {
      success: result.success,
      error: result.error,
    };
  } catch (error) {
    // Не логируем ошибку отправки лога, чтобы избежать зацикливания
    // Просто возвращаем результат
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send log',
    };
  }
}

