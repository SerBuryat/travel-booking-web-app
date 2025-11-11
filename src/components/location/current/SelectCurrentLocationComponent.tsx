'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCurrentLocation } from '@/lib/location/updateCurrentLocation';
import type { LocationEntity } from '@/lib/location/locationsForSelect';
import { locationsForSelect } from '@/lib/location/locationsForSelect';
import { SELECTABLE_AREA_TIER } from '@/lib/location/constants';

interface SelectLocationComponentProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocationId?: number;
  refreshUser: () => void
}

export const SelectCurrentLocationComponent: React.FC<SelectLocationComponentProps> = ({ isOpen, onClose, currentLocationId, refreshUser }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [areas, setAreas] = useState<LocationEntity[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let canceled = false;
    async function fetchAreas() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await locationsForSelect();
        if (!canceled) setAreas(data);
      } catch (e) {
        if (!canceled) setLoadError('Не удалось загрузить локации');
      } finally {
        if (!canceled) setIsLoading(false);
      }
    }
    if (areas === null) {
      fetchAreas();
    }
    return () => {
      canceled = true;
    };
  }, [isOpen]);

  async function handleSelect(areaId: number) {
    if (pendingId) return;
    try {
      setPendingId(areaId);
      setActionError(null);
      const result = await updateCurrentLocation(areaId);
      if (result === true) {
        refreshUser();
        router.refresh();
        onClose();
      }
    } catch (e: any) {
      const message = e?.message || 'Что-то пошло не так, выбранная локация не является финальной(tier = 3)';
      setActionError(message);
    } finally {
      setPendingId(null);
    }
  }

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

  const currentNode = useMemo(() => findById(areas, currentLocationId), [areas, currentLocationId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <h3 className="text-base font-semibold text-neutral-900">Выберите локацию</h3>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            aria-label="Закрыть"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Текущая локация */}
        {currentLocationId && (
          <div className="px-5 py-3 border-b border-neutral-200 bg-blue-50/50">
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-blue-600">
                <path d="M12 2.25c-3.728 0-6.75 3.022-6.75 6.75 0 4.91 5.228 10.247 6.22 11.187a.75.75 0 0 0 1.06 0c.992-.94 6.22-6.278 6.22-11.187 0-3.728-3.022-6.75-6.75-6.75Zm0 9.375a2.625 2.625 0 1 1 0-5.25 2.625 2.625 0 0 1 0 5.25Z" />
              </svg>
              <span>
                Текущая локация: <span className="font-medium text-blue-700">{currentNode?.name}</span>
              </span>
            </div>
          </div>
        )}

        <div className="px-5 py-4 border-b border-neutral-200">
          <div className="relative">
            <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Поиск по названию локации"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          {actionError && (
            <div className="mt-2 text-sm text-red-600">{actionError}</div>
          )}
        </div>

        <div className="px-5 py-4 overflow-y-auto max-h-[50vh]">
          <div className="space-y-6">
            {isLoading && (
              <div className="py-10 text-center text-neutral-500">Загрузка...</div>
            )}

            {loadError && !isLoading && (
              <div className="py-10 text-center text-red-500">{loadError}</div>
            )}

            {!isLoading && !loadError && filteredTree && (
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
                      onSelect={handleSelect}
                      pendingId={pendingId}
                      currentLocationId={currentLocationId}
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
              onClick={onClose}
              className="inline-flex items-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TreeNodeProps {
  node: LocationEntity;
  depth: number;
  onSelect: (id: number) => Promise<void>;
  pendingId: number | null;
  currentLocationId?: number;
}

function TreeNode({ node, depth, onSelect, pendingId, currentLocationId }: TreeNodeProps) {
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
        disabled={pendingId !== null || !isClickable}
        aria-busy={pendingId === node.id}
        className={`group flex w-full items-start justify-between gap-3 rounded-lg border text-left transition-colors ${
          isCurrent
            ? 'border-blue-300 bg-blue-50/60'
            : isClickable
              ? 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              : 'border-neutral-200 bg-neutral-50/60 text-neutral-500 cursor-not-allowed'
        }`}
        style={{ padding: '12px', paddingLeft: `${padding}px` }}
        title={isClickable ? 'Выбрать эту локацию' : 'Выберите более конкретную локацию'}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {node.children && node.children.length > 0 ? (
              <svg className="h-4 w-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span className={`inline-block h-2 w-2 rounded-full ${isClickable ? 'bg-blue-500' : 'bg-neutral-300'}`} />
            )}
            <div className={`truncate font-medium ${isClickable ? 'text-neutral-900' : 'text-neutral-500'}`}>{node.name}</div>
          </div>
        </div>
        {pendingId === node.id ? (
          <svg className="h-5 w-5 animate-spin text-neutral-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        ) : (
          isCurrent ? (
            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : isClickable ? (
            <svg className="h-5 w-5 text-neutral-300 group-hover:text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" strokeWidth="2" />
              <path d="M6 10V8a6 6 0 1112 0v2" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )
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
              pendingId={pendingId}
              currentLocationId={currentLocationId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
