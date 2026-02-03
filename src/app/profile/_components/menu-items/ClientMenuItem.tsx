'use client';

import React, {useState} from 'react';
import BaseMenuItem from './BaseMenuItem';
import {ClientSwitchResult, switchToClient} from '@/lib/auth/roles/switchToClient';
import {useAuth} from '@/contexts/AuthContext';

interface ClientMenuItemProps {
  onSwitchResult?: (result: ClientSwitchResult) => void;
}

export default function ClientMenuItem({ onSwitchResult }: ClientMenuItemProps) {
  const { refreshUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Иконка «назад к клиенту»
  const icon = (
      <svg width="18" height="17" viewBox="0 0 24 24" id="user" data-name="Flat Color"
           xmlns="http://www.w3.org/2000/svg" className="icon flat-color">
        <path id="primary"
              d="M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,6,6,0,0,1,6-6h6A6,6,0,0,1,21,20Zm-9-8A5,5,0,1,0,7,7,5,5,0,0,0,12,12Z"/>
      </svg>
  )

  const handleSwitchToClient = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const data = await switchToClient();
      if (data?.success) {
        await refreshUser();
      }
      onSwitchResult?.(data ?? {success: false, error: 'Unknown error'});
    } catch (error) {
      console.error('Error switching to client:', error);
      onSwitchResult?.({success: false, error: 'Ошибка сети при переключении на клиента'});
    } finally {
      setIsProcessing(false);
    }
  };

  return (
      <>
        <BaseMenuItem
            title="Обратно в клиентский аккаунт"
            icon={icon}
            onClick={handleSwitchToClient}
        />
      </>
  );
}


