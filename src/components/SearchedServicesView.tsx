"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from './SearchBar';
import { ShortViewServiceComponent } from './ShortViewServiceComponent';
import Catalog, {Category} from "@/app/catalog/Catalog";

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
}

interface SearchedServicesViewProps {
  search: string;
  services: Service[];
  categories: Category[];
  parentCategories: Category[];
}

function CancelSearchButton() {
  const router = useRouter();
  return (
    <button
      className="ml-2 px-4 py-2 text-blue-600 font-semibold rounded hover:underline"
      onClick={() => router.push('/catalog')}
    >
      Cancel
    </button>
  );
}

function AllServicesButton({ ids }: { ids: number[] }) {
  const router = useRouter();
  return (
    <button
      className="px-4 py-2 text-blue-600 font-semibold rounded hover:underline"
      onClick={() => router.push(`/catalog/services?ids=${ids.join(',')}`)}
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

export default function SearchedServicesView({ search, services, categories, parentCategories }: SearchedServicesViewProps) {
  const ids = services.map((s) => s.id);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const searchValue = search;

  // Filter by active category if selected
  const filteredServices = activeCategory
    ? services.filter((s) => s.tcategories_id === activeCategory)
    : services;

  return (
    <div className="w-full max-w-3xl mx-auto pt-8 px-4 bg-white">
      {/* Header: SearchBar + CancelSearchButton */}
      <div className="flex items-center mb-4">
        <div className="flex-1">
          <SearchBar searchValue={searchValue} />
        </div>
        <div className="w-1/4 flex justify-end">
          <CancelSearchButton />
        </div>
      </div>
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
        <span className="font-semibold text-lg text-black">Popular</span>
        <AllServicesButton ids={ids} />
      </div>
      {/* Found services grid (2 columns) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {filteredServices.slice(0, 8).map((service) => (
          <ShortViewServiceComponent key={service.id} service={service} />
        ))}
      </div>
      {/* Lower: Catalog (parent categories) */}
      <Catalog categories={parentCategories} />
    </div>
  );
} 