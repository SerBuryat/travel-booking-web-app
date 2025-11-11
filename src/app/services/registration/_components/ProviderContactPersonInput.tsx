import React from 'react';
import {FieldError, UseFormRegister} from 'react-hook-form';

interface ProviderContactPersonInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

export const ProviderContactPersonInput: React.FC<ProviderContactPersonInputProps> = ({
  register,
  error
}) => {
  return (
    <div className="relative">
      <label htmlFor="providerContactPerson" className="block text-sm font-medium mb-0 pl-2" style={{ color: '#A2ACB0', marginLeft: '8px', marginTop: '4px', marginBottom: '-8px', zIndex: 10, position: 'relative', width: 'fit-content', background: '#F9FAFB', paddingLeft: '4px', paddingRight: '4px' }}>
        Контактное лицо <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="providerContactPerson"
        {...register('providerContactPerson')}
        className={`w-full px-4 py-3 border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        style={{ borderRadius: '14px' }}
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
