interface TelegramAuthLoginButtonProps {
  onLogin: () => void;
  isLoading?: boolean;
}

export function TelegramAuthLoginButton({ onLogin, isLoading = false }: TelegramAuthLoginButtonProps) {
  return (
    <button 
      onClick={onLogin}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-center justify-center">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
            <span>Вход в приложение...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Перейти в приложение
          </>
        )}
      </div>
    </button>
  );
}
