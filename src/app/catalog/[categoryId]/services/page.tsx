'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { CategoryHeaderComponent } from '@/components/CategoryHeaderComponent';
import { ShortViewServiceComponent } from '@/components/ShortViewServiceComponent';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
}

interface Category {
  id: number;
  name: string;
  code: string;
  photo?: string | null;
}

// ChildCategoryButton component
const ChildCategoryButton = ({ category, active, onClick }: { category: any, active: boolean, onClick: () => void }) => (
  <button
    className="px-4 py-2 rounded-[10px] mr-2 whitespace-nowrap"
    style={{
      background: active ? '#007AFF4D' : '#0000000A',
      fontSize: '13px',
      fontWeight: 600,
      color: active ? '#007AFF' : '#333',
      border: 'none',
      outline: 'none',
      transition: 'background 0.2s',
    }}
    onClick={onClick}
    type="button"
  >
    {category.name}
  </button>
);

export default function CategoryServicesPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  
  const [services, setServices] = useState<Service[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');

  // Fetch category and child categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category details
        const categoryRes = await fetch(`/api/catalog/${categoryId}`);
        const categoryData = await categoryRes.json();
        if (!categoryData.success) {
          setError('Category not found');
          return;
        }
        setCategory(categoryData.data);
        // Fetch child categories
        const childRes = await fetch(`/api/catalog/${categoryId}/categories`);
        const childData = await childRes.json();
        if (childData.success) {
          setChildCategories(childData.data);
        }
      } catch (err) {
        setError('Failed to load data');
      }
    };
    fetchData();
  }, [categoryId]);

  // Fetch services based on selected child categories or parent
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        let url = '';
        if (selectedChildIds.length > 0) {
          url = `/api/catalog/services?categoryIds=${selectedChildIds.join(',')}`;
        } else {
          url = `/api/catalog/${categoryId}/services`;
        }
        const servicesRes = await fetch(url);
        const servicesData = await servicesRes.json();
        if (servicesData.success) {
          setServices(servicesData.data);
        }
      } catch (err) {
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [categoryId, selectedChildIds]);


  if (loading) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Category Header Skeleton */}
        <div className="px-4 pt-8 pb-4">
          <div className="max-w-md mx-auto">
            <div className="h-32 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
          </div>
        </div>
        
        {/* Search Bar Skeleton */}
        <div className="px-4 pb-4">
          <div className="max-w-md mx-auto">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
        
        {/* Services Grid Skeleton */}
        <div className="px-4 pb-32">
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-[10px] overflow-hidden shadow-sm border">
                  <div className="h-24 bg-gray-200 animate-pulse"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* White blur effect near navbar */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-white">
        <Header>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
          </div>
        </Header>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Category Header */}
      <div className="px-4 pt-8 pb-4">
        <CategoryHeaderComponent name={category.name} photo={category.photo} />
      </div>
      {/* Child Category Buttons */}
      {childCategories.length > 0 && (
        <div className="px-4 pb-2 overflow-x-auto">
          <div className="flex flex-row w-full" style={{ overflowX: 'auto' }}>
            {childCategories.map((cat) => {
              const catIdStr = String(cat.id);
              return (
                <ChildCategoryButton
                  key={catIdStr}
                  category={cat}
                  active={selectedChildIds.includes(catIdStr)}
                  onClick={() => {
                    setSelectedChildIds((prev) =>
                      prev.includes(catIdStr)
                        ? prev.filter((id) => id !== catIdStr)
                        : [...prev, catIdStr]
                    );
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
      {/* Search Bar */}
      <div className="px-4 pb-4">
        <SearchBar value={searchValue} onChange={setSearchValue} />
        {searchValue && (
          <div className="mt-2 text-sm text-gray-500 text-center">
            You typed: "{searchValue}"
          </div>
        )}
      </div>
      {/* Services Grid */}
      <div className="px-4 pb-32">
        <div className="max-w-md mx-auto">
          {services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No services found in this category
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 overflow-y-auto">
              {services.map((service) => (
                <ShortViewServiceComponent
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* White blur effect near navbar */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 