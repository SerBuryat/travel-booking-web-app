'use client';

import React, { useState } from 'react';
import {useRouter} from 'next/navigation';
import {ServiceCreationResult} from '../_hooks/useServiceRegistration';
import {PAGE_ROUTES} from "@/utils/routes";
import {switchToProvider} from "@/lib/auth/role/switchToProvider";
import {useAuth} from "@/contexts/AuthContext";

interface ResultModalProps {
  result: ServiceCreationResult;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);

  const handleGoToBusinessAccount = async () => {
    setIsLoading(true);
    setSwitchError(null);

    try {
      const data = await switchToProvider()!;

      if (data!.success) {
        // Роль успешно изменена, обновляем контекст и переходим в бизнес-аккаунт
        await refreshUser();
        onClose();
        router.push(PAGE_ROUTES.PROVIDER.SERVICES);
      } else {
        console.error('Failed to switch to provider role:', data!.error);
        const errorMessage = data!.error || 'Неизвестная ошибка';
        setSwitchError(`Ошибка переключения на роль провайдера: ${errorMessage}. Попробуйте перейти в профиль и переключиться через кнопку "Перейти в бизнес-аккаунт"`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error switching to provider role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setSwitchError(`Ошибка переключения на роль провайдера: ${errorMessage}. Попробуйте перейти в профиль и переключиться через кнопку "Перейти в бизнес-аккаунт"`);
      setIsLoading(false);
    }
  };

  if (result.success) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Успешно!
            </h3>

            <p className="text-gray-600 mb-6">
              {result.message}
            </p>

            {switchError && (
              <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 mb-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      {switchError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <button
                  onClick={handleGoToBusinessAccount}
                  disabled={isLoading}
                  className={`w-full bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium ${
                    isLoading 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-blue-700'
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Переключение...
                  </span>
                ) : (
                  'Перейти в бизнес-аккаунт'
                )}
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-8 text-center shadow-2xl">
        {/* Иконка ошибки с анимацией */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Что-то пошло не так
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {result.message}
        </p>
        
        {/* Блок с рекомендацией */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900 mb-1">
                Попробуйте создать сервис еще раз
              </p>
              <p className="text-xs text-yellow-800">
                Если не получится, обратитесь в поддержку
              </p>
            </div>
          </div>
        </div>
        
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Закрыть
        </button>
      </div>
    </div>
  );
};
