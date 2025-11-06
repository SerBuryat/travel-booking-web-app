import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto pt-2 px-4">
      {/* Заголовок skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
      </div>

      {/* Список заявок skeleton */}
      <div className="flex flex-col gap-2 divide-y divide-gray-200 bg-white rounded-md">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="w-full flex gap-2 items-center border-b border-gray-200 bg-white"
          >
            <div className="flex-1 px-4 py-3">
              {/* Заголовок заявки */}
              <div className="mb-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-40"></div>
              </div>
              
              {/* Категория */}
              <div className="mb-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
              
              {/* Дата создания */}
              <div className="mb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
              </div>
              
              {/* Статус предложений */}
              <div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-44"></div>
              </div>
            </div>
            
            {/* Стрелка */}
            <div className="px-4">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка "Создать заявку" skeleton */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 flex justify-center" style={{ zIndex: 60 }}>
        <div 
          className="bg-gray-200 rounded-full animate-pulse"
          style={{
            width: '156px',
            height: '42px'
          }}
        ></div>
      </div>
    </div>
  );
}
