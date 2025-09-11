'use client';

import React, {useEffect, useState} from 'react';
import {getAllOptions} from '@/utils/serviceOptions';

interface ServiceOptionsSelectionProps {
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
}

export const ServiceOptionsSelection: React.FC<ServiceOptionsSelectionProps> = ({ 
  selectedOptions, 
  onOptionsChange
}) => {
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);

  // Загружаем все доступные опции при монтировании компонента
  useEffect(() => {
    const allOptions = getAllOptions();
    setAvailableOptions(allOptions);
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

  const handleSelectAll = () => {
    onOptionsChange([...availableOptions]);
  };

  const handleDeselectAll = () => {
    onOptionsChange([]);
  };

  if (availableOptions.length === 0) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Опции сервиса
        </label>
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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Опции сервиса
      </label>
      
      {/* Описание */}
      <p className="text-sm text-gray-600 mb-3">
        Выберите доступные опции для вашего сервиса
      </p>

      {/* Кнопки управления */}
      <div className="flex space-x-2 mb-4">
        <button
          type="button"
          onClick={handleSelectAll}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Выбрать все
        </button>
        <button
          type="button"
          onClick={handleDeselectAll}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Снять выбор
        </button>
      </div>

      {/* Сетка опций */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableOptions.map((option) => {
          const isSelected = selectedOptions.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionToggle(option)}
              className={`
                p-3 text-left border rounded-lg transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <div className={`
                  w-4 h-4 rounded border-2 flex items-center justify-center
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                  }
                `}>
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Счетчик выбранных опций */}
      {selectedOptions.length > 0 && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            Выбрано опций: <span className="font-semibold">{selectedOptions.length}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {selectedOptions.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};
