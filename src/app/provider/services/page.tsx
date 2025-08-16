import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/server-auth';
import { ServiceService } from '@/service/ServiceService';
import ProviderServicesComponent from './_components/ProviderServicesComponent';

export default async function ProviderServicesPage() {
  try {
    // Получаем данные пользователя с валидацией токена
    const user = await getServerUser();
    
    // Проверяем роль пользователя
    const auth = user.tclients_auth.find(auth => auth.is_active);
    if (!auth || auth.role !== 'provider' || !user.providerId) {
      redirect('/home');
    }

    // Предзагружаем сервисы провайдера на сервере
    const serviceService = new ServiceService();
    const services = await serviceService.getAllServicesByProviderId(user.providerId);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Мои сервисы
            </h1>
            <p className="mt-2 text-gray-600">
              Управляйте своими сервисами и отслеживайте их эффективность
            </p>
          </div>
          
          <ProviderServicesComponent 
            providerId={user.providerId} 
            services={services}
          />
        </div>
      </div>
    );
  } catch (error) {
    // Если произошла ошибка валидации, редиректим на главную
    console.error('Provider services page error:', error);
    redirect('/home');
  }
}
