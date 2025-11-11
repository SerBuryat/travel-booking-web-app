import { redirect } from 'next/navigation';
import { getUserAuthOrThrow } from '@/lib/auth/getUserAuth';
import { requestById } from '@/lib/request/client/view/requestById';
import { getProviderServicesForRequest } from '@/lib/request/provider/proposal/getProviderServicesForRequest';
import { CreateProposalForm } from '@/app/provider/requests/[requestId]/proposal/_components/CreateProposalForm';

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
export default async function ProposalPage({ params }: ProposalPageProps) {
  const { requestId: requestIdString } = await params;
  const requestId = parseInt(requestIdString);

  // todo - разобраться с редиректами
  if (isNaN(requestId)) {
    redirect('/error');
  }

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

  // Получаем детали заявки клиента
  let requestDetails;
  try {
    requestDetails = await requestById(requestId, userAuth);
  } catch (error) {
    redirect('/provider/requests');
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
