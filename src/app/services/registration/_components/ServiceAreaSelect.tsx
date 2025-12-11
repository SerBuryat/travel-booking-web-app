'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {type LocationEntity, locationsForSelect} from "@/lib/location/locationsForSelect";
import {SELECTABLE_AREA_TIER} from "@/lib/location/constants";

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
  const [areas, setAreas] = useState<LocationEntity[]>([]);
  const [isLoading, setLoading] = useState(false);
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
      const data = await locationsForSelect();
      setAreas(data);
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
    if (!selectedArea) return <span className="text-gray-400"> Выберите зону </span>;

    const currentArea = findById(areas, selectedArea);

    return (
        <div className="flex items-center space-x-2">
          <span>{currentArea.parent.name}</span>
          <span>→</span>
          <span>{currentArea.name}</span>
        </div>
    );
  };

  // todo - повторяет функционал "выбора локации пользователем"
  function filterTree(nodes: LocationEntity[], term: string): LocationEntity[] {
    if (!term) return nodes;
    const lower = term.toLowerCase();
    const walk = (list: LocationEntity[]): LocationEntity[] =>
        list
        .map((node) => {
          const children = node.children ? walk(node.children) : [];
          const selfMatched = node.name.toLowerCase().includes(lower);
          if (selfMatched || children.length > 0) {
            return { ...node, children } as LocationEntity;
          }
          return null;
        })
        .filter(Boolean) as LocationEntity[];
    return walk(nodes);
  }

  const filteredTree = useMemo(() => {
    if (!areas) return null;
    return filterTree(areas, searchTerm);
  }, [areas, searchTerm]);

  function findById(nodes: LocationEntity[] | null | undefined, id?: number): LocationEntity | null {
    if (!nodes || !id) return null;
    for (const n of nodes) {
      if (n.id === id) return n;
      const found = findById(n.children, id);
      if (found) return found;
    }
    return null;
  }

  return (
      <div className="relative">
        <label className="block text-sm font-medium mb-0 pl-2" style={{
          color: '#A2ACB0',
          marginLeft: '8px',
          marginTop: '4px',
          marginBottom: '-8px',
          zIndex: 10,
          position: 'relative',
          width: 'fit-content',
          background: '#F9FAFB',
          paddingLeft: '4px',
          paddingRight: '4px'
        }}>
          Зона *
        </label>

        {/* Кнопка выбора зоны */}
        <button
            type="button"
            onClick={handleOpenModal}
            className={`
          w-full px-3 py-2 border rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black
          ${error ? 'border-red-300' : 'border-gray-300'}
          'bg-white'
        `}
            style={{ borderRadius: '14px' }}
        >
          {getSelectedAreaDisplay()}
        </button>

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
                  <h3 className="text-lg font-semibold text-gray-900">Выберите локацию</h3>
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

                {/* Поиск */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                  <div className="relative">
                    <svg
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="11" cy="11" r="7" strokeWidth="2"/>
                      <path d="M20 20l-3.5-3.5" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Поиск по названию локации"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  {error && (
                    <div className="mt-2 text-sm text-red-600">{error}</div>
                  )}
                </div>

                {/* Содержимое */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-sm text-gray-600">Загрузка...</span>
                    </div>
                  ) : (
                    <div className="px-4 sm:px-6 py-4 pb-24">
                      {filteredTree && (
                        <>
                          {filteredTree.length === 0 ? (
                            <div className="py-10 text-center text-sm text-gray-500">Локации не найдены</div>
                          ) : (
                            <div className="space-y-1">
                              {filteredTree.map((node) => (
                                <TreeNode
                                  key={node.id}
                                  node={node}
                                  depth={0}
                                  onSelect={handleAreaSelect}
                                  currentLocationId={selectedArea}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

interface TreeNodeProps {
  node: LocationEntity;
  depth: number;
  onSelect: (id: number) => void;
  currentLocationId?: number;
}

function TreeNode({node, depth, onSelect, currentLocationId}: TreeNodeProps) {
  const isCurrent = node.id === currentLocationId;
  const padding = depth * 20; // отступ на уровень
  const isClickable = node.tier === SELECTABLE_AREA_TIER;
  
  return (
    <div>
      <button
        onClick={() => {
          if (!isClickable) return;
          return onSelect(node.id);
        }}
        className={`
          w-full text-left px-4 py-3 rounded-xl transition-all duration-200
          flex items-center justify-between group
          ${isCurrent
            ? 'bg-blue-50 text-blue-700 font-medium'
            : isClickable
              ? 'hover:bg-gray-50 text-gray-900 active:bg-gray-100 cursor-pointer'
              : 'text-gray-500 cursor-not-allowed opacity-60'
          }
        `}
        style={{ paddingLeft: `${16 + padding}px` }}
        title={isClickable ? 'Выбрать эту локацию' : 'Выберите более конкретную локацию'}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {node.children && node.children.length > 0 ? (
            <svg 
              className={`h-4 w-4 flex-shrink-0 ${
                isClickable ? 'text-gray-400' : 'text-gray-300'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <span
              className={`inline-block h-2 w-2 rounded-full flex-shrink-0 ${
                isClickable ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          )}
          <span className="truncate font-medium">{node.name}</span>
        </div>
        
        {isCurrent ? (
          <svg 
            className="h-5 w-5 text-blue-600 flex-shrink-0 ml-2" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : isClickable ? (
          <svg 
            className={`h-5 w-5 flex-shrink-0 ml-2 transition-transform duration-200 ${
              isCurrent 
                ? 'text-blue-600' 
                : 'text-gray-400 group-hover:text-gray-600'
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg 
            className="h-5 w-5 text-gray-300 flex-shrink-0 ml-2" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" strokeWidth="2"/>
            <path d="M6 10V8a6 6 0 1112 0v2" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {node.children && node.children.length > 0 && (
        <div className="mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              currentLocationId={currentLocationId}
            />
          ))}
        </div>
      )}
    </div>
  );
}