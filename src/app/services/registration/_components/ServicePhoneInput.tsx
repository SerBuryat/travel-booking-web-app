'use client';

import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { ServiceRegistrationFormData } from '@/schemas/serviceRegistrationSchema';

interface ServicePhoneInputProps {
  register: UseFormRegister<ServiceRegistrationFormData>;
  error?: FieldError;
}

export const ServicePhoneInput: React.FC<ServicePhoneInputProps> = ({ 
  register, 
  error 
}) => {
  return (
    <div>
      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
        Телефон
      </label>
                   <input
               {...register('phone')}
               type="tel"
               id="phone"
               className={`
                 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900
                 ${error ? 'border-red-300' : 'border-gray-300'}
               `}
               placeholder="+7 (999) 123-45-67"
             />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};
