"use client";

import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'number' | 'date' | 'datetime-local';
  placeholder?: string;
  required?: boolean;
  error?: FieldError;
  rows?: number;
}

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps & { name: string }>(
  ({ label, type = 'text', placeholder, required = false, error, name, rows = 3, ...props }, ref) => {
    const fieldId = `field-${name}`;
    
    return (
      <div className="relative">
        <label 
          htmlFor={fieldId} 
          className="block text-sm font-medium mb-0 pl-2"
          style={{ 
            color: '#A2ACB0', 
            marginLeft: '8px', 
            marginTop: '4px', 
            marginBottom: '-8px', 
            zIndex: 10, 
            position: 'relative', 
            width: 'fit-content', 
            background: 'white',
            paddingLeft: '4px', 
            paddingRight: '4px' 
          }}
        >
          {label} {required && <span style={{ color: '#A2ACB0' }}>*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            {...props}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={fieldId}
            name={name}
            placeholder={placeholder}
            rows={rows}
            className={`w-full px-3 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-[#A2ACB0] ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            style={{ borderRadius: '14px' }}
          />
        ) : (
          <input
            {...props}
            ref={ref as React.Ref<HTMLInputElement>}
            id={fieldId}
            name={name}
            type={type}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-[#A2ACB0] ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            style={{ borderRadius: '14px' }}
          />
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
