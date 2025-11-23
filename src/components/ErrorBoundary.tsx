'use client';

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { MetricaErrorTracker } from '@/lib/metrica';
import Link from 'next/link';
import { PAGE_ROUTES } from '@/utils/routes';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Компонент для отображения ошибки при падении приложения
 */
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="text-6xl mb-6">😅</div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Упс! Что-то пошло не так
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
          Произошла непредвиденная ошибка. Мы уже работаем над решением этой проблемы.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left bg-red-50 p-4 rounded-lg">
            <summary className="cursor-pointer font-semibold text-red-800 mb-2">
              Детали ошибки (только в development)
            </summary>
            <pre className="text-xs text-red-700 overflow-auto">
              {error.toString()}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              resetErrorBoundary();
              window.location.reload();
            }}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            🔄 Перезагрузить страницу
          </button>
          
          <Link 
            href={PAGE_ROUTES.HOME}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            🏠 Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Глобальный Error Boundary для перехвата ошибок рендеринга React компонентов
 * Автоматически отправляет ошибки в Yandex Metrica
 */
export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: { componentStack: string }) => {
    // Логируем в консоль для отладки
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Отправляем ошибку в Yandex Metrica, если нужно
    if (MetricaErrorTracker.shouldLog()) {
      MetricaErrorTracker.captureError(error, {
        componentStack: errorInfo.componentStack,
        error_type: 'react_error_boundary',
      });
    }
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
    >
      {children}
    </ReactErrorBoundary>
  );
}
