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

  // Загружаем зоны при монтировании, если уже есть выбранная зона (режим редактирования)
  useEffect(() => {
    if (selectedArea && areas.length === 0) {
      loadAreas();
    }
  }, [selectedArea]);

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
    
    // Если зона еще не загружена, показываем индикатор загрузки
    if (!currentArea) {
      return <span className="text-gray-400">Загрузка...</span>;
    }

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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
              <div
                  className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
                  <h3 className="text-base font-semibold text-neutral-900">Выберите локацию</h3>
                  <button
                      onClick={handleCloseModal}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      aria-label="Закрыть"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                <div className="px-5 py-4 border-b border-neutral-200">
                  <div className="relative">
                    <svg
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="11" cy="11" r="7" strokeWidth="2"/>
                      <path d="M20 20l-3.5-3.5" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Поиск по названию локации"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  {error && (
                      <div className="mt-2 text-sm text-red-600">{error}</div>
                  )}
                </div>

                <div className="px-5 py-4 overflow-y-auto max-h-[50vh]">
                  <div className="space-y-6">
                    {isLoading && (
                        <div className="py-10 text-center text-neutral-500">Загрузка...</div>
                    )}

                    {!isLoading && filteredTree && (
                        <>
                          {filteredTree.length === 0 && (
                              <div className="py-10 text-center text-neutral-500">Локации не найдены</div>
                          )}
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
                        </>
                    )}
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-neutral-200 bg-neutral-50">
                  <div className="flex justify-end gap-3">
                    <button
                        onClick={handleCloseModal}
                        className="inline-flex items-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
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

interface TreeNodeProps {
  node: LocationEntity;
  depth: number;
  onSelect: (id: number) => void;
  currentLocationId?: number;
}

function TreeNode({node, depth, onSelect, currentLocationId}: TreeNodeProps) {
  const isCurrent = node.id === currentLocationId;
  const padding = 12 + depth * 16; // базовый отступ + отступ на уровень
  const isClickable = node.tier === SELECTABLE_AREA_TIER;
  return (
      <div>
        <button
            onClick={() => {
              if (!isClickable) return;
              return onSelect(node.id);
            }}
            className={`group flex w-full items-start justify-between gap-3 rounded-lg border text-left transition-colors ${
                isCurrent
                    ? 'border-blue-300 bg-blue-50/60'
                    : isClickable
                        ? 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                        : 'border-neutral-200 bg-neutral-50/60 text-neutral-500 cursor-not-allowed'
            }`}
            style={{padding: '12px', paddingLeft: `${padding}px`}}
            title={isClickable ? 'Выбрать эту локацию' : 'Выберите более конкретную локацию'}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {node.children && node.children.length > 0 ? (
                  <svg className="h-4 w-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              ) : (
                  <span
                      className={`inline-block h-2 w-2 rounded-full ${isClickable ? 'bg-blue-500' : 'bg-neutral-300'}`}/>
              )}
              <div
                  className={`truncate font-medium ${isClickable ? 'text-neutral-900' : 'text-neutral-500'}`}>{node.name}</div>
            </div>
          </div>
          {isCurrent ? (
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          ) : isClickable ? (
              <svg className="h-5 w-5 text-neutral-300 group-hover:text-neutral-500" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor">
                <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          ) : (
              <svg className="h-5 w-5 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" strokeWidth="2"/>
                <path d="M6 10V8a6 6 0 1112 0v2" strokeWidth="2" strokeLinecap="round"/>
              </svg>
          )}
        </button>

        {node.children && node.children.length > 0 && (
            <div className="mt-1 space-y-1">
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