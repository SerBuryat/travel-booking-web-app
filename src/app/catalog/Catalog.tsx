import React from 'react';
import {GeneralCategoriesListComponent} from '@/components/GeneralCategoriesListComponent';
import {PopularServicesComponent} from '@/components/PopularServicesComponent';
import {ServiceRegistrationBanner} from '@/components/ServiceRegistrationBanner';
import {popularServices} from "@/lib/service/searchServices";

export default async function Catalog() {
  const services = await popularServices({take: 6});

  return (
    <>
      <GeneralCategoriesListComponent />
      <PopularServicesComponent services={services} />
      <ServiceRegistrationBanner />
    </>
  );
} 