import React from 'react';
import Link from 'next/link';
import ProfileHeader from '@/app/profile/_components/ProfileHeader';
import OrdersList from '@/app/profile/orders/_components/OrdersList';
import {getServerUser} from "@/lib/server-auth";

export default async function ProfileOrdersPage() {
  // Получаем данные пользователя на сервере
  const user = await getServerUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader user={user} />
      <div className="max-w-md mx-auto pt-6 px-4">
        <h1 className="text-[16px] font-semibold text-gray-900 mb-4">Мои заказы</h1>
        <OrdersList />
        <div className="mt-6 flex flex-col items-center space-y-2">
          <Link href="/profile/reviews" className="text-[#707579] text-[13px] font-normal hover:underline text-center">
            Оставить отзыв
          </Link>
          <Link href="/profile/invite" className="text-[#707579] text-[13px] font-normal hover:underline text-center">
            Пригласить друга
          </Link>
        </div>
      </div>
    </div>
  );
}


