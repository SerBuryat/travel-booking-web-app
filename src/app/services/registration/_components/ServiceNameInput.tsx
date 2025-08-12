'use client';

import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { ServiceRegistrationFormData } from '@/schemas/serviceRegistrationSchema';

interface ServiceNameInputProps {
  register: UseFormRegister<ServiceRegistrationFormData>;
  error?: FieldError;
}

export const ServiceNameInput: React.FC<ServiceNameInputProps> = ({ 
  register, 
  error 
}) => {
  return (
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
        Название сервиса *
      </label>
                   <input
               {...register('name')}
               type="text"
               id="name"
               className={`
                 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900
                 ${error ? 'border-red-300' : 'border-gray-300'}
               `}
               placeholder="Введите название вашего сервиса"
             />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};
