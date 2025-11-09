import React from 'react';
import Link from 'next/link';
import { PAGE_ROUTES } from '@/utils/routes';

const features = [
  {
    title: 'Пригласить друга',
    description: 'Скоро вы сможете делиться TravelHub с друзьями и получать бонусы вместе.',
  },
  {
    title: 'Оставить отзывы',
    description: 'Мы готовим удобный способ делиться впечатлениями о поездках и сервисах.',
  },
  {
    title: 'Поддержка',
    description: 'Ведем переписку с командами, чтобы поддержка отвечала быстро и по делу.',
  },
  {
    title: 'FAQ',
    description: 'Собираем самые частые вопросы и подсказки, чтобы вам не приходилось гадать.',
  },
];

export default function InProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white/70 backdrop-blur-sm border border-white/60 rounded-3xl shadow-xl p-8 text-center space-y-8">
        <div className="text-6xl">🚧</div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Мы почти готовы!
          </h1>
          <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Команда TravelHub как раз доводит этот раздел до совершенства. Совсем скоро вы сможете пригласить друзей, оставлять отзывы,
            получать поддержку и находить ответы на частые вопросы прямо здесь.
          </p>
        </div>

        <div className="bg-white/80 border border-indigo-100 rounded-2xl p-6 text-left space-y-4">
          <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Что уже в работе:
          </h2>
          <ul className="space-y-3 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {features.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3">
                <span className="mt-1 text-indigo-500">•</span>
                <div>
                  <p className="font-medium text-gray-800">{feature.title}</p>
                  <p>{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={PAGE_ROUTES.PROFILE}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Вернуться в профиль
          </Link>
          <Link
            href={PAGE_ROUTES.HOME}
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg hover:border-blue-300 hover:text-blue-700 transition-colors font-medium shadow-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

