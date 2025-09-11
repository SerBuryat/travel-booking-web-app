import React from 'react';
import {redirect} from 'next/navigation';
import {ClientService} from '@/service/ClientService';
import ProfileHeader from "@/app/profile/_components/ProfileHeader";
import ProfileMenu from "@/app/profile/_components/ProfileMenu";
import {PAGE_ROUTES} from '@/utils/routes';
import {getUserAuth} from "@/lib/auth/user-auth";
import {ClientWithAuthType} from "@/model/ClientType";

export default async function ProfilePage() {

  const user = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.TELEGRAM_AUTH);
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <ProfileHeader user={user} />
        <div className="max-w-md mx-auto pt-6 px-4">
          <ProfileMenu/>
        </div>
      </div>
  );
} 

// todo - такой логики на страницах быть не должно
async function getUser(): Promise<ClientWithAuthType | null> {
  try {
    const userAuth = await getUserAuth();
    const clientService = new ClientService();
    return await clientService.getByIdWithAuth(userAuth.userId);
  } catch (error) {
    return null;
  }
}