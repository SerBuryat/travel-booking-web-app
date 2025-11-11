"use client";
import React, {useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {PAGE_ROUTES} from '@/utils/routes';

interface SearchBarProps {
  searchValue?: string;
  showCancelButton?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchValue = '', showCancelButton = false }) => {
  const [value, setValue] = useState(searchValue);
  const [error, setError] = useState<string | undefined>(undefined);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (value.length < 3) {
        setError('Enter at least 3 characters to search');
        return;
      }
      setError(undefined);
      
      // Простой поиск без сохранения categoryId для MVP
      const params = new URLSearchParams();
      params.set('search', value);
      
      router.push(`${PAGE_ROUTES.CATALOG.RESULT}?${params.toString()}`);
    }
  };

  const handleClear = () => {
    setValue('');
    setError(undefined);
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    router.push(PAGE_ROUTES.CATALOG.ROOT);
  };

  return (
    <div className="flex items-center w-full gap-2">
      <div className="relative flex items-center flex-1">
        {/* Search icon on left when focused or has value */}
        {(focused || value) && (
          <div className="absolute left-3 flex items-center">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="#707579"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(undefined);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          className={`w-full px-8 py-1.5 rounded-[10px] text-[17px] font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border border-red-500' : ''}`}
          style={{
            backgroundColor: '#7676801F',
            fontFamily: 'Inter, sans-serif',
          }}
        />
        {/* Clear button (x) on left when focused or has value */}
        {(focused || value) && value && (
          <button
            type="button"
            className="absolute right-2 flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500"
            onClick={handleClear}
            tabIndex={-1}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#E5E7EB" />
              <path d="M15 9L9 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 9L15 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
        {/* Placeholder when not focused and no value */}
        {!focused && !value && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="#707579"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[17px] font-normal text-gray-500">Поиск</span>
          </div>
        )}
        {/* Error/hint */}
        {error && (
          <div className="absolute left-0 right-0 -bottom-6 text-center text-red-500 text-xs">{error}</div>
        )}
      </div>
      {/* Cancel button - only show when showCancelButton is true */}
      {showCancelButton && (
        <button
          className="px-4 py-2 text-blue-600 font-semibold rounded hover:underline whitespace-nowrap"
          onClick={handleCancel}
        >
          Отменить
        </button>
      )}
    </div>
  );
}; 