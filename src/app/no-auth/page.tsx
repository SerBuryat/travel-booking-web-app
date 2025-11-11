import React from 'react';
import Link from 'next/link';
import { PAGE_ROUTES } from '@/utils/routes';

const steps = [
  {
    title: 'Откройте Telegram',
    description: 'Перейдите в приложение Telegram на телефоне или компьютере. Мы работаем внутри Telegram Mini Apps.',
  },
  {
    title: 'Найдите нашего бота',
    description: 'В строке поиска введите имя бота и откройте его. Там уже ждёт кнопка запуска мини-приложения.',
  },
  {
    title: 'Запустите TravelHub',
    description: 'Нажмите «Открыть приложение» — и вы окажетесь в знакомом интерфейсе, уже с авторизацией.',
  },
];

const getBotLink = () => {
  const botName = process.env.BOT_NAME ?? '';
  if (!botName) {
    return null;
  }

  return `https://t.me/${botName}`;
};

export default function NoAuthPage() {
  const botLink = getBotLink();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl shadow-xl p-8 md:p-10 space-y-8">
        <header className="text-center space-y-4">
          <div className="text-6xl">👋</div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            TravelHub живёт в Telegram
          </h1>
          <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Похоже, вы открыли TravelHub вне Telegram. Чтобы продолжить, запустите нас через мини-приложение Telegram —
            там автоматически создаётся безопасное подключение и выдаётся доступ к вашему аккаунту.
          </p>
        </header>

        <section className="bg-white border border-indigo-100 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Как открыть TravelHub правильно
          </h2>

          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {botLink ? (
            <div className="rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white p-5 text-center space-y-3">
              <p className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Готовы перейти?
              </p>
              <a
                href={botLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 transition-colors rounded-lg font-semibold"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Открыть бота в Telegram
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          ) : (
            <div className="rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Имя Telegram-бота не настроено. Добавьте переменную окружения <code className="font-mono text-yellow-900">BOT_NAME</code>, чтобы показать ссылку.
            </div>
          )}
        </section>

        <footer className="flex flex-wrap justify-center gap-3 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          <Link
            href={PAGE_ROUTES.TELEGRAM_AUTH}
            className="inline-flex items-center px-5 py-2.5 bg-white text-blue-600 border border-blue-200 rounded-lg hover:border-blue-300 hover:text-blue-700 transition-colors font-medium shadow-sm"
          >
            Уже в Telegram? Авторизуйтесь
          </Link>
          <Link
            href={PAGE_ROUTES.HOME}
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            На главную
          </Link>
        </footer>
      </div>
    </div>
  );
}

