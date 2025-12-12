'use client';

import React, { useState } from 'react';
import {useRouter} from 'next/navigation';
import {ServiceCreationResult} from '../_hooks/useProvideCreateService';
import {PAGE_ROUTES} from "@/utils/routes";

interface ResultModalProps {
  result: ServiceCreationResult;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleViewService = () => {
    if (result.serviceId) {
      setIsNavigating(true);
      // Не закрываем модальное окно сразу, чтобы overlay загрузки оставался видимым
      router.push(`/services/${result.serviceId}`);
    }
  };

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
              
              <button
                onClick={handleViewService}
                disabled={isNavigating}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigating ? 'Загрузка...' : 'Посмотреть сервис'}
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
      <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ошибка
        </h3>
        
        <p className="text-gray-600 mb-2">
          {result.message}
        </p>
        
        {result.error && (
          <p className="text-sm text-red-600 mb-6">
            {result.error}
          </p>
        )}
      </div>
    </div>
  );
};
