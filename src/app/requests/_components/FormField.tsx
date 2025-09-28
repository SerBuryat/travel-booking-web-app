"use client";

import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'number' | 'date';
  placeholder?: string;
  required?: boolean;
  error?: FieldError;
  rows?: number;
}

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps & { name: string }>(
  ({ label, type = 'text', placeholder, required = false, error, name, rows = 3, ...props }, ref) => {
    const fieldId = `field-${name}`;
    
    const inputStyle = {
      width: '100%',
      padding: '12px 20px',
      border: error ? '1px solid #EF4444' : '1px solid #A2ACB0',
      borderRadius: '14px',
      fontSize: '15px',
      fontFamily: 'Inter, sans-serif',
      color: '#000000',
      outline: 'none',
      transition: 'border-color 0.2s',
    };

    const labelStyle = {
      position: 'absolute' as const,
      top: '-8px',
      left: '12px',
      backgroundColor: 'white',
      padding: '0 4px',
      fontSize: '14px',
      fontWeight: 500,
      color: error ? '#EF4444' : '#A2ACB0',
      zIndex: 1,
    };

    const containerStyle = {
      position: 'relative' as const,
      marginBottom: '20px',
    };

    return (
      <div style={containerStyle}>
        <label htmlFor={fieldId} style={labelStyle}>
          {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            {...props}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={fieldId}
            name={name}
            placeholder={placeholder}
            rows={rows}
            style={inputStyle}
          />
        ) : (
          <input
            {...props}
            ref={ref as React.Ref<HTMLInputElement>}
            id={fieldId}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            style={inputStyle}
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
