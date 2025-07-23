import React from 'react';

export default function Loading() {
  return (
    <>
      {/* Category Header Skeleton */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-md mx-auto">
          <div className="h-32 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
        </div>
      </div>
      {/* Services Grid Skeleton */}
      <div className="px-4 pb-32">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-[10px] overflow-hidden shadow-sm border">
                <div className="h-24 bg-gray-200 animate-pulse"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 