"use client";
import React from 'react';
import { useTelegramAuth } from './_hooks/useTelegramAuth';
import { TelegramAuthHeader } from './_components/TelegramAuthHeader';
import { TelegramAuthProgress } from './_components/TelegramAuthProgress';
import { TelegramAuthContent } from './_components/TelegramAuthContent';

export default function TelegramAuthPage() {
  const { 
    authState, 
    userData, 
    error,
    handleLoginWithTelegram
  } = useTelegramAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4 pt-4 sm:pt-20 pb-20">
      <div className="w-full max-w-sm sm:max-w-md">
        <TelegramAuthHeader />
        <TelegramAuthProgress currentStep={getCurrentStep(authState)} />
        <TelegramAuthContent 
          state={authState}
          userData={userData!}
          error={error}
          onLogin={handleLoginWithTelegram}
        />
      </div>
    </div>
  );
}

function getCurrentStep(authState: string): number {
  switch (authState) {
    case 'loading': return 0;
    case 'validating': return 1;
    case 'success': return 2;
    case 'logging-in': return 2;
    case 'error': return 1;
    case 'no-data': return 0;
    case 'invalid-access': return 0;
    case 'already-authenticated': return 3; // Новый этап
    default: return 0;
  }
}