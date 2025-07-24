import React, { useState, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  onClear?: () => void;
  error?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, onClear, error }) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.length >= 3) {
      onSearch(value);
    }
  };

  return (
    <div className="relative flex items-center w-full">
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
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        className={`w-full px-10 py-3 rounded-[10px] text-[17px] font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border border-red-500' : ''}`}
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
          onClick={() => {
            onChange('');
            onClear && onClear();
            inputRef.current?.focus();
          }}
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
          <span className="text-[17px] font-normal text-gray-500">Search</span>
        </div>
      )}
      {/* Error/hint */}
      {error && (
        <div className="absolute left-0 right-0 -bottom-6 text-center text-red-500 text-xs">{error}</div>
      )}
    </div>
  );
}; 