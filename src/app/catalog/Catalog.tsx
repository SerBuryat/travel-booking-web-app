import React from 'react';
import { getPopularServices } from '@/repository/ServiceRepository';
import { GeneralCategoriesListComponent } from '@/components/GeneralCategoriesListComponent';
import { PopularServicesComponent } from '@/components/PopularServicesComponent';

export default async function Catalog() {
  const popularServices = await getPopularServices(6);

  return (
    <>
      <GeneralCategoriesListComponent />
      <PopularServicesComponent services={popularServices} />
    </>
  );
} 