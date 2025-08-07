import React from 'react';
import { getServerUser } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  // Получаем данные пользователя на сервере
  const user = await getServerUser();

  // Если пользователь не авторизован, перенаправляем
  if (!user) {
    redirect('/telegram-auth');
  }

  // Передаем данные в клиентский компонент
  return <ProfileClient user={user} />;
} 