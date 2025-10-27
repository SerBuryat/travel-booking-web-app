import React from 'react';
import {Header} from '@/components/Header';
import {SearchBarWrapper} from '@/components/SearchBarWrapper';
import {AllCategoriesForHomeComponent} from '@/components/AllCategoriesForHomeComponent';
import {VerticalServicesViewComponent} from '@/components/VerticalServicesViewComponent';
import {RegistryServiceButton} from '@/components/RegistryServiceButton';
import {PrivatePolicyButton} from '@/components/PrivatePolicyButton';
import {CategoryService} from '@/service/CategoryService';
import {popularServices} from "@/lib/service/searchServices";
import {PAGE_ROUTES} from "@/utils/routes";

export default async function HomePage() {
  const categoryService = new CategoryService();
  const categories = await categoryService.getAllParentCategories();
  const services = await popularServices({take: 6});

  return (
    <div className="min-h-screen bg-white pb-10">
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
          <VerticalServicesViewComponent 
            services={services} 
            title="Популярное"
            moveToAllButton={{
              text: "Все",
              href: PAGE_ROUTES.CATALOG.POPULAR
            }}
          />
        </div>

        {/* Кнопки Registry service и Private policy */}
        <div className="flex flex-col items-center space-y-3">
          <RegistryServiceButton />
          <PrivatePolicyButton />
        </div>
      </div>
    </div>
  );
} 