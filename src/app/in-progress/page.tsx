import React from 'react';
import Link from 'next/link';
import { PAGE_ROUTES } from '@/utils/routes';

const getApplicationName = () => {
  return process.env.APPLICATION_NAME ?? 'TravelHub';
};

export default function InProgressPage() {
  const appName = getApplicationName();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center space-y-6">
        <div className="text-5xl">🚧</div>

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-gray-900">
            В разработке
          </h1>
          <p className="text-sm text-gray-600">
            Этот раздел {appName} находится в разработке. Скоро здесь появится новый функционал.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href={PAGE_ROUTES.PROFILE}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Вернуться в профиль
          </Link>
        </div>
      </div>
    </div>
  );
}

