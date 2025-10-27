import React from 'react';
import Link from 'next/link';
import { PAGE_ROUTES } from '@/utils/routes';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        {/* Эмодзи для дружелюбности */}
        <div className="text-6xl mb-6">😅</div>
        
        {/* Заголовок */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Упс! Что-то пошло не так
        </h1>
        
        {/* Описание */}
        <p className="text-gray-600 mb-8 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
          Мы уже работаем над решением этой проблемы. 
          Пока что предлагаем вернуться на главную страницу и попробовать снова! 🚀
        </p>
        
        {/* Кнопка возврата */}
        <Link 
          href={PAGE_ROUTES.HOME}
          className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          🏠 Вернуться на главную
        </Link>
        
        {/* Дополнительная информация */}
        <div className="mt-8 text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
          Если проблема повторяется, пожалуйста, обратитесь в поддержку
        </div>
      </div>
    </div>
  );
}
