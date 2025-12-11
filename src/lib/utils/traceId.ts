/**
 * Утилита для генерации уникального traceId для отслеживания процессов.
 * Работает как на клиенте, так и на сервере.
 */

/**
 * Генерирует уникальный traceId
 * @returns {string} UUID v4
 */
export function generateTraceId(): string {
  // На сервере используем crypto из Node.js
  if (typeof window === 'undefined') {
    const { randomUUID } = require('crypto');
    return randomUUID();
  }

  // На клиенте используем Web Crypto API
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback для старых браузеров
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

