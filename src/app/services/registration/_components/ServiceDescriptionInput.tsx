'use client';

import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { ServiceRegistrationFormData } from '@/schemas/serviceRegistrationSchema';

interface ServiceDescriptionInputProps {
  register: UseFormRegister<ServiceRegistrationFormData>;
  error?: FieldError;
}

export const ServiceDescriptionInput: React.FC<ServiceDescriptionInputProps> = ({ 
  register, 
  error 
}) => {
  return (
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
        Описание сервиса *
      </label>
                   <textarea
               {...register('description')}
               id="description"
               rows={4}
               className={`
                 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900
                 ${error ? 'border-red-300' : 'border-gray-300'}
               `}
               placeholder="Опишите ваш сервис подробно..."
             />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};
