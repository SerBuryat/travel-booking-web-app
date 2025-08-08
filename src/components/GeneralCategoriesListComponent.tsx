import React from 'react';
import {getGeneralCategoryByCode} from "@/utils/generalCategories";
import { CategoryService } from '@/service/CategoryService';
import { CategoryItem } from './CategoryItem';

export interface Category {
  id: number;
  name: string;
  code: string;
  photo?: string | null;
}

export const GeneralCategoriesListComponent: React.FC = async () => {
  const categoryService = new CategoryService();
  const generalCategories = await categoryService.getGeneralCategories();

  return (
    <div className="p-4 pt-2">
      <div className="overflow-y-auto">
        {generalCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No categories found.</div>
        ) : (
          <>
            <ul>
              {generalCategories.map((cat: Category) => {
                const generalCategory = getGeneralCategoryByCode(cat.code);
                return (
                  <li key={cat.id} className="relative">
                    <CategoryItem category={cat} generalCategory={generalCategory} />
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