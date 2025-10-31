'use client';

import React from 'react';
import {FieldError, UseFormRegister} from 'react-hook-form';
import {CreateServiceData} from '@/schemas/service/createServiceSchema';

interface ServiceNameInputProps {
  register: UseFormRegister<CreateServiceData>;
  error?: FieldError;
}

export const ServiceNameInput: React.FC<ServiceNameInputProps> = ({ 
  register, 
  error 
}) => {
  return (
    <div className="relative">
      <label htmlFor="name" className="block text-sm font-medium mb-0 pl-2" style={{ color: '#A2ACB0', marginLeft: '8px', marginTop: '4px', marginBottom: '-8px', zIndex: 10, position: 'relative', width: 'fit-content', background: '#F9FAFB', paddingLeft: '4px', paddingRight: '4px' }}>
        Название заведения *
      </label>
      <input
          {...register('name')}
          type="text"
          id="name"
          className={
            `w-full px-3 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900
            ${error ? 'border-red-300' : 'border-gray-300'}`}
          style={{ borderRadius: '14px' }}
          placeholder="Введите название заведения"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};
