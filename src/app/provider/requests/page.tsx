import { redirect } from 'next/navigation';
import { getUserAuthOrThrow } from '@/lib/auth/getUserAuth';
import { getClientRequestsForProvider } from '@/lib/request/provider/clientRequestsForProvider';
import { getActiveProviderId } from '@/lib/provider/searchProvider';
import { ClientRequestsList } from './_components/ClientRequestsList';

/**
 * Страница просмотра заявок клиентов для провайдеров
 * 
 * Требования:
 * - Только для пользователей с ролью 'provider'
 * - Отображает список заявок, подходящих для текущего провайдера
 * - Заявки получаются через систему алертов (talerts)
 */
export default async function ProviderRequestsPage() {
  // todo - переделать логику редиректов
  // Проверяем аутентификацию и роль пользователя
  let userAuth;
  try {
    userAuth = await getUserAuthOrThrow();
  } catch (error) {
    // todo - PAGE_ROUTES
    redirect('/login');
  }

  // Проверяем, что пользователь - провайдер
  if (userAuth.role !== 'provider') {
    // todo - PAGE_ROUTES
    redirect('/profile');
  }

  // Получаем заявки для провайдера
  const provider = await getActiveProviderId(userAuth.userId);
  const providerId = provider?.id ?? null;
  const requests = await getClientRequestsForProvider();

  return (
    <div className="container mx-auto px-3 py-3 bg-white">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">
          Заявки от туристов
        </h1>
      </div>

      <ClientRequestsList providerId={providerId} requests={requests || []} />
    </div>
  );
}
