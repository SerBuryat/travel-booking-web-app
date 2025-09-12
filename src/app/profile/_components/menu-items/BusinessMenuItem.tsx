'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import BaseMenuItem from './BaseMenuItem';
import {ProviderSwitchResult, switchToProvider} from "@/lib/auth/provider/switchToProvider";

export default function BusinessMenuItem() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState<ProviderSwitchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const icon = (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2.33329 15.9998C1.87496 15.9998 1.48274 15.8368 1.15663 15.5107C0.830515 15.1846 0.667182 14.7921 0.666626 14.3332V10.9998H6.49996V12.6665H11.5V10.9998H17.3333V14.3332C17.3333 14.7915 17.1702 15.184 16.8441 15.5107C16.518 15.8373 16.1255 16.0004 15.6666 15.9998H2.33329ZM8.16663 10.9998V9.33317H9.83329V10.9998H8.16663ZM0.666626 9.33317V5.1665C0.666626 4.70817 0.829959 4.31595 1.15663 3.98984C1.48329 3.66373 1.87551 3.50039 2.33329 3.49984H5.66663V1.83317C5.66663 1.37484 5.82996 0.982615 6.15663 0.656504C6.48329 0.330393 6.87551 0.167059 7.33329 0.166504H10.6666C11.125 0.166504 11.5175 0.329837 11.8441 0.656504C12.1708 0.983171 12.3338 1.37539 12.3333 1.83317V3.49984H15.6666C16.125 3.49984 16.5175 3.66317 16.8441 3.98984C17.1708 4.3165 17.3338 4.70873 17.3333 5.1665V9.33317H11.5V7.6665H6.49996V9.33317H0.666626ZM7.33329 3.49984H10.6666V1.83317H7.33329V3.49984Z"
            fill="black"/>
      </svg>
  );

  const handleSwitchToProvider = async () => {
    setIsLoading(true);
    try {
      const data = await switchToProvider();
      setApiResponse(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error switching to provider:', error);
      setApiResponse({
        success: false,
        error: 'Ошибка сети при переключении на провайдера'
      });
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setApiResponse(null);
  };

  return (
    <>
      <BaseMenuItem
          title="Перейти в бизнес-аккаунт"
          icon={icon}
          onClick={handleSwitchToProvider}
      />

      {/* Модальное окно с результатом API */}
      {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {apiResponse?.success ? 'Успешное переключение' : 'Ошибка переключения'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-sm text-gray-700 space-y-4">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">Переключение на провайдера...</p>
                </div>
              ) : apiResponse ? (
                <>
                  {apiResponse.success ? (
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-800 font-medium">✅ Успешно переключились на роль провайдера!</p>
                      </div>
                      
                                             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                         <p className="text-blue-800 text-sm">
                           Теперь вы можете управлять своими сервисами в бизнес-аккаунте.
                         </p>
                       </div>

                       <div className="flex justify-center">
                         <button
                           onClick={() => router.push('/provider/services')}
                           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                         >
                           Перейти в бизнес-аккаунт
                         </button>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-800 font-medium">❌ Ошибка при переключении</p>
                        <p className="text-red-700 text-sm mt-1">{apiResponse.error}</p>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800 text-sm">
                          Убедитесь, что у вас есть бизнес-аккаунт. Если его нет, сначала зарегистрируйте сервис.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
