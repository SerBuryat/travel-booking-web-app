import React from 'react';
import {Header} from '@/components/Header';
import {SearchBarWrapper} from '@/components/SearchBarWrapper';
import {AllCategoriesForHomeComponent} from '@/components/AllCategoriesForHomeComponent';
import {PopularServicesComponent} from '@/components/PopularServicesComponent';
import {RegistryServiceButton} from '@/components/RegistryServiceButton';
import {PrivatePolicyButton} from '@/components/PrivatePolicyButton';
import {CategoryService} from '@/service/CategoryService';
import {popularServices} from "@/lib/service/searchServices";

// Принудительно делаем страницу динамической
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const categoryService = new CategoryService();
  const categories = await categoryService.getAllParentCategories();
  const services = await popularServices({take: 6});

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-md mx-auto">
        {/* Header с поисковой строкой */}
        <Header>
          <SearchBarWrapper />
        </Header>

        {/* Список всех категорий */}
        <div className="overflow-y-auto pt-4 pl-4 pr-4">
          <AllCategoriesForHomeComponent categories={categories} />
        </div>

        {/* Популярные сервисы */}
        <div>
          <PopularServicesComponent services={services} />
        </div>

        {/* Кнопки Registry service и Private policy */}
        <div className="px-4 py-6 flex flex-col items-center space-y-3">
          <RegistryServiceButton />
          <PrivatePolicyButton />
        </div>
      </div>
    </div>
  );
} 