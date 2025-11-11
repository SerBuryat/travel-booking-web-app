import React from 'react';

const getBotLink = () => {
  const botName = process.env.BOT_NAME ?? '';
  if (!botName) {
    return null;
  }

  return `https://t.me/${botName}`;
};

const getApplicationName = () => {
  return process.env.APPLICATION_NAME ?? 'TravelHub';
};

export default function NoAuthPage() {
  const botLink = getBotLink();
  const appName = getApplicationName();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        <header className="text-center space-y-3">
          <div className="text-5xl">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Требуется авторизация
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Сейчас {appName} доступен только через Telegram бота. Войти можно только через мини-приложение Telegram — 
            без регистрации и ввода данных. <strong>Позже</strong> будет доступен вход по телефону или почте.
          </p>
        </header>

        {botLink ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white p-5 text-center">
              <a
                href={botLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-white text-blue-600 hover:bg-blue-50 transition-colors rounded-lg font-semibold text-base shadow-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Открыть бота в Telegram
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3.5">
              <p className="text-xs text-amber-900 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                <strong>Если вас перенаправило сюда из приложения:</strong> вам нужно заново пройти авторизацию через 
                Telegram бота. Если проблемы сохраняются, напишите в поддержку.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            Имя Telegram-бота не настроено. Добавьте переменную окружения <code className="font-mono text-yellow-900">BOT_NAME</code>, чтобы показать ссылку.
          </div>
        )}
      </div>
    </div>
  );
}

