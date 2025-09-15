"use client";
import React, { Suspense } from 'react';
import { SearchBar } from './SearchBar';

interface SearchBarWrapperProps {
  searchValue?: string;
  showCancelButton?: boolean;
}

export const SearchBarWrapper: React.FC<SearchBarWrapperProps> = (props) => {
  return (
    <Suspense fallback={<SearchBarFallback />}>
      <SearchBar {...props} />
    </Suspense>
  );
};

const SearchBarFallback: React.FC = () => {
  return (
    <div className="flex items-center w-full gap-2">
      <div className="relative flex items-center flex-1">
        <div className="w-full px-10 py-3 rounded-[10px] text-[17px] font-normal text-gray-900 bg-gray-200 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
