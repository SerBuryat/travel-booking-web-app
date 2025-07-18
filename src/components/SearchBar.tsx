import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      {!value && (
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
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=""
        className="w-full px-4 py-3 rounded-[10px] text-[17px] font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
        style={{
          backgroundColor: '#7676801F',
          fontFamily: 'Inter, sans-serif'
        }}
      />
    </div>
  );
}; 