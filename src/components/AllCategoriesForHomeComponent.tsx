'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

interface Category {
  id: number;
  name: string;
  code: string;
  photo: string | null;
}

interface AllCategoriesForHomeComponentProps {
  categories: Category[];
}

export const AllCategoriesForHomeComponent: React.FC<AllCategoriesForHomeComponentProps> = ({ categories }) => {
  const router = useRouter();

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/catalog/${categoryId}/services`);
  };

  const getGradientForId = (id: number) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return gradients[id % gradients.length];
  };

  // Разбиваем категории на 2 ряда
  // Количество категорий в первом ряду в 1.5 меньше, чем во втором
  const firstRow = categories.slice(0, Math.floor(categories.length / 2.5));
  const secondRow = categories.slice(Math.floor(categories.length / 2.5));

  return (
    <div className="px-4 py-2">
      {/* Ряд 1 - большие иконки */}
      <div className="flex space-x-8 mb-4">
        {firstRow.map((category) => (
                     <div
              key={category.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
           >
              <div 
                className="w-24 h-24 rounded-[15px] mb-2"
                style={{ background: getGradientForId(category.id) }}
              />
               <span 
                 className="text-xs text-center text-gray-700 max-w-24 break-words"
                 title={category.name}
               >
                 {category.name}
               </span>
            </div>
        ))}
      </div>

                           {/* Ряд 2 - маленькие иконки */}
        {secondRow.length > 0 && (
          <div className="flex space-x-4">
           {secondRow.map((category) => (
                                                    <div
                 key={category.id}
                 className="flex flex-col items-center cursor-pointer"
                 onClick={() => handleCategoryClick(category.id)}
               >
                 <div 
                   className="w-16 h-16 rounded-[15px] mb-2"
                   style={{ background: getGradientForId(category.id) }}
                 />
                                <span 
                     className="text-xs text-center text-gray-700 max-w-16 break-words"
                     title={category.name}
                   >
                     {category.name}
                   </span>
               </div>
           ))}
           {/* Невидимый элемент для отступа */}
           <div className="invisible"> 1 </div>
         </div>
       )}
    </div>
  );
}; 