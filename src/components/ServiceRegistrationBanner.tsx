'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/contexts/AuthContext';
import {PAGE_ROUTES} from '@/utils/routes';
import {switchToProvider} from "@/lib/auth/role/switchToProvider";

interface ProviderProfile {
  id: number;
  company_name: string;
  phone: string;
  status: string;
  created_at: string;
}

interface ProviderProfileResponse {
  success: boolean;
  hasProviderAccount: boolean;
  provider?: ProviderProfile;
  error?: string;
}

// Модальное окно для существующего бизнес-аккаунта
const ExistingProviderModal: React.FC<{
  provider: ProviderProfile;
  onClose: () => void;
  onGoToBusinessAccount: () => void;
}> = ({ provider, onClose, onGoToBusinessAccount }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            У вас уже есть бизнес-аккаунт
          </h3>
          
          <div className="text-sm text-gray-500 mb-6 text-left">
            <div className="mb-2">
              <strong>Название компании:</strong> {provider.company_name}
            </div>
            <div className="mb-2">
              <strong>Телефон:</strong> {provider.phone}
            </div>
            <div className="mb-2">
              <strong>Статус:</strong> 
              <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                provider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {provider.status === 'active' ? 'Активен' : 'Неактивен'}
              </span>
            </div>
            <div>
              <strong>Создан:</strong> {new Date(provider.created_at).toLocaleDateString('ru-RU')}
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={onGoToBusinessAccount}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Перейти в бизнес-аккаунт
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ServiceRegistrationBanner: React.FC = () => {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);

  const handleConnectBusiness = async () => {
    if (!user) {
      // Если пользователь не аутентифицирован, перенаправляем на страницу инструкции
      router.push(PAGE_ROUTES.NO_AUTH);
      return;
    }

    setIsChecking(true);

    try {
      // Проверяем наличие бизнес-аккаунта
      // todo - переделать на server actions
      const response = await fetch('/api/provider/profile');
      const data: ProviderProfileResponse = await response.json();

      if (data.success && data.hasProviderAccount && data.provider) {
        // У пользователя есть бизнес-аккаунт
        setProviderProfile(data.provider);
        setShowModal(true);
      } else {
        // У пользователя нет бизнес-аккаунта, переходим к регистрации
        router.push(PAGE_ROUTES.SERVICES.REGISTRATION);
      }
    } catch (error) {
      console.error('Error checking provider profile:', error);
      // В случае ошибки переходим к регистрации
      router.push(PAGE_ROUTES.SERVICES.REGISTRATION);
    } finally {
      setIsChecking(false);
    }
  };

  const handleGoToBusinessAccount = async () => {
    try {
      // Вызываем API для смены роли на провайдера
      const providerSwitchResult = await switchToProvider();

      if (providerSwitchResult.success) {
        // Роль успешно изменена, обновляем контекст и переходим в бизнес-аккаунт
        await refreshUser();
        setShowModal(false);
        router.push(PAGE_ROUTES.PROVIDER.SERVICES);
      } else {
        console.error('Failed to switch to provider role:', providerSwitchResult.error);
        // В случае ошибки закрываем модальное окно
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error switching to provider role:', error);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="p-6 rounded-lg mx-4 my-6 shadow-lg" style={{ backgroundColor: '#C7FFCD' }}>
        <div className="text-center">
          <h2 className="font-bold mb-3 text-black" style={{ fontSize: '17px' }}>
          Подключите ваш бизнес к нашему приложению
          </h2>
          <p className="mb-6 max-w-2xl mx-auto text-black" style={{ fontSize: '13px' }}>
          Увеличьте количество клиентов, привлекая аудиторию нашего приложения. 
          Подключите ваш отель, ресторан, кафе или развлекательное заведение всего за несколько шагов.
          </p>
          <button
            onClick={handleConnectBusiness}
            disabled={isChecking}
            className={`w-full py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
              isChecking
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-white hover:bg-blue-50'
            }`}
            style={{ fontSize: '14px', fontWeight: 400, color: 'black' }}
          >
            {isChecking ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                Проверяем...
              </div>
            ) : (
              'подключить бизнес'
            )}
          </button>
        </div>
      </div>

      {/* Модальное окно для существующего бизнес-аккаунта */}
      {showModal && providerProfile && (
        <ExistingProviderModal
          provider={providerProfile}
          onClose={() => setShowModal(false)}
          onGoToBusinessAccount={handleGoToBusinessAccount}
        />
      )}
    </>
  );
};
