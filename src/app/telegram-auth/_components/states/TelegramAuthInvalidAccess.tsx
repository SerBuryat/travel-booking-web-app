import { useRouter } from 'next/navigation';
import { AuthError } from '../../_hooks/useTelegramAuth';

interface TelegramAuthInvalidAccessProps {
  error: AuthError | null;
}

export function TelegramAuthInvalidAccess({ error }: TelegramAuthInvalidAccessProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm mx-auto">
      <div className="text-center">
        <div className="rounded-full h-10 w-10 sm:h-12 sm:h-12 bg-orange-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Неправильный доступ
        </h2>
        <p className="text-gray-600 mb-2 text-sm sm:text-base">{error?.message}</p>
        {error?.details && (
          <p className="text-gray-500 mb-6 text-xs sm:text-sm">{error.details}</p>
        )}
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-left">
              <p className="text-orange-800 font-medium text-xs sm:text-sm mb-1">Как правильно войти:</p>
              <ul className="text-orange-700 text-xs sm:text-sm space-y-1">
                <li>• Откройте приложение в Telegram</li>
                <li>• Используйте кнопку &#34;Открыть приложение&#34;</li>
                <li>• Не переходите по прямой ссылке</li>
              </ul>
            </div>
          </div>
        </div>
        
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
