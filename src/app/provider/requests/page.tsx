import { redirect } from 'next/navigation';
import { getUserAuthOrThrow } from '@/lib/auth/userAuth';
import { getClientRequestsForProvider } from '@/lib/request/provider/clientRequestsForProvider';
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
    redirect('/login');
  }

  // Проверяем, что пользователь - провайдер
  if (userAuth.role !== 'provider') {
    redirect('/profile');
  }

  // Получаем заявки для провайдера
  const requests = await getClientRequestsForProvider();

  return (
    <div className="container mx-auto px-3 py-3">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">
          Заявки от туристов
        </h1>
        <p className="mt-0.5 text-xs text-gray-600">
          Заявки клиентов для ваших услуг
        </p>
      </div>

      <ClientRequestsList requests={requests || []} />
    </div>
  );
}
