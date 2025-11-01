import {redirect} from 'next/navigation';
import ProviderServicesComponent from './_components/ProviderServicesComponent';
import {PAGE_ROUTES} from "@/utils/routes";
import {getUserAuthOrThrow, UserAuth} from "@/lib/auth/userAuth";
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

  // Проверяем роль и права доступа после успешной аутентификации
  if (userAuth.role !== 'provider' || !userAuth.providerId) {
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
