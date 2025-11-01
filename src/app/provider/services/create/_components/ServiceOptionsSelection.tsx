'use client';

import React, {useEffect, useState} from 'react';
import {ServiceOptions, ServiceCategoryOption} from '@/utils/serviceOptions';

interface ServiceOptionsSelectionProps {
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
}

export const ServiceOptionsSelection: React.FC<ServiceOptionsSelectionProps> = ({ 
  selectedOptions, 
  onOptionsChange
}) => {
  const [categories, setCategories] = useState<ServiceCategoryOption[]>([]);

  // Загружаем категории опций при монтировании компонента
  useEffect(() => {
    const categoriesList = Object.values(ServiceOptions);
    setCategories(categoriesList);
  }, []);

  const handleOptionToggle = (option: string) => {
    if (selectedOptions.includes(option)) {
      // Убираем опцию
      onOptionsChange(selectedOptions.filter(opt => opt !== option));
    } else {
      // Добавляем опцию
      onOptionsChange([...selectedOptions, option]);
    }
  };

  const handleDeselectAll = () => {
    onOptionsChange([]);
  };

  if (categories.length === 0) {
    return (
      <div>
        <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
          <p className="text-sm text-gray-500">
            Загрузка доступных опций...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Описание */}
      <p className="text-sm text-gray-600 mb-3 mt-3" style={{ color: '#707579'}}>
        Отметьте подходящие опции. Это поможет туристам найти ваш объект.
      </p>

      {/* Категории опций */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.name}>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              {category.description}
            </h4>
            
            {/* Опции категории */}
            <div className="flex flex-wrap gap-2">
              {category.options.map((option) => {
                const isSelected = selectedOptions.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionToggle(option)}
                    className="px-3 py-2 text-sm font-medium transition-all duration-200"
                    style={{
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#B0D5FD' : '#0000000A',
                      color: isSelected ? '#1e40af' : '#374151'
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Счетчик выбранных опций */}
      {selectedOptions.length > 0 && (
        <>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              Выбрано опций: <span className="font-semibold">{selectedOptions.length}</span>
            </p>
          </div>
          
          {/* Кнопка очистки */}
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleDeselectAll}
              className="px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
              style={{ 
                borderRadius: '12px',
                backgroundColor: 'transparent',
                border: '1px solid #B0D5FD'
              }}
            >
              Очистить
            </button>
          </div>
        </>
      )}
    </div>
  );
};
