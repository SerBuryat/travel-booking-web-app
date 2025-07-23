import { getCategoryById, getChildCategories } from '@/repository/CategoryRepository';
import { getServicesByCategoryIds } from '@/repository/ServiceRepository';
import { Header } from '@/components/Header';
import { CategoryHeaderComponent } from '@/components/CategoryHeaderComponent';
import ServicesClient from './ServicesClient';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface PageProps {
  params: { categoryId: string };
}

function CategoryHeaderSkeleton() {
  return (
    <div className="px-4 pt-8 pb-4">
      <div className="max-w-md mx-auto">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
      </div>
    </div>
  );
}

function ServicesSkeleton() {
  return (
    <>
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
    </>
  );
}

async function CategoryServicesContent({ categoryId }: { categoryId: number }) {
  const category = await getCategoryById(categoryId);
  if (!category) return notFound();
  
  const childCategories = await getChildCategories(categoryId);
  const childCategoriesIds = childCategories.map((category) => category.id);
  const services = await getServicesByCategoryIds([categoryId, ...childCategoriesIds]);

  return (
    <>
      <div className="px-4 pt-8 pb-4">
        <CategoryHeaderComponent name={category.name} photo={category.photo} />
      </div>
      <ServicesClient
        category={category}
        childCategories={childCategories}
        initialServices={services}
      />
    </>
  );
}

export default async function CategoryServicesPage({ params }: PageProps) {
  const categoryId = Number(params.categoryId);
  if (isNaN(categoryId)) return notFound();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header><></></Header>
      <Suspense fallback={<CategoryHeaderSkeleton />}>
        <Suspense fallback={<ServicesSkeleton />}>
          <CategoryServicesContent categoryId={categoryId} />
        </Suspense>
      </Suspense>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 