'use client';
import React, { useState, useMemo } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ShortViewServiceComponent } from '@/components/ShortViewServiceComponent';

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

export default function ServicesClient({ category, childCategories, initialServices }: ServicesClientProps) {
  const [selectedChildIds, setSelectedChildIds] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // For demo: filter initialServices by search and selected child categories
  const filteredServices = useMemo(() => {
    return initialServices.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchValue.toLowerCase());
      const matchesCategory = selectedChildIds.length === 0 || selectedChildIds.includes(service.tcategories_id);
      return matchesSearch && matchesCategory;
    });
  }, [initialServices, searchValue, selectedChildIds]);

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
                  onClick={() => {
                    setSelectedChildIds((prev) =>
                      prev.includes(cat.id)
                        ? prev.filter((id) => id !== cat.id)
                        : [...prev, cat.id]
                    );
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
      {/* Search Bar */}
      <div className="px-4 pb-4">
        <SearchBar value={searchValue} onChange={setSearchValue} />
        {searchValue && (
          <div className="mt-2 text-sm text-gray-500 text-center">
            You typed: &#34;{searchValue}&#34;
          </div>
        )}
      </div>
      {/* Services Grid */}
      <div className="px-4 pb-32">
        <div className="max-w-md mx-auto">
          {filteredServices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No services found in this category
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 overflow-y-auto">
              {filteredServices.map((service) => (
                <ShortViewServiceComponent
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 