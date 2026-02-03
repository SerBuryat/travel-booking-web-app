import {TelegramAuthState, TelegramAuthValidationError} from '../_hooks/useTelegramAuthState';
import {TelegramUserInitData} from '@/types/telegram';
import {TelegramAuthLoading} from './states/TelegramAuthLoading';
import {TelegramAuthValidating} from './states/TelegramAuthValidating';
import {TelegramAuthLoggingIn} from './states/TelegramAuthLoggingIn';
import {TelegramAuthSuccess} from './states/TelegramAuthSuccess';
import {TelegramAuthError} from './states/TelegramAuthError';
import {TelegramAuthNoData} from './states/TelegramAuthNoData';
import {TelegramAuthAlreadyAuthenticated} from './states/TelegramAuthAlreadyAuthenticated';

interface TelegramAuthContentProps {
  state: TelegramAuthState;
  userData: TelegramUserInitData;
  error: TelegramAuthValidationError | null;
  onLogin: () => void;
}

export function TelegramAuthContent({ state, userData, error, onLogin }: TelegramAuthContentProps) {
  switch (state) {
    case TelegramAuthState.LOADING:
      return <TelegramAuthLoading />;
    case TelegramAuthState.VALIDATING:
      return <TelegramAuthValidating />;
    case TelegramAuthState.LOGGING_IN:
      return <TelegramAuthLoggingIn />;
    case TelegramAuthState.SUCCESS:
      return <TelegramAuthSuccess userData={userData} onLogin={onLogin} />;
    case TelegramAuthState.ERROR:
      return <TelegramAuthError error={error} />;
    case TelegramAuthState.NO_DATA:
      return <TelegramAuthNoData />;
    case TelegramAuthState.ALREADY_AUTHENTICATED:
      return <TelegramAuthAlreadyAuthenticated />;
    default:
      return <TelegramAuthLoading />;
  }
}
