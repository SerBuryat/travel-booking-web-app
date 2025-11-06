import React from 'react';
import {getCategoryBackgroundImage} from '@/utils/generalCategories';

interface Category {
  id: number;
  code: string;
  sysname: string;
  name: string;
  photo: string | null;
  parent_id: number | null;
  priority: number | null;
}

interface CategoryHeaderComponentProps {
  category: Category;
}

export const CategoryHeaderComponent: React.FC<CategoryHeaderComponentProps> = ({ category }) => {
  // Получаем фоновое изображение из маппинга по sysname
  const backgroundImage = getCategoryBackgroundImage(category.sysname);
  
  // Generate a random gradient as fallback
  const getRandomGradient = () => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const backgroundStyle = 
    backgroundImage 
      ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { backgroundImage: getRandomGradient() };

  return (
    <div 
      className="relative h-32 rounded-lg flex items-center justify-center overflow-hidden"
      style={backgroundStyle}
    >
      {/* Overlay for better text readability - только для картинок */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-black/20"
        ></div>
      )}
      {/* Category name */}
      <h1 
        className="relative z-10 text-white font-bold text-2xl text-center px-4 "
        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
      >
        {category.name}
      </h1>
    </div>
  );
}; 