'use client';

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {TelegramUserInitData} from '@/types/telegram';
import {useRouter} from 'next/navigation';
import {PAGE_ROUTES} from '@/utils/routes';
import {ApiService} from "@/service/ApiService";
import {UserAuth} from "@/lib/auth/userAuth";
import {authWithTelegram} from "@/lib/auth/telegram/telegramAuth";
import {mockTelegramAuth} from "@/lib/auth/telegram/mockTelegramAuth";

// Интерфейс контекста аутентификации
interface AuthContextType {
  // Состояние
  isAuthenticated: boolean;
  user: UserAuth | null;
  isLoading: boolean;
  
  // Функции
  checkAuth: () => Promise<void>;
  loginViaTelegram: (telegramUserInitData: TelegramUserInitData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Создание контекста
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('`useAuth` must be used within an AuthProvider');
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
    setIsLoading(true);
    try {
      const user = await ApiService.getUserAuth();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.info('Ошибка аутентификации. Пользователь не зарегистрирован или не вошел в аккаунт', error);

      // В dev-режиме пробуем выполнить мок-авторизацию Telegram
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') {
        try {
          const authUser = await mockTelegramAuth();
          setUser(authUser);
          setIsAuthenticated(true);
        } catch (mockError) {
          console.info('Мок авторизация Telegram не выполнена', mockError);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Функция входа через Telegram
  const loginViaTelegram = async (telegramUserInitData: TelegramUserInitData) => {
    try {
      setIsLoading(true);
      const authUser = await authWithTelegram(telegramUserInitData);
      setUser(authUser);
      setIsAuthenticated(true);
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
  
  // Функция обновления данных пользователя (для переключения ролей)
  const refreshUser = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const user = await ApiService.getUserAuth();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
      // При ошибке не сбрасываем состояние, так как пользователь все еще аутентифицирован
    } finally {
      setIsLoading(false);
    }
  };
  
  // Проверка токена при загрузке
  useEffect(() => {
    checkAuth();
  }, []);
  
  const value: AuthContextType = {
    isAuthenticated, user, isLoading, checkAuth, loginViaTelegram, logout, refreshUser,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 