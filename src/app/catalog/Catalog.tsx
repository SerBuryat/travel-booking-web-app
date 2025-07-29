import React from 'react';
import { ServiceService } from '@/service/ServiceService';
import { GeneralCategoriesListComponent } from '@/components/GeneralCategoriesListComponent';
import { PopularServicesComponent } from '@/components/PopularServicesComponent';

export default async function Catalog() {
  const popularServices = await ServiceService.getPopularServices(6);

  return (
    <>
      <GeneralCategoriesListComponent />
      <PopularServicesComponent services={popularServices} />
    </>
  );
} 