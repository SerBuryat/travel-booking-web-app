import {redirect} from 'next/navigation';
import ProviderServicesComponent from './_components/ProviderServicesComponent';
import {PAGE_ROUTES} from "@/utils/routes";
import {getUserAuthOrThrow, UserAuth} from "@/lib/auth/getUserAuth";
import {servicesForProvider} from "@/lib/service/searchServices";

export default async function ProviderServicesPage() {

  let userAuth: UserAuth;
  try {
    userAuth = await getUserAuthOrThrow();
    console.log('userAuth', userAuth);
  } catch (error) {
    console.log('Error in ProviderServicesPage - server side', error);
    redirect(PAGE_ROUTES.TELEGRAM_AUTH);
  }

  if (userAuth.role !== 'provider' || !userAuth.providerId) {
    console.log(
        '[ProviderServicesPage] Невозможно отобразить сервисы провайдера для пользователя. ' +
        'Отстутствует роль или `providerId`', userAuth
    )
    redirect(PAGE_ROUTES.HOME);
  }

  const services = await servicesForProvider(userAuth.providerId);

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Мои объекты
            </h1>
          </div>

          <ProviderServicesComponent services={services}/>
        </div>
      </div>
  );
}
