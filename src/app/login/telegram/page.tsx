"use client";
import React from 'react';
import {useTelegramAuthState} from './_hooks/useTelegramAuthState';
import { TelegramAuthHeader } from './_components/TelegramAuthHeader';
import { TelegramAuthProgress } from './_components/TelegramAuthProgress';
import { TelegramAuthContent } from './_components/TelegramAuthContent';

export default function TelegramAuthPage() {

  const {authState, userData, error, handleLoginWithTelegram} = useTelegramAuthState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4 pt-4 sm:pt-20 pb-20">
      <div className="w-full max-w-sm sm:max-w-md">
        <TelegramAuthHeader />
        <TelegramAuthProgress telegramAuthState={authState} />
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