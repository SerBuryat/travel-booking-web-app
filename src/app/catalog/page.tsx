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
        setCategories(data.data || []);
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (category: Category) => {
    // Navigate to services page using Next.js router
    router.push(`/catalog/${category.id}/services`);
  };



  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <SearchBar value={searchValue} onChange={setSearchValue} />
        {searchValue && (
          <div className="mt-2 text-sm text-gray-500 text-center">
            You typed: &#34;{searchValue}&#34;
          </div>
        )}
      </Header>
      
      {/* Categories List */}
      <div className="px-4 pb-32">
        <div className="max-w-xs mx-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading categories...</div>
          ) : (
            <div className="overflow-y-auto">
              {categories.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No categories found.</div>
              ) : (
                <ul>
                  {categories.map((cat) => (
                    <li key={cat.id} className="relative">
                      <CategoryItem {...cat} onClick={handleCategoryClick} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* White blur effect near navbar */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 