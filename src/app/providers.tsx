'use client';

import React from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from '@posthog/react';
import { useEffect } from 'react';

// Проверяем, нужно ли инициализировать PostHog для текущего окружения
function shouldInitializePostHog(): boolean {
  const nodeEnv = process.env.NODE_ENV;
  const logsFor = process.env.NEXT_PUBLIC_POST_HOG_LOGS_FOR;

  if (!nodeEnv || !logsFor) {
    return false;
  }

  // Парсим список окружений, для которых нужно отправлять логи
  const allowedEnvs = logsFor.split(',').map(env => env.trim().toLowerCase());
  return allowedEnvs.includes(nodeEnv.toLowerCase());
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Инициализация PostHog только если нужно
    if (shouldInitializePostHog()) {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

      if (posthogKey && posthogHost) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
        });

        // Настраиваем автоматический перехват ошибок
        // Перехват необработанных ошибок
        window.addEventListener('error', (event) => {
          posthog.captureException(event.error || new Error(event.message));
        });

        // Перехват необработанных промисов
        window.addEventListener('unhandledrejection', (event) => {
          posthog.captureException(event.reason);
        });
      }
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  );
}

