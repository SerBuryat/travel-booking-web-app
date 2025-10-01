import React from 'react';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PAGE_ROUTES} from '@/utils/routes';
import {getUserAuthOrThrow} from "@/lib/auth/userAuth";
import {ClientService} from "@/service/ClientService";
import {ClientWithAuthType} from "@/model/ClientType";
import { showMyRequests } from "@/lib/view/showMyRequests";
import { MyRequestView } from "@/lib/view/types";
import MyRequestsList from "./_components/MyRequestsList";

export default async function RequestsPage() {
  const user = await getUser();
  if(!user) {
    redirect(PAGE_ROUTES.TELEGRAM_AUTH);
  }
  const requests: MyRequestView[] = await showMyRequests(user.id);

  return (
    <div className="max-w-4xl mx-auto pt-2 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Мои запросы</h1>
      {requests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">У вас нет созданных заявок</p>
          <p className="text-sm text-gray-500 mt-2">
            Пользователь: {user.name} (ID: {user.id})
          </p>
        </div>
      ) : (
        <MyRequestsList items={requests} />
      )}

      {/* Sticky Create Request Button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 flex justify-center" style={{ zIndex: 60 }}>
        <Link
          href="/requests/create"
          className="text-black"
          style={{
            backgroundColor: '#95E59D',
            borderRadius: 30,
            fontSize: 17,
            fontWeight: 400,
            padding: '8px 16px',
            cursor: 'pointer',
            opacity: 1
          }}
        >
          Создать заявку
        </Link>
      </div>
    </div>
  );
}

async function getUser(): Promise<ClientWithAuthType | null> {
  try {
    const userAuth = await getUserAuthOrThrow();
    const clientService = new ClientService();
    return await clientService.getByIdWithAuth(userAuth.userId);
  } catch (error) {
    return null;
  }
}