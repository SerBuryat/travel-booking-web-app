'use client';
import React from 'react';
import { ShortViewServiceComponent } from '@/components/ShortViewServiceComponent';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/SearchBar';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
}

interface Category {
  id: number;
  name: string;
  code: string;
  photo?: string | null;
}

interface ServicesClientProps {
  category: Category;
  childCategories: Category[];
  initialServices: Service[];
  selectedChildIds?: number[];
}

const ChildCategoryButton = ({ category, active, onClick }: { category: Category, active: boolean, onClick: () => void }) => (
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

export default function ServicesClient({childCategories, initialServices, selectedChildIds: initialSelectedChildIds = [] }: ServicesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Use the selectedChildIds from props, not local state
  const selectedChildIds = initialSelectedChildIds;

  const handleChildCategoryClick = (id: number) => {
    let newSelected: number[];
    if (selectedChildIds.includes(id)) {
      newSelected = selectedChildIds.filter(cid => cid !== id);
    } else {
      newSelected = [...selectedChildIds, id];
    }
    const params = new URLSearchParams(searchParams.toString());
    if (newSelected.length > 0) {
      params.set('childCategoryIds', newSelected.join(','));
    } else {
      params.delete('childCategoryIds');
    }
    router.push(`?${params.toString()}`);
    // Page will reload with new params
  };

  return (
    <>
      {/* Child Category Buttons */}
      {childCategories.length > 0 && (
        <div className="px-4 pb-2 overflow-x-auto">
          <div className="flex flex-row w-full" style={{ overflowX: 'auto' }}>
            {childCategories.map((cat) => {
              const active = selectedChildIds.includes(cat.id);
              return (
                <ChildCategoryButton
                  key={cat.id}
                  category={cat}
                  active={active}
                  onClick={() => handleChildCategoryClick(cat.id)}
                />
              );
            })}
          </div>
        </div>
      )}
      <div className="px-4 pt-4 pb-6">
        <SearchBar searchValue="" />
      </div>
      {/* Services Grid */}
      <div className="px-4 pb-32">
        <div className="grid grid-cols-2 gap-3">
          {initialServices.map((service) => (
              <ShortViewServiceComponent key={service.id} service={service} />
          ))}
        </div>
      </div>
    </>
  );
} 