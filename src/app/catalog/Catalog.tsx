import React from 'react';
import {GeneralCategoriesListComponent} from '@/components/GeneralCategoriesListComponent';
import {VerticalServicesViewComponent} from '@/components/VerticalServicesViewComponent';
import {ServiceRegistrationBanner} from '@/components/ServiceRegistrationBanner';
import {popularServices} from "@/lib/service/searchServices";
import {PrivatePolicyButton} from "@/components/PrivatePolicyButton";
import {PAGE_ROUTES} from "@/utils/routes";

export default async function Catalog() {
  const services = await popularServices({take: 6});

  return (
    <>
      <GeneralCategoriesListComponent />
      <VerticalServicesViewComponent 
        services={services} 
        title="Популярное"
        moveToAllButton={{
          text: "Все",
          href: PAGE_ROUTES.CATALOG.POPULAR
        }}
      />
      <ServiceRegistrationBanner />
      {/* Кнопки Registry service и Private policy */}
      {/*todo - уточнить что должно быть при нажатии этой кнопки*/}
      {/*<div className="flex flex-col items-center space-y-3">*/}
      {/*  <PrivatePolicyButton />*/}
      {/*</div>*/}
    </>
  );
} 