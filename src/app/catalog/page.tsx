'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryItem } from '@/components/CategoryItem';
import { SearchBar } from '@/components/SearchBar';
import { Header } from '@/components/Header';

interface Category {
  id: number;
  name: string;
  code: string;
  photo?: string | null;
}

export default function CatalogPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetch('/api/catalog/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data || []);
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (category: Category) => {
    router.push(`/catalog/${category.id}/services`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Header>
          <SearchBar value={searchValue} onChange={setSearchValue} />
          {searchValue && (
            <div className="mt-2 text-sm text-gray-500 text-center">
              You typed: "{searchValue}"
            </div>
          )}
        </Header>
        <div className="px-4 pb-32">
          <div className="max-w-xs mx-auto">
            <div className="overflow-y-auto">
              <ul>
                {[...Array(8)].map((_, index) => (
                  <li key={index} className="relative">
                    <div className="bg-white rounded-[10px] overflow-hidden shadow-sm border">
                      <div className="flex">
                        <div className="w-24 h-24 bg-gray-200 animate-pulse flex-shrink-0"></div>
                        <div className="flex-1 p-4 border-l border-gray-100">
                          <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        </div>
                      </div>
                    </div>
                    {index < 7 && <div className="h-px bg-gray-100 my-4"></div>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
      </div>
    );
  }

  const filteredCategories = searchValue
    ? categories.filter(cat =>
        cat.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : categories;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <SearchBar value={searchValue} onChange={setSearchValue} />
        {searchValue && (
          <div className="mt-2 text-sm text-gray-500 text-center">
            You typed: "{searchValue}"
          </div>
        )}
      </Header>
      <div className="pt-0 p-10">
        <div className="overflow-y-auto">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No categories found.</div>
          ) : (
            <>
              <ul>
                {filteredCategories.map((cat) => (
                  <li key={cat.id} className="relative">
                    <CategoryItem {...cat} onClick={handleCategoryClick} />
                  </li>
                ))}
              </ul>
              {/* Spacer to prevent last item from being hidden by navbar */}
              <div className="h-24" />
            </>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 