'use client';

import React from 'react';
import { usePostHog } from '@posthog/react';

/**
 * Компонент для тестирования PostHog
 * Отправляет тестовые события и ошибки
 */
export function PostHogTest() {
  const posthog = usePostHog();

  const handleSendEvent = () => {
    if (posthog) {
      posthog.capture('test_event', {
        page: 'home',
        timestamp: new Date().toISOString(),
        test: true,
      });
      console.log('✅ Тестовое событие отправлено в PostHog');
      alert('Тестовое событие отправлено! Проверьте PostHog dashboard.');
    } else {
      console.warn('⚠️ PostHog не инициализирован');
      alert('PostHog не инициализирован. Проверьте настройки окружения.');
    }
  };

  const handleSendError = () => {
    if (posthog) {
      const testError = new Error('Тестовая ошибка для проверки PostHog');
      posthog.captureException(testError, {
        $exception_type: 'test_error',
        $exception_message: testError.message,
        page: 'home',
        test: true,
      });
      console.log('✅ Тестовая ошибка отправлена в PostHog');
      alert('Тестовая ошибка отправлена! Проверьте PostHog dashboard.');
    } else {
      console.warn('⚠️ PostHog не инициализирован');
      alert('PostHog не инициализирован. Проверьте настройки окружения.');
    }
  };

  // Показываем только в development или если явно включено
  const shouldShow = process.env.NODE_ENV === 'development' || 
                     process.env.NEXT_PUBLIC_SHOW_POSTHOG_TEST === 'true';

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 bg-white border-2 border-blue-500 rounded-lg shadow-lg p-4 max-w-xs">
      <h3 className="text-sm font-bold text-gray-800 mb-2">🧪 PostHog Test</h3>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleSendEvent}
          className="px-3 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
        >
          📤 Отправить событие
        </button>
        <button
          onClick={handleSendError}
          className="px-3 py-2 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
        >
          ⚠️ Отправить ошибку
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {posthog ? '✅ PostHog активен' : '❌ PostHog не инициализирован'}
      </p>
    </div>
  );
}

