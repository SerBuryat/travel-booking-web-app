'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TelegramUserData } from '@/types/telegram';
import { useRouter } from 'next/navigation';
import { UserAuth } from '@/app/api/auth/me/route';
import { PAGE_ROUTES } from '@/utils/routes';

// Интерфейс контекста аутентификации
interface AuthContextType {
  // Состояние
  isAuthenticated: boolean;
  user: UserAuth | null;
  isLoading: boolean;
  
  // Функции
  checkAuth: () => Promise<void>;
  loginWithTelegram: (telegramData: TelegramUserData) => Promise<void>;
  logout: () => Promise<void>;
}

// Создание контекста
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Провайдер компонент
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  // Состояние
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserAuth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Функция проверки аутентификации
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const userAuth = await response.json() as UserAuth;
        setUser(userAuth);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Ошибка проверки аутентификации:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Функция входа через Telegram
  const loginWithTelegram = async (telegramData: TelegramUserData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramUser: telegramData }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          setUser(result.user);
          setIsAuthenticated(true);
        } else {
          throw new Error(result.error || 'Ошибка входа через Telegram');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка входа через Telegram');
      }
    } catch (error) {
      console.error('Ошибка входа через Telegram:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Функция выхода
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Ошибка выхода:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push(PAGE_ROUTES.TELEGRAM_AUTH);
    }
  };
  
  // Проверка токена при загрузке
  useEffect(() => {
    checkAuth();
  }, []);
  
  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    checkAuth,
    loginWithTelegram,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 