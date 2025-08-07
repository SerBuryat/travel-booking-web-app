import React from 'react';
import { getServerUser } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import ProfileClient from '@/app/profile/ProfileClient';
import { ClientService } from '@/service/ClientService';

export default async function ProfilePage() {
  // Получаем данные пользователя на сервере
  const user = await getServerUser();

  // Если пользователь не авторизован, перенаправляем
  if (!user) {
    redirect('/telegram-auth');
  }

  // Получаем полные данные пользователя из базы
  const clientService = new ClientService();
  const fullUserData = await clientService.getByIdWithAuth(user.id);

  if (!fullUserData) {
    redirect('/telegram-auth');
  }

  // Передаем полные данные в клиентский компонент
  return <ProfileClient user={fullUserData} />;
} 