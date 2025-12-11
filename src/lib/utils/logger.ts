/**
 * Утилита для единообразного логирования в проекте.
 * Согласно BACKEND_REFACTORING.MD пункт 6.
 * 
 * Формат: [traceId] [functionName] message | context: {...} | error: ... | stack: ...
 */

export type LogLevel = 'info' | 'error' | 'warn';

interface LogContext {
  [key: string]: any;
}

/**
 * Логирует сообщение с указанным уровнем и контекстом
 * 
 * @param functionName - Имя функции, где происходит логирование
 * @param message - Сообщение для логирования
 * @param level - Уровень логирования (info, error, warn)
 * @param context - Дополнительный контекст (userId, serviceId, и т.д.)
 * @param error - Объект ошибки (если есть)
 * @param traceId - Уникальный идентификатор для отслеживания процесса (опционально)
 */
export function log(
  functionName: string,
  message: string,
  level: LogLevel = 'info',
  context?: LogContext,
  error?: Error | unknown,
  traceId?: string
): void {
  // Формируем префикс с traceId (если есть)
  const tracePrefix = traceId ? `[${traceId}]` : '';
  const prefix = tracePrefix ? `${tracePrefix} [${functionName}]` : `[${functionName}]`;
  const parts: string[] = [message];

  // Добавляем traceId в контекст, если он передан
  const enrichedContext = traceId ? { ...context, traceId } : context;

  // Добавляем контекст
  if (enrichedContext && Object.keys(enrichedContext).length > 0) {
    const contextStr = Object.entries(enrichedContext)
      .map(([key, value]) => {
        // Безопасная сериализация значений
        if (value === null || value === undefined) {
          return `${key}: null`;
        }
        if (typeof value === 'object') {
          try {
            return `${key}: ${JSON.stringify(value)}`;
          } catch {
            return `${key}: [object]`;
          }
        }
        return `${key}: ${value}`;
      })
      .join(' | ');
    parts.push(`context: {${contextStr}}`);
  }

  // Добавляем информацию об ошибке
  if (error) {
    if (error instanceof Error) {
      parts.push(`error: ${error.message}`);
      if (error.stack) {
        // Берем только первые 3 строки стека для читаемости
        const stackLines = error.stack.split('\n').slice(0, 3).join('\n');
        parts.push(`stack: ${stackLines}`);
      }
    } else {
      parts.push(`error: ${String(error)}`);
    }
  }

  const logMessage = `${prefix} ${parts.join(' | ')}`;

  if (level === 'error') {
    console.error(logMessage);
  } else if (level === 'warn') {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }
}

