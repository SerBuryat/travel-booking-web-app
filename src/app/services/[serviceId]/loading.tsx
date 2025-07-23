import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Photo Carousel Skeleton */}
      <div className="w-full h-64 bg-gray-200 animate-pulse" />
      {/* Service Content Skeleton */}
      <div className="px-4 py-6">
        {/* Service Name Skeleton */}
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
        {/* Address Skeleton */}
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-6 w-1/2"></div>
        {/* Description Section Skeleton */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-24"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
          </div>
        </div>
        {/* Additional Service Info Skeleton */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
        </div>
        {/* Action Buttons Skeleton */}
        <div className="mt-8 space-y-3">
          <div className="h-14 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-14 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 