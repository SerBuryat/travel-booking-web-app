'use client';

import React, { useState } from 'react';
import {useRouter} from 'next/navigation';
import {ServiceCreationResult} from '../_hooks/useServiceRegistration';
import {PAGE_ROUTES} from "@/utils/routes";

interface ResultModalProps {
  result: ServiceCreationResult;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleGoToMyServices = () => {
    if (isNavigating) return;
    onClose();
    router.push(PAGE_ROUTES.PROVIDER.SERVICES);
  };

  if (result.success) {
    return (
      <>
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
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleGoToMyServices}
                disabled={isNavigating}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Перейти в 'Мои объекты'
              </button>
            </div>
          </div>
        </div>
        
        {/* Overlay загрузки при переходе на страницу сервиса */}
        {isNavigating && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg max-w-sm w-full mx-4 p-8 text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-900">
                Переход на страницу сервиса...
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Пожалуйста, подождите
              </p>
            </div>
          </div>
        )}
      </>
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
