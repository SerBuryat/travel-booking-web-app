import React from 'react';
import {ServiceService} from '@/service/ServiceService';
import {GeneralCategoriesListComponent} from '@/components/GeneralCategoriesListComponent';
import {PopularServicesComponent} from '@/components/PopularServicesComponent';
import {ServiceRegistrationBanner} from '@/components/ServiceRegistrationBanner';

export default async function Catalog() {
  const serviceService = new ServiceService();
  const popularServices = await serviceService.getPopularServices(6);

  return (
    <>
      <GeneralCategoriesListComponent />
      <PopularServicesComponent services={popularServices} />
      <ServiceRegistrationBanner />
    </>
  );
} 