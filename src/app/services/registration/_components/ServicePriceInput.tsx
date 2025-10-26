'use client';

import React from 'react';
import {FieldError, UseFormRegister} from 'react-hook-form';
import {ServiceRegistrationFormData} from '@/schemas/serviceRegistrationSchema';

interface ServicePriceInputProps {
  register: UseFormRegister<ServiceRegistrationFormData>;
  error?: FieldError;
}

export const ServicePriceInput: React.FC<ServicePriceInputProps> = ({ 
  register, 
  error 
}) => {
  return (
    <div className="relative">
      <label htmlFor="price" className="block text-sm font-medium mb-0 pl-2" style={{ color: '#A2ACB0', marginLeft: '8px', marginTop: '4px', marginBottom: '-8px', zIndex: 10, position: 'relative', width: 'fit-content', background: '#F9FAFB', paddingLeft: '4px', paddingRight: '4px' }}>
        Стоимость *
      </label>
      <div className="relative">
                       <input
                 {...register('price')}
                 type="text"
                 id="price"
                 className={`
                   w-full pl-8 pr-3 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900
                   ${error ? 'border-red-300' : 'border-gray-300'}
                 `}
                 style={{ borderRadius: '14px' }}
                 placeholder="0.00"
               />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">₽</span>
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
