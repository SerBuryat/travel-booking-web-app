'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {getCategoryPngImage} from '@/utils/generalCategories';

interface Category {
  id: number;
  name: string;
  code: string;
  sysname: string;
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

  // Компонент категории с картинкой или градиентом
  const CategoryItem: React.FC<{ category: Category; size: 'large' | 'small'; stretched?: boolean }> = ({ category, size, stretched = false }) => {
    const imageSrc = getCategoryPngImage(category.sysname, size);
    const isLarge = size === 'large';
    const sizeClass = isLarge ? (stretched ? 'w-full h-24' : 'w-24 h-24') : 'w-16 h-16';
    const textMaxWidth = stretched ? 'w-full' : (isLarge ? 'max-w-24' : 'max-w-16');
    
    const backgroundStyle = imageSrc 
      ? { 
          backgroundImage: `url(${imageSrc})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }
      : { 
          background: getGradientForId(category.id) 
        };
    
    return (
      <div
        key={category.id}
        className={`flex flex-col items-center cursor-pointer ${stretched ? 'flex-1' : ''}`}
        onClick={() => handleCategoryClick(category.id)}
      >
        <div 
          className={`${sizeClass} rounded-[15px] mb-2 overflow-hidden relative flex items-center justify-center`}
          style={backgroundStyle}
        />
        <span 
          className={`text-xs text-center text-gray-700 ${textMaxWidth} break-words`}
          title={category.name}
        >
          {category.name}
        </span>
      </div>
    );
  };

  // Ограничиваем количество категорий до 8
  const displayCategories = categories.slice(0, 8);
  const count = displayCategories.length;

  // Логика layout в виде матрицы для наглядности
  // 1-3 категории: все большие в один ряд
  // 4 категории: 2 ряда по 2 больших
  // 5-6 категорий: 2 ряда (верхний - 2 больших, нижний - 3-4 малых)
  // 7-8 категорий: 2 ряда (верхний - 3 больших, нижний - 4-5 малых)
  
  const renderLayout = () => {
    if (count === 0) return null;

    // 1-3: все большие в один ряд, растянуты по ширине
    if (count <= 3) {
      return (
        <div className="flex gap-4">
          {displayCategories.map((category) => (
            <CategoryItem key={category.id} category={category} size="large" stretched />
          ))}
        </div>
      );
    }

    // 4: 2 ряда по 2 больших, растянуты по ширине
    if (count === 4) {
      return (
        <div className="flex flex-col space-y-4">
          {/* Ряд 1: 2 больших */}
          <div className="flex gap-4">
            {displayCategories.slice(0, 2).map((category) => (
              <CategoryItem key={category.id} category={category} size="large" stretched />
            ))}
          </div>
          {/* Ряд 2: 2 больших */}
          <div className="flex gap-4">
            {displayCategories.slice(2, 4).map((category) => (
              <CategoryItem key={category.id} category={category} size="large" stretched />
            ))}
          </div>
        </div>
      );
    }

    // 5-6: верхний ряд 2 больших (растянуты), нижний ряд 3-4 малых
    if (count >= 5 && count <= 6) {
      return (
        <div className="flex flex-col space-y-4">
          {/* Ряд 1: 2 больших, растянуты по ширине */}
          <div className="flex gap-4">
            {displayCategories.slice(0, 2).map((category) => (
              <CategoryItem key={category.id} category={category} size="large" stretched />
            ))}
          </div>
          {/* Ряд 2: 3-4 малых, с отступами */}
          <div className="flex justify-between">
            {displayCategories.slice(2).map((category) => (
              <CategoryItem key={category.id} category={category} size="small" />
            ))}
          </div>
        </div>
      );
    }

    // 7-8: верхний ряд 3 больших (растянуты), нижний ряд 4-5 малых
    if (count >= 7 && count <= 8) {
      return (
        <div className="flex flex-col space-y-4">
          {/* Ряд 1: 3 больших, растянуты по ширине */}
          <div className="flex gap-4">
            {displayCategories.slice(0, 3).map((category) => (
              <CategoryItem key={category.id} category={category} size="large" stretched />
            ))}
          </div>
          {/* Ряд 2: 4-5 малых, с отступами */}
          <div className="flex justify-between">
            {displayCategories.slice(3).map((category) => (
              <CategoryItem key={category.id} category={category} size="small" />
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="px-4 py-2">
      {renderLayout()}
    </div>
  );
}; 