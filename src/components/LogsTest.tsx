'use client';

import { useState } from 'react';
import { sendClientLog } from '@/lib/logsSender/clientLogger';

/**
 * Компонент для тестирования системы логирования клиентских ошибок
 */
// Компонент, который выбрасывает ошибку при рендере (для тестирования Error Boundary)
function ErrorThrower({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Тестовая ошибка React Error Boundary для проверки логирования');
  }
  return null;
}

export function LogsTest() {
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const handleTestReactError = () => {
    setLastResult('Тестируем React Error Boundary...');
    // Устанавливаем флаг для выброса ошибки при следующем рендере
    setShouldThrowError(true);
  };

  const handleTestConsoleError = () => {
    setLastResult('Тестируем console.error...');
    const testError = new Error('Тестовая ошибка для console.error');
    console.error('Тестовая ошибка:', testError);
    setLastResult('✅ console.error вызван (проверьте логи)');
  };

  const handleTestUnhandledError = () => {
    setLastResult('Тестируем unhandled error...');
    // Создаем ошибку, которая не будет обработана
    setTimeout(() => {
      throw new Error('Тестовая unhandled ошибка для проверки логирования');
    }, 100);
    setLastResult('✅ Unhandled error создан (проверьте логи)');
  };

  const handleTestUnhandledRejection = () => {
    setLastResult('Тестируем unhandled promise rejection...');
    // Создаем необработанный Promise rejection
    Promise.reject(new Error('Тестовая unhandled promise rejection для проверки логирования'));
    setLastResult('✅ Unhandled rejection создан (проверьте логи)');
  };

  const handleTestCustomError = async () => {
    setLastResult('Тестируем custom error...');
    try {
      const testError = new Error('Тестовая пользовательская ошибка для проверки логирования');
      const result = await sendClientLog(testError, 'custom_error', {
        testContext: 'Это тестовый контекст',
        testData: { action: 'TEST', timestamp: Date.now() },
      });
      
      if (result.success) {
        setLastResult('✅ Custom error отправлен успешно!');
      } else {
        setLastResult(`❌ Ошибка отправки: ${result.error}`);
      }
    } catch (error) {
      setLastResult(`❌ Исключение: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleTestStringError = async () => {
    setLastResult('Тестируем string error...');
    try {
      const result = await sendClientLog('Тестовая строка ошибки для проверки логирования', 'custom_error', {
        testType: 'string',
      });
      
      if (result.success) {
        setLastResult('✅ String error отправлен успешно!');
      } else {
        setLastResult(`❌ Ошибка отправки: ${result.error}`);
      }
    } catch (error) {
      setLastResult(`❌ Исключение: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      {/* Компонент для выброса ошибки при рендере */}
      <ErrorThrower shouldThrow={shouldThrowError} />
      
      <div className="bg-white border-2 border-blue-500 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">🧪 Logs Test</h3>
        <p className="text-sm text-gray-600 mb-4">
          Тестирование системы логирования клиентских ошибок
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleTestReactError}
            className="px-4 py-3 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors font-medium"
          >
            React Error Boundary
          </button>
        
          <button
            onClick={handleTestConsoleError}
            className="px-4 py-3 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors font-medium"
          >
            Console Error
          </button>
        
          <button
            onClick={handleTestUnhandledError}
            className="px-4 py-3 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors font-medium"
          >
            Unhandled Error
          </button>
        
          <button
            onClick={handleTestUnhandledRejection}
            className="px-4 py-3 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors font-medium"
          >
            Unhandled Rejection
          </button>
        
          <button
            onClick={handleTestCustomError}
            className="px-4 py-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors font-medium"
          >
            Custom Error (Error)
          </button>
        
          <button
            onClick={handleTestStringError}
            className="px-4 py-3 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition-colors font-medium"
          >
            Custom Error (String)
          </button>
      </div>
      
        {lastResult && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-700">
            {lastResult}
          </div>
        )}
      </div>
    </>
  );
}

