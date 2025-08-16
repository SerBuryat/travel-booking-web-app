'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ServiceCreationResult } from '../_hooks/useServiceRegistration';

interface ResultModalProps {
  result: ServiceCreationResult;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  const router = useRouter();

  const handleViewService = () => {
    if (result.serviceId) {
      router.push(`/services/${result.serviceId}`);
    }
    onClose();
  };

  const handleGoToBusinessAccount = async () => {
    try {
      // Вызываем API для смены роли на провайдера
      const response = await fetch('/api/auth/provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Роль успешно изменена, переходим в бизнес-аккаунт
        onClose();
        router.push('/provider/services');
      } else {
        console.error('Failed to switch to provider role:', data.error);
        // В случае ошибки показываем уведомление
        alert('Ошибка при переходе в бизнес-аккаунт: ' + data.error);
      }
    } catch (error) {
      console.error('Error switching to provider role:', error);
      alert('Ошибка при переходе в бизнес-аккаунт');
    }
  };

  const handleClose = () => {
    onClose();
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
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleGoToBusinessAccount}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Перейти в бизнес-аккаунт
            </button>
            
            <button
              onClick={handleViewService}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Посмотреть сервис
            </button>
            
            <button
              onClick={handleClose}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
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
        
        <button
          onClick={handleClose}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
