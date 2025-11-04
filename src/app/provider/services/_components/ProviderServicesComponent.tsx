'use client';

import {ServiceType} from '@/model/ServiceType';
import React, {useMemo} from "react";
import {HorizontalViewServiceComponent} from "@/components/HorizontalViewServiceComponent";
import {useRouter, useSearchParams} from 'next/navigation';
import {PAGE_ROUTES} from "@/utils/routes";
import { CategoryEntity } from '@/entity/CategoryEntity';

interface ProviderServicesComponentProps {
  parents: CategoryEntity[];
  parentToServices: Record<number, ServiceType[]>;
}

export default function ProviderServicesComponent({ parents, parentToServices }: ProviderServicesComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategoryParam = searchParams.get('categoryId');
  const selectedParentCategoryId = selectedCategoryParam ? Number(selectedCategoryParam) : undefined;

  const visibleParents = useMemo(() => {
    return parents.filter((p) => (parentToServices[p.id]?.length ?? 0) > 0);
  }, [parents, parentToServices]);

  const handleSelectCategory = (categoryId: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    // set primary correct key; also clear the typo key for consistency
    newParams.set('categoryId', String(categoryId));
    const path = PAGE_ROUTES.PROVIDER.SERVICES;
    router.push(`${path}?${newParams.toString()}`);
  };
  const totalServices = useMemo(() =>
      Object.values(parentToServices)
          .reduce((acc, arr) => acc + arr.length, 0)
      , [parentToServices]
  );

  if (totalServices === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              ID провайдера не найден
            </h3>
            <div className="mt-1 text-sm text-yellow-700">
              <p>
                Не удалось определить ID провайдера. Обратитесь к администратору.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredServices: ServiceType[] = useMemo(() => {
    if (!selectedParentCategoryId) return Object.values(parentToServices).flat();
    return parentToServices[selectedParentCategoryId] ?? [];
  }, [parentToServices, selectedParentCategoryId]);

  return (
    <div className="space-y-3">
      {/* Filter buttons (reference: child category buttons design) */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
          <button
            onClick={() => router.push(PAGE_ROUTES.PROVIDER.SERVICES)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${!selectedParentCategoryId ? 'text-white' : ''}`}
            style={{
              backgroundColor: !selectedParentCategoryId ? '#B0D5FD' : '#F5F5F5',
              color: '#000000',
              fontWeight: 500
            }}
          >
            Все
          </button>

          {visibleParents.map((cat) => {
            const isActive = selectedParentCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${isActive ? 'text-white' : ''}`}
                style={{
                  backgroundColor: isActive ? '#B0D5FD' : '#F5F5F5',
                  color: '#000000',
                  fontWeight: 500
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {filteredServices.map((service) => (
        <HorizontalViewServiceComponent key={service.id} service={service} />
      ))}
    </div>
  );
}
