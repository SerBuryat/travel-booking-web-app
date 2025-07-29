import React from 'react';
import { CategoryRepository } from '@/repository/CategoryRepository';
import { getPopularServices } from '@/repository/ServiceRepository';
import { getGeneralCategoryCodes } from '@/utils/generalCategories';
import { GeneralCategoriesListComponent } from '@/components/GeneralCategoriesListComponent';
import { PopularServicesComponent } from '@/components/PopularServicesComponent';

export default async function Catalog() {
  const categories = await CategoryRepository.findAllByCodeIn(getGeneralCategoryCodes());
  const popularServices = await getPopularServices(6);

  return (
    <>
      <GeneralCategoriesListComponent categories={categories} />
      <PopularServicesComponent services={popularServices} />
    </>
  );
} 