import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface ProviderContactPersonInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

export const ProviderContactPersonInput: React.FC<ProviderContactPersonInputProps> = ({
  register,
  error
}) => {
  return (
    <div>
      <label htmlFor="providerContactPerson" className="block text-sm font-medium text-gray-700 mb-2">
        Контактное лицо <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="providerContactPerson"
        {...register('providerContactPerson')}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        placeholder="Ваше имя"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};
