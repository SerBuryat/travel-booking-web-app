'use client';

import React from 'react';

interface CreatedAtFieldProps {
  createdAt: string;
}

export default function CreatedAtField({ createdAt }: CreatedAtFieldProps) {
  return (
    <div className="rounded-md bg-gray-100 p-3 flex flex-col items-center">
      <svg className="w-6 h-6 mb-1 text-black" fill="currentColor" viewBox="0 0 20 20">
        <path 
          fillRule="evenodd" 
          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" 
          clipRule="evenodd" 
        />
      </svg>
      <div className="text-sm font-bold text-black text-center">{createdAt}</div>
    </div>
  );
}

