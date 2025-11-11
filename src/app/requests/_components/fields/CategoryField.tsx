'use client';

import React from 'react';

interface CategoryFieldProps {
  categoryName: string;
}

export default function CategoryField({ categoryName }: CategoryFieldProps) {
  return (
    <div className="rounded-md bg-gray-100 p-3 flex flex-col gap-1 items-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69ZM12 3L2 12H5V20H11V14H13V20H19V12H22L12 3Z"
          fill="#303030"
        />
      </svg>
      <div className="text-sm font-bold text-black text-center">{categoryName || '—'}</div>
    </div>
  );
}

