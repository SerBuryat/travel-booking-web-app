import React from 'react';

export default function PopularLoadingPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto">
        {/* Header с поисковой строкой - скелетон */}
        <div className="bg-white px-4 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Выбор локации - скелетон */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Заголовок - скелетон */}
        <div className="px-4 py-6">
          <div className="w-64 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
        </div>

        {/* Список сервисов - скелетон в 2 колонки */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                {/* Изображение */}
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
                
                {/* Название */}
                <div className="w-3/4 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                
                {/* Описание */}
                <div className="w-full h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="w-2/3 h-3 bg-gray-200 rounded mb-3 animate-pulse"></div>
                
                {/* Цена */}
                <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Navbar - скелетон */}
        <div className="fixed bottom-0 w-full z-50 pb-4 pt-2 bg-gray-100">
          <div className="flex rounded-full px-6 py-2 justify-between w-full">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse mb-1"></div>
                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
