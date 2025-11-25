'use client';

import { useEffect } from 'react';
import { sendClientLog } from '@/lib/logsSender/clientLogger';
import type { ErrorType } from '@/lib/logsSender/logsSender';

/**
 * Провайдер для перехвата клиентских ошибок и отправки их в сервис логирования
 */
export function LogsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Сохраняем оригинальный console.error
    const originalConsoleError = console.error;

    // Переопределяем console.error для перехвата ошибок
    console.error = (...args: any[]) => {
      // Вызываем оригинальный console.error
      originalConsoleError.apply(console, args);

      // Проверяем, есть ли среди аргументов Error объект
      const errorArg = args.find((arg) => arg instanceof Error);
      
      if (errorArg) {
        // Отправляем ошибку в логгер (не блокируем выполнение)
        sendClientLog(errorArg, 'console_error', {
          arguments: args
            .map((arg) => {
              if (arg instanceof Error) {
                return `Error: ${arg.message}`;
              }
              if (typeof arg === 'object') {
                try {
                  return JSON.stringify(arg);
                } catch {
                  return String(arg);
                }
              }
              return String(arg);
            })
            .join(' '),
        }).catch(() => {
          // Игнорируем ошибки отправки логов, чтобы избежать зацикливания
        });
      }
    };

    // Обработчик глобальных JavaScript ошибок
    const handleError = (event: ErrorEvent) => {
      const error = event.error || new Error(event.message || 'Unknown error');
      
      sendClientLog(error, 'unhandled_error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }).catch(() => {
        // Игнорируем ошибки отправки логов
      });
    };

    // Обработчик необработанных Promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason || 'Unhandled promise rejection'));

      sendClientLog(error, 'unhandled_promise_rejection', {
        reason: event.reason?.toString(),
      }).catch(() => {
        // Игнорируем ошибки отправки логов
      });
    };

    // Подписываемся на события
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Очистка при размонтировании
    return () => {
      // Восстанавливаем оригинальный console.error
      console.error = originalConsoleError;
      
      // Отписываемся от событий
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}

