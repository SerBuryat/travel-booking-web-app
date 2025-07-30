import React from 'react';
import { PopularServicesComponent } from './PopularServicesComponent';
import { GeneralCategoriesListComponent } from './GeneralCategoriesListComponent';
import { ServiceType } from '@/model/ServiceType';
import { CategoryEntity } from '@/entity/CategoryEntity';

interface ResultViewProps {
  searchValue: string;
  services: ServiceType[];
  categories: CategoryEntity[];
}

export default function ResultView({ searchValue, services, categories }: ResultViewProps) {
  return (
    <div className="w-full max-w-3xl mx-auto pt-4 px-4 bg-white">
      {/* Categories list */}
      {categories.length > 0 && (
        <div className="flex flex-wrap">
          {categories.map((cat: CategoryEntity) => (
            <span
              key={cat.id}
              className="px-4 py-2 rounded-[10px] mr-2 whitespace-nowrap bg-gray-100 text-gray-700"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}
      
      <PopularServicesComponent services={services} />
      <GeneralCategoriesListComponent />

    </div>
  );
} 