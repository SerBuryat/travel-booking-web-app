import React from 'react';
import {Header} from '@/components/Header';
import {SearchBar} from '@/components/SearchBar';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-md mx-auto">
        {/* Header с поисковой строкой */}
        <Header>
          <SearchBar />
        </Header>

        {/* Loading skeleton для категорий */}
        <div className="px-4 py-2">
          {/* Ряд 1 - большие иконки */}
          <div className="flex space-x-8 mb-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-200 rounded-[15px] mb-2 animate-pulse"></div>
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Ряд 2 - маленькие иконки */}
          <div className="flex space-x-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-[15px] mb-2 animate-pulse"></div>
                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading skeleton для популярных сервисов */}
        <div className="px-4 py-6">
          {/* Заголовок Popular */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Сетка сервисов */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-[24px] p-3 animate-pulse">
                {/* Фото сервиса */}
                <div className="h-32 w-full bg-gray-200 rounded mb-3"></div>
                
                {/* Контент сервиса */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading skeleton для кнопок */}
        <div className="px-4 py-6 flex flex-col items-center space-y-3">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 