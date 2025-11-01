'use client';

import React from 'react';
import {FieldError, UseFormRegister} from 'react-hook-form';
import {CreateServiceWithProviderData} from '@/schemas/service/createServiceSchema';

interface ServiceAddressInputProps {
  register: UseFormRegister<CreateServiceWithProviderData>;
  error?: FieldError;
}

export const ServiceAddressInput: React.FC<ServiceAddressInputProps> = ({ 
  register, 
  error 
}) => {
  return (
    <div className="relative">
      <label htmlFor="address" className="block text-sm font-medium mb-0 pl-2" style={{ color: '#A2ACB0', marginLeft: '8px', marginTop: '4px', marginBottom: '-8px', zIndex: 10, position: 'relative', width: 'fit-content', background: '#F9FAFB', paddingLeft: '4px', paddingRight: '4px' }}>
        Адрес *
      </label>
                   <input
               {...register('address')}
               type="text"
               id="address"
               className={`
                 w-full px-3 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black
                 ${error ? 'border-red-300' : 'border-gray-300'}
               `}
               style={{ borderRadius: '14px' }}
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
