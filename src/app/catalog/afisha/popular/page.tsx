import React from 'react';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Header';
import { SearchBarWrapper } from '@/components/SearchBarWrapper';
import { AfishaShortViewServiceComponent } from '@/components/AfishaShortViewServiceComponent';
import { getAfishaServices } from '@/lib/service/searchAfisha';
import { currentLocation } from '@/lib/location/currentLocation';
import { PAGE_ROUTES } from '@/utils/routes';

export default async function AfishaPopularPage() {
  try {
    // Получаем текущую локацию
    const location = await currentLocation();
    
    // Если локация не найдена, редиректим на страницу ошибки
    if (!location) {
      redirect(PAGE_ROUTES.ERROR || '/error');
    }

    // Загружаем все сервисы афиши (большое значение take для получения всех)
    const services = await getAfishaServices(1000);

    return (
      <div className="min-h-screen bg-white pb-10">
        <div className="max-w-md mx-auto">
          {/* Header с поисковой строкой */}
          <Header>
            <SearchBarWrapper />
          </Header>

          {/* Заголовок */}
          <div className="px-4 py-4">
            <h1 
              className="text-lg font-semibold text-gray-800"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Популярное из афиши в {location.name}
            </h1>
          </div>

          {/* Список сервисов афиши */}
          {services.length === 0 ? (
            <div className="px-4 py-4">
              <div className="py-8 text-center">
                <p
                  className="text-[#707579]"
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Скоро добавим интересные события для вашей локации
                </p>
              </div>
            </div>
          ) : (
            <div className="px-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                {services.map((service) => (
                  <AfishaShortViewServiceComponent
                    key={service.id}
                    service={service}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Ошибка при загрузке сервисов афиши:', error);
    redirect(PAGE_ROUTES.ERROR || '/error');
  }
}

