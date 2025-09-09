import { TelegramUserData } from '@/types/telegram';
import { TelegramUserProfile } from '../TelegramUserProfile';
import { TelegramAuthLoginButton } from '../TelegramAuthLoginButton';

interface TelegramAuthSuccessProps {
  userData: TelegramUserData;
  onLogin: () => void
}

export function TelegramAuthSuccess({ userData, onLogin }: TelegramAuthSuccessProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm mx-auto">
      <div className="text-center">
        <TelegramUserProfile userData={userData} />

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-6">
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-800 font-medium text-sm sm:text-base">Данные проверены!</span>
          </div>
        </div>

        <TelegramAuthLoginButton onLogin={onLogin} />
      </div>
    </div>
  );
}
