'use client';

import { useEffect } from 'react';
import { MetricaErrorTracker } from '@/lib/metrica';

/**
 * Провайдер для инициализации отслеживания ошибок через Yandex Metrica
 */
export function MetricaProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Инициализируем отслеживание ошибок только если нужно
    if (MetricaErrorTracker.shouldLog()) {
      MetricaErrorTracker.init();

      // Дополнительная обработка для Next.js ошибок
      if (typeof window !== 'undefined') {
        // Перехватываем console.error для отслеживания (опционально)
        const originalConsoleError = console.error;
        console.error = (...args: any[]) => {
          // Отправляем только если это реальная ошибка (Error объект)
          const errorArg = args.find((arg) => arg instanceof Error);
          if (errorArg) {
            MetricaErrorTracker.trackCustomError('Console Error', {
              arguments: args
                .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
                .join(' '),
            });
          }
          originalConsoleError.apply(console, args);
        };
      }
    }
  }, []);

  return <>{children}</>;
}

