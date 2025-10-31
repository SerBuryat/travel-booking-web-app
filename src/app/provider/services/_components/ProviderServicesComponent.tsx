import {ServiceType} from '@/model/ServiceType';
import {PAGE_ROUTES} from "@/utils/routes";

interface ProviderServicesComponentProps {
  providerId?: number;
  services: ServiceType[];
}

export default function ProviderServicesComponent({ providerId, services }: ProviderServicesComponentProps) {
  if (!providerId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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
            <div className="mt-1 text-sm text-yellow-700">
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
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-3 text-sm font-medium text-gray-900">
              У вас пока нет сервисов
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Создайте свой первый сервис, чтобы начать работу
            </p>
            <div className="mt-5">
              <a
                href={PAGE_ROUTES.PROVIDER.CREATE_SERVICE}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
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
    <div className="space-y-3 sm:space-y-4">
      {/* Статистика */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 sm:p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-indigo-600">{services.length}</div>
            <div className="text-xs text-gray-500">Всего</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-green-600">
              {services.filter(s => s.status === 'published').length}
            </div>
            <div className="text-xs text-gray-500">Опубликовано</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-yellow-600">
              {services.filter(s => s.status === 'draft').length}
            </div>
            <div className="text-xs text-gray-500">Черновики</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-blue-600">
              {services.reduce((sum, s) => sum + (s.view_count || 0), 0)}
            </div>
            <div className="text-xs text-gray-500">Просмотры</div>
          </div>
        </div>
      </div>

      {/* Список сервисов */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Мои сервисы</h3>
            <a
              href="/services/registration"
              className="inline-flex items-center px-2 sm:px-3 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Добавить сервис
            </a>
          </div>
        </div>
        
        <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
          {services.map((service) => (
            <a
              key={service.id}
              href={`/services/${service.id}`}
              className="block group"
            >
              <div className="bg-white border border-gray-200 rounded-[20px] sm:rounded-[30px] overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
                <div className="flex flex-col sm:flex-row">
                  {/* Фото сервиса (полная ширина на мобильных, 2/5 на десктопе) */}
                  <div className="w-full sm:w-2/5 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center min-h-[120px] sm:min-h-[200px]">
                    <div className="text-center text-white">
                      <svg className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs sm:text-sm opacity-90">Фото сервиса</p>
                    </div>
                  </div>
                  
                  {/* Описание сервиса (полная ширина на мобильных, 3/5 на десктопе) */}
                  <div className="w-full sm:w-3/5 p-3 sm:p-6 flex flex-col justify-between">
                    <div>
                      {/* Заголовок и статус */}
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <h4 className="text-base sm:text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors pr-2">
                          {service.name}
                        </h4>
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          service.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {service.status === 'published' ? 'Опубликован' : 'Черновик'}
                        </span>
                      </div>
                      
                      {/* Адрес */}
                      <div className="flex items-center text-gray-600 mb-2 sm:mb-3">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs sm:text-sm">Адрес сервиса</span>
                      </div>
                      
                      {/* Описание */}
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      
                      {/* Теги-опции */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-[15px] sm:rounded-[30px]">
                          WiFi
                        </span>
                        <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-[15px] sm:rounded-[30px]">
                          Парковка
                        </span>
                        <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-[15px] sm:rounded-[30px]">
                          Кондиционер
                        </span>
                      </div>
                    </div>
                    
                    {/* Рейтинг и цена */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {service.rating ? (
                          <>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                    i < Math.floor(service.rating!) 
                                      ? 'text-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600">{service.rating}</span>
                          </>
                        ) : (
                          <span className="text-xs sm:text-sm text-gray-400">Нет оценок</span>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg sm:text-2xl font-bold text-indigo-600">
                          {service.price} ₽
                        </div>
                        <div className="text-xs text-gray-500">за услугу</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
