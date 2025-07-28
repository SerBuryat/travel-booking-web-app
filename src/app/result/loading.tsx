import React from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <SearchBar searchValue="" showCancelButton={true} />
        
        {/* Loading skeleton for search results */}
        <div className="px-4 py-6">
          {/* Loading skeleton for services */}
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg border p-4 animate-pulse">
                <div className="flex items-start space-x-4">
                  {/* Service photo skeleton */}
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  
                  {/* Service content skeleton */}
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  
                  {/* Price skeleton */}
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Header>
      
      {/* Bottom gradient overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 