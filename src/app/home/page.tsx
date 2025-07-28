import React from 'react';
import { getAllParentCategories } from '@/repository/CategoryRepository';
import { getPopularServices } from '@/repository/ServiceRepository';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { AllCategoriesForHomeComponent } from '@/components/AllCategoriesForHomeComponent';
import { PopularServicesForHomeComponent } from '@/components/PopularServicesForHomeComponent';
import { RegistryServiceButton } from '@/components/RegistryServiceButton';
import { PrivatePolicyButton } from '@/components/PrivatePolicyButton';

export default async function HomePage() {
  // Загружаем данные
  const categories = await getAllParentCategories();
  const popularServices = await getPopularServices(6);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-md mx-auto">
        {/* Header с поисковой строкой */}
        <Header>
          <SearchBar />
        </Header>

        {/* Список всех категорий */}
        <div className="overflow-y-auto">
          <AllCategoriesForHomeComponent categories={categories} />
        </div>

        {/* Популярные сервисы */}
        <PopularServicesForHomeComponent services={popularServices} />

        {/* Кнопки Registry service и Private policy */}
        <div className="px-4 py-6 flex flex-col items-center space-y-3">
          <RegistryServiceButton />
          <PrivatePolicyButton />
        </div>
      </div>
    </div>
  );
} 