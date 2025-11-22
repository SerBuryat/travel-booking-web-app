'use client';

import { useTelegramClosingBehavior } from '@/hooks/useTelegramClosingBehavior';

/**
 * Компонент для обработки закрытия Telegram Mini App
 * 
 * @description Автоматически включает подтверждение закрытия приложения
 * при запуске через Telegram Mini App. Компонент не рендерит никакого UI.
 * 
 * @example
 * ```tsx
 * <TelegramClosingHandler />
 * ```
 */
export function TelegramClosingHandler() {
  // Включаем подтверждение закрытия по умолчанию
  useTelegramClosingBehavior(true);

  // Компонент не рендерит никакого UI
  return null;
}

