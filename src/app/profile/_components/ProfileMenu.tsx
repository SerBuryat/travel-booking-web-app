'use client';

import React, {useState} from 'react';
import OrdersMenuItem from './menu-items/OrdersMenuItem';
import InviteMenuItem from './menu-items/InviteMenuItem';
import ReviewsMenuItem from './menu-items/ReviewsMenuItem';
import SupportMenuItem from './menu-items/SupportMenuItem';
import FaqMenuItem from './menu-items/FaqMenuItem';
import BusinessMenuItem from './menu-items/BusinessMenuItem';
import ClientMenuItem from './menu-items/ClientMenuItem';
import LogoutMenuItem from './menu-items/LogoutMenuItem';
import {useAuth} from '@/contexts/AuthContext';

interface ProfileMenuProps {
  providerInfo: {id: number; status: string} | null;
}

export default function ProfileMenu({ providerInfo }: ProfileMenuProps) {
  const { user } = useAuth();

  const isProvider = user?.role === 'provider';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<{ success: boolean; error?: string; targetRole?: 'provider' | 'user'; } | null>(null);

  const handleProviderSwitchResult = (result: { success: boolean; error?: string; }) => {
    setModalState({ success: !!result.success, error: result.error, targetRole: 'provider' });
    setIsModalOpen(true);
  };

  const handleClientSwitchResult = (result: { success: boolean; error?: string; }) => {
    setModalState({ success: !!result.success, error: result.error, targetRole: 'user' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalState(null);
  };

  return (
    <div className="space-y-4">
      <OrdersMenuItem />
      <InviteMenuItem />
      <ReviewsMenuItem />
      <SupportMenuItem />
      <FaqMenuItem />
      {/* Держим обе кнопки смонтированными, чтобы не терять состояние модалки при смене роли */}
      <div className={isProvider ? 'hidden' : ''}>
        <BusinessMenuItem onSwitchResult={handleProviderSwitchResult} providerInfo={providerInfo} />
      </div>
      <div className={!isProvider ? 'hidden' : ''}>
        <ClientMenuItem onSwitchResult={handleClientSwitchResult} />
      </div>
      <LogoutMenuItem />

      {/* Модалка для переключения на роль */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {modalState?.success ? 'Успешное переключение' : 'Ошибка переключения'}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-sm text-gray-700 space-y-4">
                {modalState ? (
                    modalState.success ? (
                        <div className="space-y-3">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-green-800 font-medium">✅ Переключение выполнено успешно!</p>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-blue-800 text-sm">
                              {modalState.targetRole === 'provider'
                                  ? 'Теперь вы можете управлять своими сервисами в бизнес-аккаунте.'
                                  : 'Теперь вы можете пользоваться приложением как клиент.'}
                            </p>
                          </div>

                          <div className="flex justify-center">
                            {modalState.targetRole === 'provider' ? (
                                <a href="/provider/services" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Перейти в "Мои объекты"</a>
                            ) : (
                                <a href="/catalog" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Перейти в "Каталог"</a>
                            )}
                          </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-800 font-medium">❌ Ошибка при переключении</p>
                            <p className="text-red-700 text-sm mt-1">{modalState.error}</p>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-yellow-800 text-sm">
                              {modalState.targetRole === 'provider'
                                  ? 'Убедитесь, что у вас есть бизнес-аккаунт. Если его нет, сначала зарегистрируйте сервис.'
                                  : 'Попробуйте позже или войдите в аккаунт заново.'}
                            </p>
                          </div>
                        </div>
                    )
                ) : null}
              </div>
            </div>
          </div>
      )}
    </div>
  );
}
