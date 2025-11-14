import { redirect } from 'next/navigation';
import { getUserAuthOrThrow, UserAuth} from '@/lib/auth/getUserAuth';
import {requestById} from '@/lib/request/client/view/requestById';
import {getProviderServicesForRequest} from '@/lib/request/provider/proposal/getProviderServicesForRequest';
import {CreateProposalForm} from '@/app/provider/requests/[requestId]/proposal/_components/CreateProposalForm';
import {PAGE_ROUTES} from "@/utils/routes";
import { AnyRequestView } from '@/lib/request/client/view/types';

interface ProposalPageProps {
  params: {
    requestId: string;
  };
}

/**
 * Страница создания предложения провайдера на заявку клиента
 *
 * Требования:
 * - Только для пользователей с ролью 'provider'
 * - Отображает детали заявки клиента
 * - Показывает подходящие сервисы провайдера
 * - Форма для создания предложения
 */
export default async function ProposalPage({params}: ProposalPageProps) {
  const {requestId: requestIdString} = await params;
  const requestId = parseInt(requestIdString);

  if (isNaN(requestId)) {
    redirect(PAGE_ROUTES.ERROR);
  }

  // Проверяем аутентификацию и роль пользователя
  let userAuth: UserAuth;
  try {
    userAuth = await getUserAuthOrThrow();
  } catch (error) {
    redirect(PAGE_ROUTES.NO_AUTH);
  }

  // Проверяем, что пользователь - провайдер
  if (userAuth.role !== 'provider') {
    redirect(PAGE_ROUTES.PROFILE);
  }

  // Получаем детали заявки клиента
  let requestDetails: AnyRequestView;
  try {
    requestDetails = await requestById(requestId, userAuth);
  } catch (error) {
    redirect(PAGE_ROUTES.PROVIDER.REQUESTS);
  }

  // Проверяем статус заявки
  if (requestDetails.status !== 'open') {
    const statusMessages: Record<string, { title: string; reason: string }> = {
      closed: {
        title: 'Заявка закрыта',
        reason: 'К сожалению, на эту заявку нельзя откликнуться, так как она уже закрыта. Клиент, вероятно, уже выбрал провайдера или завершил поиск. Но мы уверены, что найдутся и другие заявки для Вас!',
      },
      cancelled: {
        title: 'Заявка отменена',
        reason: 'К сожалению, на эту заявку нельзя откликнуться, так как она была отменена клиентом. Но мы уверены, что найдутся и другие заявки для Вас!',
      },
    };
    const statusInfo = statusMessages[requestDetails.status] || {
      title: 'Заявка недоступна',
      reason: 'К сожалению, на эту заявку нельзя откликнуться по причине её текущего статуса. Но мы уверены, что найдутся и другие заявки для Вас!',
    };

    return (
      <div className="container mx-auto px-3 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Отклик на заявку {requestDetails.number || requestDetails.id}
          </h1>
        </div>

        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-yellow-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-yellow-800">
                {statusInfo.title}
              </h3>
              <p className="text-xs text-yellow-700 leading-relaxed">
                {statusInfo.reason}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <a
            href="/provider/requests"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Назад к заявкам
          </a>
        </div>
      </div>
    );
  }

  // Получаем подходящие сервисы провайдера
  const providerServicesData = await getProviderServicesForRequest(requestId);

  if (!providerServicesData || providerServicesData.services.length === 0) {
    return (
      <div className="container mx-auto px-3 py-3">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            Нет подходящих сервисов
          </div>
          <p className="text-gray-400 mt-2">
            У вас нет сервисов, подходящих для этой заявки
          </p>
          <a
            href="/provider/requests"
            className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Назад к заявкам
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Отклик на заявку {requestDetails.number || requestDetails.id}
        </h1>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <h2
            className="font-semibold"
            style={{ fontSize: 16, color: '#000000' }}
          >
            Объект
          </h2>
          <p
            style={{ fontSize: 15, fontWeight: 400, color: '#707579' }}
          >
            Выбрать из зарегистрированных объектов
          </p>
        </div>

        <CreateProposalForm 
          requestId={requestId}
          services={providerServicesData.services}
        />
      </div>
    </div>
  );
}
