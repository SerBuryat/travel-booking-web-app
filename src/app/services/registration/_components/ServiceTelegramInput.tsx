'use client';

import React from 'react';
import {FieldError, UseFormRegister} from 'react-hook-form';
import {ServiceRegistrationFormData} from '@/schemas/serviceRegistrationSchema';

interface ServiceTelegramInputProps {
  register: UseFormRegister<ServiceRegistrationFormData>;
  error?: FieldError;
}

export const ServiceTelegramInput: React.FC<ServiceTelegramInputProps> = ({ 
  register, 
  error 
}) => {
  return (
    <div>
      <label htmlFor="tg_username" className="block text-sm font-medium text-gray-700 mb-2">
        Telegram
      </label>
      <div className="relative">
                       <input
                 {...register('tg_username')}
                 type="text"
                 id="tg_username"
                 className={`
                   w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900
                   ${error ? 'border-red-300' : 'border-gray-300'}
                 `}
                 placeholder="@username"
               />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500">@</span>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};
