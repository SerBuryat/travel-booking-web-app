import React from 'react';
import { getServerUser } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import { ClientService } from '@/service/ClientService';
import ProfileHeader from "@/app/profile/_components/ProfileHeader";
import ProfileMenu from "@/app/profile/_components/ProfileMenu";

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

  // Если пользователь не найден, перенаправляем
  if (!fullUserData) {
    redirect('/telegram-auth');
  }

  // Передаем полные данные в клиентский компонент
  return (
      <div className="min-h-screen bg-gray-50">
        <ProfileHeader user={fullUserData} />
        <div className="max-w-md mx-auto pt-6 px-4">
          <ProfileMenu/>
        </div>
      </div>
  );
} 