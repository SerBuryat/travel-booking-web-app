import React from 'react';
import Link from 'next/link';
import ProfileHeader from '@/app/profile/_components/ProfileHeader';
import OrdersList from '@/app/profile/orders/_components/OrdersList';
import {getMyClicks} from '@/lib/service/clickService';
import {getUserAuthOrThrow} from "@/lib/auth/getUserAuth";
import {redirect} from "next/navigation";
import {PAGE_ROUTES} from "@/utils/routes";
import {ClientService} from "@/service/ClientService";
import {ClientWithAuthType} from "@/model/ClientType";

export default async function ProfileOrdersPage() {
  const user = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.WEB_AUTH);
  }

  // Получаем клики текущего пользователя через server action
  const clicks = await getMyClicks();
  const orders = clicks.map((c) => ({
    id: c.id,
    serviceId: c.serviceId,
    name: c.serviceName,
    respondedAt: c.timestamp,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader user={user} />
      <div className="max-w-md mx-auto pt-6 px-4">
        <h1 className="text-[16px] font-semibold text-gray-900 mb-4">Мои заказы</h1>
        <OrdersList orders={orders} />
        <div className="mt-6 flex flex-col items-center space-y-2">
          <Link href={PAGE_ROUTES.IN_PROGRESS}
                className="text-[#707579] text-[13px] font-normal hover:underline text-center">
            Оставить отзыв
          </Link>
          <Link href={PAGE_ROUTES.IN_PROGRESS}
                className="text-[#707579] text-[13px] font-normal hover:underline text-center">
            Пригласить друга
          </Link>
        </div>
      </div>
    </div>
  );
}

// todo - такой логики на страницах быть не должно
async function getUser(): Promise<ClientWithAuthType | null> {
  try {
    const userAuth = await getUserAuthOrThrow();
    const clientService = new ClientService();
    return await clientService.getByIdWithAuth(userAuth.userId);
  } catch (error) {
    return null;
  }
}


