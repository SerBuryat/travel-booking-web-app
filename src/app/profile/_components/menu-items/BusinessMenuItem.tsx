'use client';

import React, {useState} from 'react';
import BaseMenuItem from './BaseMenuItem';
import {ProviderSwitchResult, switchToProvider} from "@/lib/auth/role/switchToProvider";
import {useAuth} from "@/contexts/AuthContext";

interface BusinessMenuItemProps {
  onSwitchResult?: (result: ProviderSwitchResult) => void;
}

export default function BusinessMenuItem({ onSwitchResult }: BusinessMenuItemProps) {
  const { refreshUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const icon = (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2.33329 15.9998C1.87496 15.9998 1.48274 15.8368 1.15663 15.5107C0.830515 15.1846 0.667182 14.7921 0.666626 14.3332V10.9998H6.49996V12.6665H11.5V10.9998H17.3333V14.3332C17.3333 14.7915 17.1702 15.184 16.8441 15.5107C16.518 15.8373 16.1255 16.0004 15.6666 15.9998H2.33329ZM8.16663 10.9998V9.33317H9.83329V10.9998H8.16663ZM0.666626 9.33317V5.1665C0.666626 4.70817 0.829959 4.31595 1.15663 3.98984C1.48329 3.66373 1.87551 3.50039 2.33329 3.49984H5.66663V1.83317C5.66663 1.37484 5.82996 0.982615 6.15663 0.656504C6.48329 0.330393 6.87551 0.167059 7.33329 0.166504H10.6666C11.125 0.166504 11.5175 0.329837 11.8441 0.656504C12.1708 0.983171 12.3338 1.37539 12.3333 1.83317V3.49984H15.6666C16.125 3.49984 16.5175 3.66317 16.8441 3.98984C17.1708 4.3165 17.3338 4.70873 17.3333 5.1665V9.33317H11.5V7.6665H6.49996V9.33317H0.666626ZM7.33329 3.49984H10.6666V1.83317H7.33329V3.49984Z"
            fill="black"/>
      </svg>
  );

  const handleSwitchToProvider = async () => {
    if (isProcessing) return;
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

  return (
    <>
      <BaseMenuItem
          title="Перейти в бизнес-аккаунт"
          icon={icon}
          onClick={handleSwitchToProvider}
      />
    </>
  );
}
