import { useRouter } from 'next/navigation';
import { TelegramAuthValidationError } from '../../_hooks/useTelegramAuthState';

interface TelegramAuthErrorProps {
  error: TelegramAuthValidationError | null;
}

export function TelegramAuthError({ error }: TelegramAuthErrorProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm mx-auto">
      <div className="text-center">
        <ErrorIcon />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-4 mb-2">
          Ошибка авторизации
        </h2>
        <p className="text-gray-600 mb-2 text-sm sm:text-base">{error?.message}</p>
        {error?.details && (
          <p className="text-gray-500 mb-6 text-xs sm:text-sm">{error.details}</p>
        )}
        
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            Попробовать снова
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm sm:text-base"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorIcon() {
  return (
    <div className="flex items-center justify-center">
      <div className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-red-100 flex items-center justify-center">
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </div>
  );
}
