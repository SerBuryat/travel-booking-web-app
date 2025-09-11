import {useRouter} from 'next/navigation';

export function TelegramAuthNoData() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm mx-auto">
      <div className="text-center">
        <div className="rounded-full h-10 w-10 sm:h-12 sm:h-12 bg-yellow-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Данные не найдены
        </h2>
        <p className="text-gray-600 mb-2 text-sm sm:text-base">
          Не удалось получить данные авторизации из Telegram
        </p>
        <p className="text-gray-500 mb-6 text-xs sm:text-sm">
          Данные авторизации отсутствуют или повреждены
        </p>
        
        <button 
          onClick={() => router.push('/')}
          className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm sm:text-base"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}
