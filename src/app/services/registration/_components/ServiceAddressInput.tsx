'use client';

import React from 'react';
import {FieldError, UseFormRegister} from 'react-hook-form';
import {ServiceRegistrationFormData} from '@/schemas/serviceRegistrationSchema';

interface ServiceAddressInputProps {
  register: UseFormRegister<ServiceRegistrationFormData>;
  error?: FieldError;
}

export const ServiceAddressInput: React.FC<ServiceAddressInputProps> = ({ 
  register, 
  error 
}) => {
  return (
    <div>
      <label htmlFor="address" className="block text-sm font-medium text-black mb-2">
        Адрес *
      </label>
                   <input
               {...register('address')}
               type="text"
               id="address"
               className={`
                 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black
                 ${error ? 'border-red-300' : 'border-gray-300'}
               `}
               placeholder="Введите полный адрес"
             />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};
