import {redirect} from 'next/navigation';
import {ServiceService} from '@/service/ServiceService';
import ProviderServicesComponent from './_components/ProviderServicesComponent';
import {PAGE_ROUTES} from "@/utils/routes";
import {getUserAuth} from "@/lib/auth/user-auth";

export default async function ProviderServicesPage() {

  let userAuth;
  try {
    userAuth = await getUserAuth();
    if (userAuth.role !== 'provider' || !userAuth.providerId) {
      redirect(PAGE_ROUTES.HOME);
    }
  } catch (error) {
    redirect(PAGE_ROUTES.TELEGRAM_AUTH);
  }

  // Предзагружаем сервисы провайдера на сервере
  const serviceService = new ServiceService();
  const services = await serviceService.getAllServicesByProviderId(userAuth.providerId);

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Мои сервисы
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Управляйте своими сервисами и отслеживайте их эффективность
            </p>
          </div>

          <ProviderServicesComponent
              providerId={userAuth.providerId}
              services={services}
          />
        </div>
      </div>
  );
}
