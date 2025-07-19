'use client';

import React, { useEffect, useState } from 'react';
import { CategoryItem } from '@/components/CategoryItem';
import { SearchBar } from '@/components/SearchBar';
import { Header } from '@/components/Header';

interface Category {
  id: number;
  name: string;
  code: string;
  photo?: string | null;
}

interface Service {
  id: number;
  description: string;
  tcategories_id: number;
  price: string;
}

export default function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<Category | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
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
    setModalCategory(category);
    setModalOpen(true);
    setServices([]);
    setServicesError(null);
    setServicesLoading(true);
    fetch(`/api/catalog/services?tcategories_id=${category.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setServices(data.data);
        } else {
          setServicesError('Failed to load services');
        }
      })
      .catch(() => setServicesError('Failed to load services'))
      .finally(() => setServicesLoading(false));
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalCategory(null);
    setServices([]);
    setServicesError(null);
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
      
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative" style={{ fontFamily: 'Inter, sans-serif' }}>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={closeModal}>&times;</button>
            <h2 className="text-xl font-semibold mb-2">Services for: {modalCategory?.name}</h2>
            {servicesLoading ? (
              <div className="text-center py-4 text-gray-400">Loading services...</div>
            ) : servicesError ? (
              <div className="text-center py-4 text-red-500">{servicesError}</div>
            ) : services.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                no services found for category: {modalCategory?.id} - {modalCategory?.code} - {modalCategory?.name}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {services.map((s) => (
                  <li key={s.id} className="py-2">
                    <div className="font-medium">{s.description}</div>
                    <div className="text-sm text-gray-500">Price: {s.price}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 