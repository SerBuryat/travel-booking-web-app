'use client';

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {PAGE_ROUTES} from '@/utils/routes';
import {getUserAuthOrThrow, UserAuth} from "@/lib/auth/getUserAuth";
import {userLogin} from "@/lib/auth/userLogin";
import type { UserAuthRequest } from "@/lib/auth/types";
import {mockTelegramAuth} from "@/lib/auth/telegram/mockTelegramAuth";
import {currentLocation, CurrentLocationType} from "@/lib/location/currentLocation";
import {userLogout} from "@/lib/auth/userLogout";

// Интерфейс контекста аутентификации
interface AuthContextType {
  // Состояние
  isAuthenticated: boolean;
  user: UserAuth | null;
  isLoading: boolean;

  // Локация
  location: CurrentLocationType;
  
  // Функции
  checkAuth: () => Promise<void>;
  login: (userAuthRequest: UserAuthRequest) => Promise<void>;
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
  const [location, setLocation]  = useState<CurrentLocationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Функция проверки аутентификации
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const user = await getUserAuthOrThrow();
      const location = await currentLocation();
      setLocation(location);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.info('Ошибка аутентификации. Пользователь не зарегистрирован или не вошел в аккаунт', error);

      // todo - mock auth, для лоакльного запуска через браузер
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') {
        try {
          const authUser = await mockTelegramAuth();
          setUser(authUser);
          const location = await currentLocation();
          setLocation(location);
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
  
  // Универсальная функция входа (Telegram, VK ID и т.д.)
  const login = async (userAuthRequest: UserAuthRequest) => {
    try {
      setIsLoading(true);

      const authUser = await userLogin(userAuthRequest);
      setUser(authUser);

      const location = await currentLocation();
      setLocation(location);

      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Функция выхода
  const logout = async () => {
    try {
      await userLogout();
    } catch (error) {
      console.error('Ошибка выхода:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push(PAGE_ROUTES.NO_AUTH);
    }
  };
  
  // Функция обновления данных пользователя (например, для переключения ролей)
  const refreshUser = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const user = await getUserAuthOrThrow();
      setUser(user);
      const location = await currentLocation();
      setLocation(location);
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
    isAuthenticated, user, isLoading, location,
    checkAuth, login, logout, refreshUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 