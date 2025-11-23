'use client';

import React from 'react';
import { useErrorTracking } from '@/hooks/useErrorTracking';
import { MetricaErrorTracker } from '@/lib/metrica';

/**
 * Компонент для тестирования Yandex Metrica
 * Отправляет тестовые события и ошибки
 */
export function MetricaTest() {
  const { captureError, trackCustomError, trackEvent } = useErrorTracking();

  const handleSendEvent = () => {
    if (MetricaErrorTracker.shouldLog()) {
      trackEvent('test_event', {
        page: 'home',
        timestamp: new Date().toISOString(),
        test: true,
      });
      console.log('✅ Тестовое событие отправлено в Yandex Metrica');
      alert('Тестовое событие отправлено! Проверьте Yandex Metrica dashboard.');
    } else {
      console.warn('⚠️ Yandex Metrica не инициализирован');
      alert('Yandex Metrica не инициализирован. Проверьте настройки окружения.');
    }
  };

  const handleSendError = () => {
    if (MetricaErrorTracker.shouldLog()) {
      const testError = new Error('Тестовая ошибка для проверки Yandex Metrica');
      captureError(testError, {
        $exception_type: 'test_error',
        $exception_message: testError.message,
        page: 'home',
        test: true,
      });
      console.log('✅ Тестовая ошибка отправлена в Yandex Metrica');
      alert('Тестовая ошибка отправлена! Проверьте Yandex Metrica dashboard.');
    } else {
      console.warn('⚠️ Yandex Metrica не инициализирован');
      alert('Yandex Metrica не инициализирован. Проверьте настройки окружения.');
    }
  };

  const handleSendCustomError = () => {
    if (MetricaErrorTracker.shouldLog()) {
      trackCustomError('Тестовая пользовательская ошибка', {
        customField: 'testValue',
        page: 'home',
        test: true,
      });
      console.log('✅ Тестовая пользовательская ошибка отправлена в Yandex Metrica');
      alert('Тестовая пользовательская ошибка отправлена! Проверьте Yandex Metrica dashboard.');
    } else {
      console.warn('⚠️ Yandex Metrica не инициализирован');
      alert('Yandex Metrica не инициализирован. Проверьте настройки окружения.');
    }
  };

  // Показываем только в development или если явно включено
  const shouldShow =
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_SHOW_METRICA_TEST === 'true';

  if (!shouldShow) {
    return null;
  }

  const isActive = MetricaErrorTracker.shouldLog();

  return (
    <div className="fixed top-20 right-4 z-50 bg-white border-2 border-blue-500 rounded-lg shadow-lg p-4 max-w-xs">
      <h3 className="text-sm font-bold text-gray-800 mb-2">🧪 Yandex Metrica Test</h3>
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
        <button
          onClick={handleSendCustomError}
          className="px-3 py-2 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors"
        >
          🔔 Отправить пользовательскую ошибку
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {isActive ? '✅ Yandex Metrica активен' : '❌ Yandex Metrica не инициализирован'}
      </p>
    </div>
  );
}

