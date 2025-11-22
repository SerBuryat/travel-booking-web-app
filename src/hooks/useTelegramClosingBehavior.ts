'use client';

import { useEffect } from 'react';
import {closingBehavior, init} from '@telegram-apps/sdk';

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
    try {
      init();
      closingBehavior.mount();
      closingBehavior.enableConfirmation();
      console.log("Enable `closingBehavior.enableConfirmation()` for telegram mini app");
    } catch (e) {
      console.error("Can't enable tg mini app `closingBehavior.enableConfirmation()` cause", e);
    }
  }, [enabled]);
}

