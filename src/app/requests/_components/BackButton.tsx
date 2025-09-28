"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/requests/create');
  };

  return (
    <button
      onClick={handleBack}
      className="w-full py-3 px-4 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
    >
      Назад
    </button>
  );
};
