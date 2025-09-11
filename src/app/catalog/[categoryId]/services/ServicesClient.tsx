'use client';
import React from 'react';
import {ShortViewServiceComponent} from '@/components/ShortViewServiceComponent';
import {HorizontalViewServiceComponent} from '@/components/HorizontalViewServiceComponent';
import {useRouter, useSearchParams} from 'next/navigation';
import {SearchBar} from '@/components/SearchBar';
import {ServiceType} from '@/model/ServiceType';
import {CategoryEntity} from '@/entity/CategoryEntity';
import {ChildCategoryButton} from '@/components/ChildCategoryButton';

interface ServicesClientProps {
  category: CategoryEntity;
  childCategories: CategoryEntity[];
  initialServices: ServiceType[];
  selectedChildIds?: number[];
}

export default function ServicesClient({childCategories, initialServices, selectedChildIds: initialSelectedChildIds = [] }: ServicesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Use the selectedChildIds from props, not local state
  const selectedChildIds = initialSelectedChildIds;

  const handleChildCategoryClick = (id: number) => {
    let newSelected: number[];
    if (selectedChildIds.includes(id)) {
      newSelected = selectedChildIds.filter(cid => cid !== id);
    } else {
      newSelected = [...selectedChildIds, id];
    }
    const params = new URLSearchParams(searchParams.toString());
    if (newSelected.length > 0) {
      params.set('childCategoryIds', newSelected.join(','));
    } else {
      params.delete('childCategoryIds');
    }
    router.push(`?${params.toString()}`);
    // Page will reload with new params
  };

  // Check if any child categories are selected
  const hasSelectedChildCategories = selectedChildIds.length > 0;

  return (
    <>
      {/* Child Category Buttons */}
      {childCategories.length > 0 && (
        <div className="px-4 pb-2 overflow-x-auto">
          <div className="flex flex-row w-full" style={{ overflowX: 'auto' }}>
            {childCategories.map((cat) => {
              const active = selectedChildIds.includes(cat.id);
              return (
                <ChildCategoryButton
                  key={cat.id}
                  category={cat}
                  active={active}
                  onClick={() => handleChildCategoryClick(cat.id)}
                />
              );
            })}
          </div>
        </div>
      )}
      <div className="px-4 pt-4 pb-6">
        <SearchBar searchValue="" />
      </div>
      {/* Title - changes based on selection */}
      <div className="px-4 pb-3 pl-6">
        <h2 className="text-[13px] font-normal" style={{ fontFamily: 'Inter, sans-serif', color: '#707579' }}>
          {hasSelectedChildCategories ? `Found: ${initialServices.length}` : 'For you'}
        </h2>
      </div>
      {/* Services - different layout based on selection */}
      <div className="px-4 pb-32">
        {hasSelectedChildCategories ? (
          // Horizontal layout when child categories are selected
          <div className="space-y-3">
            {initialServices.map((service) => (
              <HorizontalViewServiceComponent key={service.id} service={service} />
            ))}
          </div>
        ) : (
          // Grid layout when no child categories are selected
          <div className="grid grid-cols-2 gap-3">
            {initialServices.map((service) => (
              <ShortViewServiceComponent key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </>
  );
} 