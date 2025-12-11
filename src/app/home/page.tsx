import React from 'react';
import {Header} from '@/components/Header';
import {SearchBarWrapper} from '@/components/SearchBarWrapper';
import {AllCategoriesForHomeComponent} from '@/components/AllCategoriesForHomeComponent';
import {VerticalServicesViewComponent} from '@/components/VerticalServicesViewComponent';
import {AreaArticlesComponent} from '@/components/AreaArticlesComponent';
import {AreaAfishaComponent} from '@/components/AreaAfishaComponent';
import {DeveloperLink} from '@/components/DeveloperLink';
import {popularServices} from "@/lib/service/searchServices";
import {PAGE_ROUTES} from "@/utils/routes";
import {parentCategories} from "@/lib/category/searchCategories";

// Принудительно делаем страницу динамической
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // todo - исключаем из родительских категорий категорию "Афиша" для отображения на главной странице (пока так)
  const categories =
      (await parentCategories()).filter(category => category.type !== 'afisha');
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

        {/* Афиша */}
        <AreaAfishaComponent />

        {/* Статьи по району */}
        <AreaArticlesComponent />

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
        <div className="flex flex-col items-center space-y-3 pt-10">
          {/*todo - уточнить что должно быть при нажатии этих кнопок*/}
          {/*<RegistryServiceButton />*/}
          {/*<PrivatePolicyButton />*/}
          <DeveloperLink />
        </div>
      </div>
    </div>
  );
} 