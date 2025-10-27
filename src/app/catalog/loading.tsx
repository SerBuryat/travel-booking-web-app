import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton with CurrentLocation and SearchBar */}
      <header className="bg-white pt-4 px-4">
        <div className="max-w-md mx-auto flex flex-col">
          {/* CurrentLocation skeleton */}
          <div className="mb-6 flex justify-center">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>

          {/* SearchBar skeleton */}
          <div className="flex items-center w-full gap-2">
            <div className="relative flex items-center flex-1">
              <div 
                className="w-full px-8 py-1.5 rounded-[10px] bg-gray-200 animate-pulse"
                style={{ backgroundColor: '#7676801F' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4"></div>
                  <div className="w-20 h-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* GeneralCategoriesListComponent skeleton */}
      <div className="p-4 pt-2">
        <div className="overflow-y-auto">
          <ul>
            {[...Array(4)].map((_, index) => (
              <li key={index} className="relative">
                <div className="flex items-center py-1 relative">
                  {/* Icon skeleton */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-[10px] bg-gray-200 animate-pulse"></div>
                  {/* Text skeleton */}
                  <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse ml-5 w-3/4"></div>
                  {/* Arrow skeleton */}
                  <div className="flex-shrink-0 w-4 h-4 ml-4 bg-gray-200 rounded animate-pulse"></div>
                  {/* Bottom border */}
                  <div className="absolute left-[10%] bottom-0 w-[80%] h-px bg-gray-200" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* PopularServicesComponent skeleton */}
      <div className="px-4 py-4">
        {/* Header skeleton */}
        <div className="mb-4 flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
        </div>

        {/* Services grid skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-[24px] overflow-hidden shadow-lg w-40">
              {/* Service photo skeleton */}
              <div className="h-40 w-full bg-gray-200 animate-pulse"></div>
              {/* Service content skeleton */}
              <div className="p-3">
                <div className="h-5 bg-gray-200 rounded animate-pulse mb-1 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3 mt-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ServiceRegistrationBanner skeleton */}
      <div className="p-6 rounded-lg mx-4 my-6 shadow-lg" style={{ backgroundColor: '#C7FFCD' }}>
        <div className="text-center">
          {/* Title skeleton */}
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-3 mx-auto w-3/4"></div>
          {/* Description skeleton */}
          <div className="mb-6 max-w-2xl mx-auto">
            <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-5/6 mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6 mx-auto"></div>
          </div>
          {/* Button skeleton */}
          <div className="w-full py-3 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>

      {/* PrivatePolicyButton skeleton */}
      <div className="flex flex-col items-center space-y-3">
        <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>
    </div>
  );
} 