import { AuthState, AuthError } from '../_hooks/useTelegramAuth';
import { TelegramUser } from '@/types/telegram';
import { TelegramAuthLoading } from './states/TelegramAuthLoading';
import { TelegramAuthValidating } from './states/TelegramAuthValidating';
import { TelegramAuthLoggingIn } from './states/TelegramAuthLoggingIn';
import { TelegramAuthSuccess } from './states/TelegramAuthSuccess';
import { TelegramAuthError } from './states/TelegramAuthError';
import { TelegramAuthNoData } from './states/TelegramAuthNoData';
import { TelegramAuthInvalidAccess } from './states/TelegramAuthInvalidAccess';
import { TelegramAuthAlreadyAuthenticated } from './states/TelegramAuthAlreadyAuthenticated';

interface TelegramAuthContentProps {
  state: AuthState;
  userData: TelegramUser;
  error: AuthError | null;
  onLogin: () => void;
}

export function TelegramAuthContent({ state, userData, error, onLogin }: TelegramAuthContentProps) {
  switch (state) {
    case 'loading':
      return <TelegramAuthLoading />;
    case 'validating':
      return <TelegramAuthValidating />;
    case 'logging-in':
      return <TelegramAuthLoggingIn />;
    case 'success':
      return <TelegramAuthSuccess userData={userData} onLogin={onLogin} />;
    case 'error':
      return <TelegramAuthError error={error} />;
    case 'no-data':
      return <TelegramAuthNoData />;
    case 'invalid-access':
      return <TelegramAuthInvalidAccess error={error} />;
    case 'already-authenticated':
      return <TelegramAuthAlreadyAuthenticated />;
    default:
      return <TelegramAuthLoading />;
  }
}
