import { getAllParentCategories } from '@/repository/CategoryRepository';
import { Header } from '@/components/Header';
import Catalog from './Catalog';
import { Suspense } from 'react';

function CatalogSkeleton() {
  return (
    <div className="pt-0 p-10">
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
  );
}

export default async function CatalogPage() {
  const categories = await getAllParentCategories();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <Suspense fallback={<CatalogSkeleton />}>
          <Catalog categories={categories} />
        </Suspense>
      </Header>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 