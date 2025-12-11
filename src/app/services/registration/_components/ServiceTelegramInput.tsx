'use client';

import React from 'react';
import {FieldError, UseFormRegister} from 'react-hook-form';
import {CreateServiceWithProviderData} from '@/schemas/service/createServiceSchema';

interface ServiceTelegramInputProps {
  register: UseFormRegister<CreateServiceWithProviderData>;
  error?: FieldError;
}

export const ServiceTelegramInput: React.FC<ServiceTelegramInputProps> = ({ 
  register, 
  error 
}) => {
  return (
    <div className="relative">
      <label htmlFor="tg_username" className="block text-sm font-medium mb-0 pl-2" style={{ color: '#A2ACB0', marginLeft: '8px', marginTop: '4px', marginBottom: '-8px', zIndex: 10, position: 'relative', width: 'fit-content', background: '#F9FAFB', paddingLeft: '4px', paddingRight: '4px' }}>
        Telegram
      </label>
      <div className="relative">
                       <input
                 {...register('tg_username')}
                 type="text"
                 id="tg_username"
                 className={`
                   w-full px-3 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900
                   ${error ? 'border-red-300' : 'border-gray-300'}
                 `}
                 style={{ borderRadius: '14px' }}
                 placeholder="Введите юзернейм или номер с +7"
                       />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};
