'use client';
import React, { useState } from 'react';
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

export default function Catalog({ categories }: CatalogProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const handleCategoryClick = (category: Category) => {
    router.push(`/catalog/${category.id}/services`);
  };

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