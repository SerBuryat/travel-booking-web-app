import React from 'react';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Header';
import { SearchBarWrapper } from '@/components/SearchBarWrapper';
import { VerticalServicesViewComponent } from '@/components/VerticalServicesViewComponent';
import { popularServices } from '@/lib/service/searchServices';
import { currentLocation } from '@/lib/location/currentLocation';
import { PAGE_ROUTES } from '@/utils/routes';

export default async function PopularServicesPage() {
  try {
    // Получаем текущую локацию
    const location = await currentLocation();
    
    // Если локация не найдена, редиректим на страницу ошибки
    if (!location) {
      redirect(PAGE_ROUTES.ERROR || '/error');
    }

    // Загружаем 30 популярных сервисов
    const services = await popularServices({ take: 30 });

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
              Популярные сервисы в {location.name}
            </h1>
          </div>

          {/* Список популярных сервисов */}
          <div>
            <VerticalServicesViewComponent services={services} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Ошибка при загрузке популярных сервисов:', error);
    redirect(PAGE_ROUTES.ERROR || '/error');
  }
}
