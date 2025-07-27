'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { CategoryItem } from '@/components/CategoryItem';

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

  const handleCategoryClick = (category: Category) => {
    router.push(`/catalog/${category.id}/services`);
  };

  return (
    <>
      <div className="p-4 pt-2">
        <div className="overflow-y-auto">
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No categories found.</div>
          ) : (
            <>
              <ul>
                {categories.map((cat: Category) => (
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