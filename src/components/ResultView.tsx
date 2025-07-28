"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShortViewServiceComponent } from './ShortViewServiceComponent';
import { GeneralCategoriesListComponent } from './GeneralCategoriesListComponent';

interface Category {
  id: number;
  name: string;
  code: string;
  photo?: string | null;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
  priority?: string;
}

interface ResultViewProps {
  searchValue: string;
  services: Service[];
  categories: Category[];
  generalCategories: Category[];
  showAll?: boolean;
}

function AllServicesButton({ ids, searchValue }: { ids: number[]; searchValue: string }) {
  const router = useRouter();
  return (
    <button
      className="px-4 py-2 text-blue-600 font-semibold rounded hover:underline"
      onClick={() => router.push(`/result?search=${encodeURIComponent(searchValue)}&showAll=true`)}
    >
      All Services
    </button>
  );
}

function ChildCategoryButton({ category, active, onClick }: { category: Category, active: boolean, onClick: () => void }) {
  return (
    <button
      className="px-4 py-2 rounded-[10px] mr-2 whitespace-nowrap"
      style={{
        background: active ? '#007AFF4D' : '#0000000A',
        fontSize: '13px',
        fontWeight: 600,
        color: active ? '#007AFF' : '#333',
        border: 'none',
        outline: 'none',
        transition: 'background 0.2s',
      }}
      onClick={onClick}
      type="button"
    >
      {category.name}
    </button>
  );
}

export default function ResultView({ searchValue, services, categories, generalCategories, showAll = false }: ResultViewProps) {
  const ids = services.map((s) => s.id);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // Filter by active category if selected
  const filteredServices = activeCategory
    ? services.filter((s) => s.tcategories_id === activeCategory)
    : services;

  return (
    <div className="w-full max-w-3xl mx-auto pt-8 px-4 bg-white">
      {/* ChildCategoryButton list */}
      {categories.length > 0 && (
        <div className="flex flex-wrap mb-4">
          {categories.map((cat: Category) => (
            <ChildCategoryButton
              key={cat.id}
              category={cat}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            />
          ))}
        </div>
      )}
      {/* Popular + AllServicesButton row */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-lg text-black">{showAll ? 'All Services' : 'Popular'}</span>
        {!showAll && <AllServicesButton ids={ids} searchValue={searchValue} />}
      </div>
      {/* Found services grid (2 columns) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {filteredServices.slice(0, 8).map((service) => (
          <ShortViewServiceComponent key={service.id} service={service} />
        ))}
      </div>
      {/* Lower: General Categories */}
      <GeneralCategoriesListComponent categories={generalCategories} />
    </div>
  );
} 