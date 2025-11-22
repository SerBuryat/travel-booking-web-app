'use client';

import { useEffect } from 'react';

/**
 * Хук для настройки поведения закрытия Telegram Mini App
 * 
 * @description Включает подтверждение закрытия приложения при попытке пользователя закрыть его.
 * Использует нативный API Telegram `setupClosingBehavior()`.
 * 
 * @param {boolean} enabled - Включить или выключить подтверждение закрытия (по умолчанию: true)
 * 
 * @example
 * ```tsx
 * useTelegramClosingBehavior(true);
 * ```
 */
export function useTelegramClosingBehavior(enabled: boolean = true) {
  useEffect(() => {
    // Проверка на серверной стороне (SSR)
    if (typeof window === 'undefined') {
      return;
    }

    // Проверка наличия Telegram Web App API
    if (!window.Telegram?.WebApp) {
      return;
    }

    const tg = window.Telegram.WebApp;

    try {
      // Включить подтверждение закрытия
      if (enabled) {
        tg.setupClosingBehavior(true);
      } else {
        tg.setupClosingBehavior(false);
      }
    } catch (error) {
      console.error('Ошибка при настройке поведения закрытия Telegram Mini App:', error);
    }
  }, [enabled]);
}

