import {TelegramAuthState} from "@/app/login/telegram/_hooks/useTelegramAuthState";

interface ProgressStep {
  title: string;
  icon: string;
}

const STEPS: ProgressStep[] = [
  { title: 'Загрузка', icon: '📱' },
  { title: 'Проверка', icon: '🔐' },
  { title: 'Вход', icon: '🚀' },
  { title: 'Готово', icon: '✅' }
];

function getCurrentStepByAuthState(authState: TelegramAuthState): number {
  switch (authState) {
    case TelegramAuthState.LOADING: return 0;
    case TelegramAuthState.VALIDATING: return 1;
    case TelegramAuthState.SUCCESS: return 2;
    case TelegramAuthState.LOGGING_IN: return 2;
    case TelegramAuthState.ERROR: return 1;
    case TelegramAuthState.NO_DATA: return 0;
    case TelegramAuthState.INVALID_ACCESS: return 0;
    case TelegramAuthState.ALREADY_AUTHENTICATED: return 3;
    default: return 0;
  }
}

interface TelegramAuthProgressProps {
  telegramAuthState: TelegramAuthState;
}

export function TelegramAuthProgress({ telegramAuthState }: TelegramAuthProgressProps) {
  const currentStep = getCurrentStepByAuthState(telegramAuthState);
  return (
    <div className="flex justify-center mb-6 px-4">
      <div className="flex items-center space-x-4">
        {STEPS.map((step, index) => (
          <ProgressStepItem 
            key={index}
            step={step}
            isActive={index === currentStep}
            isCompleted={index < currentStep}
            isLast={index === STEPS.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function ProgressStepItem({ 
  step, 
  isActive, 
  isCompleted, 
  isLast 
}: {
  step: ProgressStep;
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
        isCompleted 
          ? 'bg-green-500 border-green-500 text-white' 
          : isActive 
          ? 'bg-blue-500 border-blue-500 text-white animate-pulse' 
          : 'bg-gray-200 border-gray-300 text-gray-500'
      }`}>
        <span className="text-xs sm:text-sm">{step.icon}</span>
      </div>
      <span className={`mt-1 text-xs sm:text-sm font-medium text-center ${
        isCompleted || isActive ? 'text-gray-800' : 'text-gray-400'
      }`}>
        {step.title}
      </span>
      {!isLast && (
        <div className={`hidden sm:block w-6 h-0.5 mx-2 ${
          isCompleted ? 'bg-green-500' : 'bg-gray-300'
        }`} />
      )}
    </div>
  );
}
