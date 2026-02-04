import { redirect } from 'next/navigation';
import { getUserAuthOrThrow, UserAuth} from '@/lib/auth/getUserAuth';
import {getClientRequestsForProvider} from '@/lib/request/provider/clientRequestsForProvider';
import {getActiveProviderIdBYClientId} from '@/lib/provider/searchProvider';
import {ClientRequestsList} from './_components/ClientRequestsList';
import {PAGE_ROUTES} from "@/utils/routes";

/**
 * Страница просмотра заявок клиентов для провайдеров
 *
 * Требования:
 * - Только для пользователей с ролью 'provider'
 * - Отображает список заявок, подходящих для текущего провайдера
 * - Заявки получаются через систему алертов (talerts)
 */
export default async function ProviderRequestsPage() {
  // Проверяем аутентификацию и роль пользователя
  let userAuth: UserAuth;
  try {
    userAuth = await getUserAuthOrThrow();
  } catch (error) {
    redirect(PAGE_ROUTES.WEB_AUTH);
  }

  // Проверяем, что пользователь - провайдер
  if (userAuth.role !== 'provider') {
    redirect(PAGE_ROUTES.PROFILE);
  }

  // Получаем заявки для провайдера
  const provider = await getActiveProviderIdBYClientId(userAuth.userId);
  const providerId = provider?.id ?? null;
  const requests = await getClientRequestsForProvider();

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <div className="container mx-auto px-3 py-3">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">
          Заявки от туристов
        </h1>
      </div>

      <ClientRequestsList providerId={providerId} requests={requests || []} />
      </div>
    </div>
  );
}
