'use client';

import React, { useState, useEffect } from 'react';
import { AreaEntity } from '@/entity/AreaEntity';

interface ServiceAreaSelectProps {
  selectedArea: number;
  onAreaSelect: (areaId: number) => void;
  error?: any;
}

export const ServiceAreaSelect: React.FC<ServiceAreaSelectProps> = ({ 
  selectedArea, 
  onAreaSelect, 
  error 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [areas, setAreas] = useState<AreaEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Загружаем зоны при открытии модального окна
  useEffect(() => {
    if (isOpen && areas.length === 0) {
      loadAreas();
    }
  }, [isOpen]);

  const loadAreas = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/areas');
      if (response.ok) {
        const data = await response.json();
        setAreas(data.areas);
      }
    } catch (error) {
      console.error('Ошибка загрузки зон:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleAreaSelect = (areaId: number) => {
    onAreaSelect(areaId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getSelectedAreaDisplay = () => {
    if (!selectedArea) return 'Выберите зону';
    
    const area = areas.find(a => a.id === selectedArea);
    if (!area) return `Зона ${selectedArea}`;

    return (
      <div className="flex items-center space-x-2">
        <span className="text-blue-600 font-medium">{area.name}</span>
        {area.parent_id && (
          <span className="text-gray-400 text-sm">(Подзона)</span>
        )}
      </div>
    );
  };

  const filteredAreas = areas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const parentAreas = filteredAreas.filter(area => !area.parent_id);
  const childAreas = filteredAreas.filter(area => area.parent_id);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Зона *
      </label>
      
      {/* Кнопка выбора зоны */}
      <button
        type="button"
        onClick={handleOpenModal}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${selectedArea ? 'bg-blue-50 border-blue-300' : 'bg-white'}
        `}
      >
        {getSelectedAreaDisplay()}
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}

      {/* Модальное окно выбора зоны */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Заголовок */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Выберите зону
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

            {/* Поиск */}
            <div className="px-6 py-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Поиск по названию зоны..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            {/* Содержимое */}
            <div className="px-6 py-4 overflow-y-auto max-h-[50vh]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2">Загрузка зон...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Основные зоны */}
                  {parentAreas.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Основные зоны</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {parentAreas.map((area) => (
                          <button
                            key={area.id}
                            onClick={() => handleAreaSelect(area.id)}
                            className="text-left p-3 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          >
                            <div className="font-medium text-gray-900">{area.name}</div>
                            <div className="text-sm text-gray-500">{area.sysname}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Подзоны */}
                  {childAreas.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Подзоны</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {childAreas.map((area) => (
                          <button
                            key={area.id}
                            onClick={() => handleAreaSelect(area.id)}
                            className="text-left p-3 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          >
                            <div className="font-medium text-gray-900">{area.name}</div>
                            <div className="text-sm text-gray-500">{area.sysname}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredAreas.length === 0 && searchTerm && (
                    <div className="text-center py-8 text-gray-500">
                      Зоны не найдены по запросу &#34;{searchTerm}&#34;
                    </div>
                  )}

                  {filteredAreas.length === 0 && !searchTerm && (
                    <div className="text-center py-8 text-gray-500">
                      Зоны не найдены
                    </div>
                  )}
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
