'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {getGeneralCategoryByCode, DEFAULT_CATEGORY_ICON} from "@/utils/generalCategories";

export interface Category {
  id: number;
  name: string;
  code: string;
  photo?: string | null;
}

interface GeneralCategoriesListComponentProps {
  categories: Category[];
}

export const GeneralCategoriesListComponent: React.FC<GeneralCategoriesListComponentProps> = ({ categories }) => {
  const router = useRouter();

  const handleCategoryClick = (category: Category) => {
    router.push(`/catalog/${category.id}/services`);
  };

  return (
    <div className="p-4 pt-2">
      <div className="overflow-y-auto">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No categories found.</div>
        ) : (
          <>
            <ul>
              {categories.map((cat: Category) => {
                const generalCategory = getGeneralCategoryByCode(cat.code);
                return (
                  <li key={cat.id} className="relative">
                    <div
                      className="flex items-center py-3 cursor-pointer hover:bg-gray-100 transition group relative"
                      onClick={() => handleCategoryClick(cat)}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-[10px] overflow-hidden bg-white flex items-center justify-center">
                        {generalCategory?.icon || DEFAULT_CATEGORY_ICON}
                      </div>
                      <div className="flex-1 text-[17px] font-normal text-gray-900 overflow-hidden ml-5">{cat.name}</div>
                      <div className="flex-shrink-0 w-4 h-4 ml-4">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <path d="M9 6l6 6-6 6" stroke="#707579" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="absolute left-[10%] bottom-0 w-[80%] h-px bg-gray-200 group-hover:bg-gray-300" />
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}; 