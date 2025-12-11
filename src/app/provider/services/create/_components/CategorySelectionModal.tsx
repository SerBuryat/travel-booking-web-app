'use client';

import React, {useEffect, useState} from 'react';
import {ParentCategoryWithChildren} from '@/model/CategoryType';
import {getAllParentCategoriesWithChildren} from '@/lib/category/searchCategories';

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
      const categoriesData = await getAllParentCategoriesWithChildren();
      setCategories(categoriesData);
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
  };

  const handleCategorySelect = (categoryId: number) => {
    onSelect(categoryId);
    setIsOpen(false);
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
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={handleCloseModal}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          
          {/* Модальное окно */}
          <div 
            className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col animate-slideUp sm:mt-0 mt-16"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Выберите категорию
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Закрыть"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Содержимое */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-sm text-gray-600">Загрузка...</span>
                </div>
              ) : (
                <div className="px-4 sm:px-6 py-4 space-y-1">
                  {categories.map((parentCategory) => (
                    <div key={parentCategory.id} className="mb-4 last:mb-0">
                      {/* Родительская категория */}
                      <button
                        onClick={() => handleCategorySelect(parentCategory.id)}
                        className={`
                          w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
                          flex items-center justify-between group
                          ${selectedCategory === parentCategory.id 
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'hover:bg-gray-50 text-gray-900 active:bg-gray-100'
                          }
                        `}
                      >
                        <span>{parentCategory.name}</span>
                        <svg 
                          className={`w-5 h-5 transition-transform duration-200 ${
                            selectedCategory === parentCategory.id 
                              ? 'text-blue-600' 
                              : 'text-gray-400 group-hover:text-gray-600'
                          }`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Дочерние категории */}
                      {parentCategory.children.length > 0 && (
                        <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100 space-y-0.5">
                          {parentCategory.children.map((childCategory) => (
                            <button
                              key={childCategory.id}
                              onClick={() => handleCategorySelect(childCategory.id)}
                              className={`
                                w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer
                                flex items-center justify-between group
                                ${selectedCategory === childCategory.id
                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                  : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                                }
                              `}
                            >
                              <span>{childCategory.name}</span>
                              <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  selectedCategory === childCategory.id 
                                    ? 'text-blue-600' 
                                    : 'text-gray-400 group-hover:text-gray-600'
                                }`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
