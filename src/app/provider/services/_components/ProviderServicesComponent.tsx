import { ServiceType } from '@/model/ServiceType';

interface ProviderServicesComponentProps {
  providerId?: number;
  services: ServiceType[];
}

export default function ProviderServicesComponent({ providerId, services }: ProviderServicesComponentProps) {
  if (!providerId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              ID провайдера не найден
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Не удалось определить ID провайдера. Обратитесь к администратору.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              У вас пока нет сервисов
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Создайте свой первый сервис, чтобы начать работу
            </p>
            <div className="mt-6">
              <a
                href="/services/registration"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Создать сервис
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{services.length}</div>
            <div className="text-sm text-gray-500">Всего сервисов</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {services.filter(s => s.status === 'published').length}
            </div>
            <div className="text-sm text-gray-500">Опубликовано</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {services.filter(s => s.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-500">Черновики</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {services.reduce((sum, s) => sum + (s.view_count || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Просмотры</div>
          </div>
        </div>
      </div>

      {/* Список сервисов */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Мои сервисы</h3>
            <a
              href="/services/registration"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Добавить сервис
            </a>
          </div>
          
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                      <span>Категория: {service.category?.name || 'Не указана'}</span>
                      <span>Цена: {service.price} ₽</span>
                      {service.rating && (
                        <span className="flex items-center">
                          ⭐ {service.rating}
                        </span>
                      )}
                      {service.view_count && (
                        <span>👁 {service.view_count}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      service.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {service.status === 'published' ? 'Опубликован' : 'Черновик'}
                    </span>
                    <a
                      href={`/services/${service.id}`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Просмотр
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
