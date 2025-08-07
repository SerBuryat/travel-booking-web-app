export function TelegramAuthLoading() {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 text-center">
      <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="text-gray-600 mt-4 text-sm sm:text-base">
        Загрузка данных авторизации...
      </p>
    </div>
  );
}
