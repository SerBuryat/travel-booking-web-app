'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryItem } from '@/components/CategoryItem';
import { SearchBar } from '@/components/SearchBar';

export interface Category {
  id: number;
  name: string;
  code: string;
  photo?: string | null;
}

interface CatalogProps {
  categories: Category[];
}

function CatalogSkeleton() {
  return (
    <div className="pt-0 p-10">
      <div className="overflow-y-auto">
        <ul>
          {[...Array(8)].map((_, index) => (
            <li key={index} className="relative">
              <div className="bg-white rounded-[10px] overflow-hidden shadow-sm border">
                <div className="flex">
                  <div className="w-24 h-24 bg-gray-200 animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 p-4 border-l border-gray-100">
                    <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              </div>
              {index < 7 && <div className="h-px bg-gray-100 my-4"></div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Catalog({ categories }: CatalogProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time to show skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Show skeleton for 500ms

    return () => clearTimeout(timer);
  }, []);

  const handleCategoryClick = (category: Category) => {
    router.push(`/catalog/${category.id}/services`);
  };

  if (isLoading) {
    return <CatalogSkeleton />;
  }

  const filteredCategories = searchValue
    ? categories.filter((cat: Category) =>
        cat.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : categories;

  return (
    <>
      <SearchBar value={searchValue} onChange={setSearchValue} />
      {searchValue && (
        <div className="mt-2 text-sm text-gray-500 text-center">
          You typed: &#34;{searchValue}&#34;
        </div>
      )}
      <div className="pt-0 p-10">
        <div className="overflow-y-auto">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No categories found.</div>
          ) : (
            <>
              <ul>
                {filteredCategories.map((cat: Category) => (
                  <li key={cat.id} className="relative">
                    <CategoryItem {...cat} onClick={handleCategoryClick} />
                  </li>
                ))}
              </ul>
              <div className="h-24" />
            </>
          )}
        </div>
      </div>
    </>
  );
} 