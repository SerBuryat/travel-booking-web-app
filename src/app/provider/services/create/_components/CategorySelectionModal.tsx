'use client';

import React, {useEffect, useState} from 'react';
import {ParentCategoryWithChildren} from '@/model/CategoryType';

interface CategorySelectionModalProps {
  selectedCategory: number;
  onSelect: (categoryId: number) => void;
  error?: any;
}

export const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({ 
  selectedCategory, 
  onSelect, 
  error 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<ParentCategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  // Загружаем категории при монтировании, если уже есть выбранная категория (режим редактирования)
  useEffect(() => {
    if (selectedCategory && categories.length === 0) {
      loadCategories();
    }
  }, [selectedCategory]);

  // Загружаем категории при открытии модального окна
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      // todo - заменить на server actions, в `searchCategories` есть функция
      const response = await fetch('/api/categories/parent-with-children');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedParentId(null);
  };

  const handleCategorySelect = (categoryId: number) => {
    onSelect(categoryId);
    setIsOpen(false);
    setSelectedParentId(null);
  };

  const getSelectedCategoryDisplay = () => {
    if (!selectedCategory) return <span className="text-gray-400"> Выберите категорию </span>;

    // Если категории еще не загружены, показываем индикатор загрузки
    if (categories.length === 0) {
      return <span className="text-gray-400">Загрузка...</span>;
    }

    for (const parent of categories) {
      if (parent.id === selectedCategory) {
        return (
          <div className="flex items-center space-x-2 text-black">
            <span className="font-medium">{parent.name}</span>
            <span>(Основная категория)</span>
          </div>
        );
      }
      for (const child of parent.children) {
        if (child.id === selectedCategory) {
          return (
            <div className="flex items-center space-x-2 text-black">
              <span>{parent.name}</span>
              <span>→</span>
              <span>{child.name}</span>
            </div>
          );
        }
      }
    }
    return `Категория ${selectedCategory}`;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-0 pl-2" style={{ color: '#A2ACB0', marginLeft: '8px', marginTop: '4px', marginBottom: '-8px', zIndex: 10, position: 'relative', width: 'fit-content', background: '#F9FAFB', paddingLeft: '4px', paddingRight: '4px' }}>
        Категория *
      </label>
      
      {/* Кнопка выбора категории */}
      <button
        type="button"
        onClick={handleOpenModal}
        className={`
          w-full px-3 py-2 border shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${selectedCategory ? 'bg-gray-50 border-blue-300' : 'bg-gray-50'}
        `}
        style={{ borderRadius: '14px' }}
      >
        {getSelectedCategoryDisplay()}
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}

      {/* Модальное окно выбора категории */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Заголовок */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black">
                  Выберите категорию
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Содержимое */}
            <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-600">Загрузка категорий...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map((parentCategory) => (
                    <div key={parentCategory.id} className="border border-gray-200 rounded-lg">
                      {/* Родительская категория */}
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <button
                          onClick={() => handleCategorySelect(parentCategory.id)}
                          className="w-full text-left hover:bg-gray-100 p-2 rounded transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{parentCategory.name}</span>
                            <span className="text-sm text-gray-500">Основная категория</span>
                          </div>
                        </button>
                      </div>

                      {/* Дочерние категории */}
                      {parentCategory.children.length > 0 && (
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {parentCategory.children.map((childCategory) => (
                              <button
                                key={childCategory.id}
                                onClick={() => handleCategorySelect(childCategory.id)}
                                className="text-left p-3 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-600">→</span>
                                  <span className="text-gray-900">{childCategory.name}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Футер */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
