"use client";
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {PopularServicesComponent} from './PopularServicesComponent';
import {ServiceType} from '@/model/ServiceType';
import {CategoryEntity} from '@/entity/CategoryEntity';
import {ChildCategoryButton} from './ChildCategoryButton';

interface ResultViewProps {
  searchValue: string;
  services: ServiceType[];
  selectedCategoryIds: number[];
}

export default function ResultView({ searchValue, services, selectedCategoryIds }: ResultViewProps) {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<number[]>(selectedCategoryIds);

  const handleCategoryClick = (categoryId: number) => {
    let newSelectedCategories: number[];
    
    if (selectedCategories.includes(categoryId)) {
      // Remove category if already selected
      newSelectedCategories = selectedCategories.filter(id => id !== categoryId);
    } else {
      // Add category if not selected
      newSelectedCategories = [...selectedCategories, categoryId];
    }
    
    setSelectedCategories(newSelectedCategories);
    
    // Build query parameters
    const params = new URLSearchParams();
    if (searchValue) {
      params.set('search', searchValue);
    }
    if (newSelectedCategories.length > 0) {
      params.set('categoryId', newSelectedCategories.join(','));
    }
    
    // Navigate to new URL
    const queryString = params.toString();
    router.push(`/catalog/result${queryString ? `?${queryString}` : ''}`);
  };

  // Достаем уникальные категории из сервисов
  const uniqueCategories =
      services.map(service => service.category)
      .filter(Boolean)
      .reduce((unique: any[], category: any) => {
        if (!unique.find(c => c.id === category.id)) {
          unique.push(category);
        }
        return unique;
      }, []);

  return (
    <div className="w-full max-w-3xl mx-auto pt-4 px-4 bg-white">
      {/* Categories list */}
      {uniqueCategories.length > 0 && (
        <div className="flex flex-wrap">
          {uniqueCategories.map((cat: CategoryEntity) => (
            <ChildCategoryButton
              key={cat.id}
              category={cat}
              active={selectedCategories.includes(cat.id)}
              onClick={() => handleCategoryClick(cat.id)}
            />
          ))}
        </div>
      )}
      
      <PopularServicesComponent services={services} />

    </div>
  );
} 