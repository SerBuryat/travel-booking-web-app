'use client';

import React from 'react';

interface StatusFieldProps {
  status: string;
}

export default function StatusField({ status }: StatusFieldProps) {
  return (
    <div className="rounded-md bg-gray-100 p-3 flex flex-col items-center">
      <svg className="w-6 h-6 mb-1 text-black" fill="currentColor" viewBox="0 0 20 20">
        <path 
          fillRule="evenodd" 
          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" 
          clipRule="evenodd" 
        />
      </svg>
      <div className="text-sm font-bold text-black text-center">{status}</div>
    </div>
  );
}

