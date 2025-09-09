export function TelegramAuthAlreadyAuthenticated() {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm mx-auto">
      <div className="text-center">
        <div className="rounded-full h-10 w-10 sm:h-12 bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Вы уже авторизованы
        </h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Перенаправляем вас в профиль...
        </p>
        
        <div className="animate-pulse">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
            <span className="text-green-600 text-sm">Перенаправление...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
