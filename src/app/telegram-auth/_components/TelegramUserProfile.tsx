import { TelegramUser } from '@/types/telegram';

interface TelegramUserProfileProps {
  userData: TelegramUser;
}

export function TelegramUserProfile({ userData }: TelegramUserProfileProps) {
  return (
    <div className="text-center">
      {/* User Avatar */}
      <div className="mb-4 sm:mb-6">
        {userData.photo_url ? (
          <img
            src={userData.photo_url} 
            alt="Profile" 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto border-4 border-blue-100 shadow-lg"
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
            {userData.first_name?.[0] || 'U'}
          </div>
        )}
      </div>

      {/* User Info */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
        {userData.first_name} {userData.last_name}
      </h2>
      
      {userData.username && (
        <p className="text-gray-600 mb-4 text-sm sm:text-base">@{userData.username}</p>
      )}
    </div>
  );
}
