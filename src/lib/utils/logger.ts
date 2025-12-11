/**
 * Утилита для единообразного логирования в проекте.
 * Согласно BACKEND_REFACTORING.MD пункт 6.
 * 
 * Формат: [functionName] message | context: {...} | error: ... | stack: ...
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
 */
export function log(
  functionName: string,
  message: string,
  level: LogLevel = 'info',
  context?: LogContext,
  error?: Error | unknown
): void {
  const prefix = `[${functionName}]`;
  const parts: string[] = [message];

  // Добавляем контекст
  if (context && Object.keys(context).length > 0) {
    const contextStr = Object.entries(context)
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

