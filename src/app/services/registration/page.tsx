import React from 'react';
import { ServiceRegistrationForm } from './_components/ServiceRegistrationForm';

export default function ServiceRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
             <div className="max-w-4xl mx-auto px-4 py-8">
         {/* Красивый заголовок с градиентом и иконкой */}
         <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-xl shadow-blue-500/25">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
             </svg>
           </div>
           
           <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
             Регистрация сервиса
           </h1>
           
           <div className="max-w-3xl mx-auto">
             <p className="text-xl text-gray-700 leading-relaxed mb-4">
               Заполните форму ниже, чтобы зарегистрировать ваш сервис на нашей платформе
             </p>
             <p className="text-lg text-gray-600 leading-relaxed">
               Это поможет клиентам найти и заказать ваши услуги, расширив ваш бизнес
             </p>
           </div>
           
           {/* Декоративные элементы */}
           <div className="flex justify-center space-x-2 mt-8">
             <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
             <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
             <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
           </div>
         </div>

        <ServiceRegistrationForm />
      </div>
    </div>
  );
}
