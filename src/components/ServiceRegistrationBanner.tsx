'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export const ServiceRegistrationBanner: React.FC = () => {
  const router = useRouter();

  const handleConnectBusiness = () => {
    router.push('/services/registration');
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mx-4 my-6 shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-3">
          Подключите свой бизнес
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Расширьте свою клиентскую базу и увеличьте доходы. 
          Зарегистрируйте свои услуги на нашей платформе и получите доступ к тысячам потенциальных клиентов.
        </p>
        <button
          onClick={handleConnectBusiness}
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Подключить бизнес
        </button>
      </div>
    </div>
  );
};
