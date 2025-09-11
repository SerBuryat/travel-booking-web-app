import React from 'react';
import {FieldError, UseFormRegister} from 'react-hook-form';

interface ProviderPhoneInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

export const ProviderPhoneInput: React.FC<ProviderPhoneInputProps> = ({
  register,
  error
}) => {
  return (
    <div>
      <label htmlFor="providerPhone" className="block text-sm font-medium text-gray-700 mb-2">
        Телефон компании <span className="text-red-500">*</span>
      </label>
      <input
        type="tel"
        id="providerPhone"
        {...register('providerPhone')}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
        }`}
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
