'use client';

import React, {useState, useEffect} from 'react';
import BaseMenuItem from './BaseMenuItem';
import {ProviderSwitchResult, switchToProvider} from "@/lib/auth/role/switchToProvider";
import {useAuth} from "@/contexts/AuthContext";
import {PAGE_ROUTES} from "@/utils/routes";
import {useRouter} from "next/navigation";

interface BusinessMenuItemProps {
  onSwitchResult?: (result: ProviderSwitchResult) => void;
  providerInfo: {id: number; status: string} | null;
}

export default function BusinessMenuItem({ onSwitchResult, providerInfo }: BusinessMenuItemProps) {
  const { refreshUser } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Определяем, активна ли кнопка (только если провайдер существует и статус 'active')
  const isButtonEnabled = providerInfo?.status === 'active';

  const icon = (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2.33329 15.9998C1.87496 15.9998 1.48274 15.8368 1.15663 15.5107C0.830515 15.1846 0.667182 14.7921 0.666626 14.3332V10.9998H6.49996V12.6665H11.5V10.9998H17.3333V14.3332C17.3333 14.7915 17.1702 15.184 16.8441 15.5107C16.518 15.8373 16.1255 16.0004 15.6666 15.9998H2.33329ZM8.16663 10.9998V9.33317H9.83329V10.9998H8.16663ZM0.666626 9.33317V5.1665C0.666626 4.70817 0.829959 4.31595 1.15663 3.98984C1.48329 3.66373 1.87551 3.50039 2.33329 3.49984H5.66663V1.83317C5.66663 1.37484 5.82996 0.982615 6.15663 0.656504C6.48329 0.330393 6.87551 0.167059 7.33329 0.166504H10.6666C11.125 0.166504 11.5175 0.329837 11.8441 0.656504C12.1708 0.983171 12.3338 1.37539 12.3333 1.83317V3.49984H15.6666C16.125 3.49984 16.5175 3.66317 16.8441 3.98984C17.1708 4.3165 17.3338 4.70873 17.3333 5.1665V9.33317H11.5V7.6665H6.49996V9.33317H0.666626ZM7.33329 3.49984H10.6666V1.83317H7.33329V3.49984Z"
            fill="currentColor"/>
      </svg>
  );

  const infoIcon = (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const handleSwitchToProvider = async () => {
    if (isProcessing || !isButtonEnabled) return;
    setIsProcessing(true);
    try {
      const data = await switchToProvider();
      // Если переключение успешно, обновляем контекст
      if (data?.success) {
        await refreshUser();
      }
      onSwitchResult?.(data ?? { success: false, error: 'Unknown error' });
    } catch (error) {
      console.error('Error switching to provider:', error);
      onSwitchResult?.({ success: false, error: 'Ошибка сети при переключении на провайдера' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  const handleGoToRegistration = () => {
    router.push(PAGE_ROUTES.SERVICES.REGISTRATION);
    closeInfoModal();
  };

  // Определяем сообщение для модального окна
  const getModalContent = () => {
    if (!providerInfo) {
      // Аккаунта нет
      return {
        title: 'Подключите ваш бизнес к нашему приложению',
        message: 'Увеличьте количество клиентов, привлекая аудиторию нашего приложения. Подключите ваш отель, ресторан, кафе или развлекательное заведение всего за несколько шагов.',
        showRegistrationButton: true
      };
    } else if (providerInfo.status !== 'active') {
      // Аккаунт существует, но неактивен
      const statusText = {
        'pending': 'на модерации',
        'suspended': 'приостановлен',
        'rejected': 'отклонен'
      }[providerInfo.status] || 'неактивен';

      return {
        title: 'Бизнес-аккаунт неактивен',
        message: `Ваш бизнес-аккаунт ${statusText}. Обратитесь в службу поддержки для решения вопроса.`,
        showRegistrationButton: false
      };
    }
    return null;
  };

  const modalContent = getModalContent();

  // Закрытие модального окна по Escape и блокировка скролла
  useEffect(() => {
    if (!isInfoModalOpen) return;

    document.body.style.overflow = 'hidden';
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeInfoModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isInfoModalOpen]);

  return (
    <>
      <div className="relative w-full">
        <BaseMenuItem
          title="Перейти в бизнес-аккаунт"
          icon={icon}
          onClick={handleSwitchToProvider}
          disabled={!isButtonEnabled}
          className={!isButtonEnabled ? 'pr-12' : ''}
        />
        {!isButtonEnabled && (
          <button
            onClick={handleInfoClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-10"
            aria-label="Почему кнопка неактивна?"
            type="button"
          >
            {infoIcon}
          </button>
        )}
      </div>

      {/* Модальное окно с информацией */}
      {isInfoModalOpen && modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalContent.title}
              </h2>
              <button
                onClick={closeInfoModal}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Закрыть"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-sm text-gray-700 space-y-4 mb-6">
              <p className="leading-relaxed">{modalContent.message}</p>
            </div>

            <div className="flex flex-col space-y-3">
              {modalContent.showRegistrationButton ? (
                <button
                  onClick={handleGoToRegistration}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  подключить бизнес
                </button>
              ) : null}
              <button
                onClick={closeInfoModal}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
