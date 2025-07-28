'use client';
import React from 'react';
import { GeneralCategoriesListComponent } from '@/components/GeneralCategoriesListComponent';
import { PopularServicesComponent } from '@/components/PopularServicesComponent';

export interface Category {
  id: number;
  name: string;
  code: string;
  photo?: string | null;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
  priority: string;
}

interface CatalogProps {
  categories: Category[];
  popularServices: Service[];
}

export default function Catalog({ categories, popularServices }: CatalogProps) {
  return (
    <>
      {/* General Categories Section */}
      <GeneralCategoriesListComponent categories={categories} />
      
      {/* Popular Services Section */}
      <PopularServicesComponent services={popularServices} />
    </>
  );
} 