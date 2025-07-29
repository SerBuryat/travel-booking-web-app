import { CategoryRepository } from '@/repository/CategoryRepository';
import { getServicesByCategoryIds } from '@/repository/ServiceRepository';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { CategoryHeaderComponent } from '@/components/CategoryHeaderComponent';
import ServicesClient from './ServicesClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ childCategoryIds?: string }>;
}

async function CategoryServicesContent({ categoryId, childCategoryIdsParam }: { categoryId: number, childCategoryIdsParam?: string }) {
  const category = await CategoryRepository.getCategoryById(categoryId);
  if (!category) return notFound();
  const childCategories = await CategoryRepository.findAllByParentId(categoryId);
  const childCategoriesIds = childCategories.map((category) => category.id);

  // Parse selected child category IDs from param
  let selectedChildIds: number[] = [];
  if (childCategoryIdsParam) {
    selectedChildIds = childCategoryIdsParam.split(',').map(Number).filter(Boolean);
  }

  // If none selected, use parent + all children; else use parent + selected children
  const serviceCategoryIds =
      selectedChildIds.length > 0
        ? [categoryId, ...selectedChildIds]
        : [categoryId, ...childCategoriesIds];
  const services = await getServicesByCategoryIds(serviceCategoryIds);

  return (
    <>
      <div className="px-4 pt-8 pb-4">
        <CategoryHeaderComponent name={category.name} photo={category.photo} />
      </div>
      <ServicesClient
        category={category}
        childCategories={childCategories}
        initialServices={services}
        selectedChildIds={selectedChildIds}
      />
    </>
  );
}

export default async function CategoryServicesPage({ params, searchParams }: PageProps) {
  const { categoryId } = await params;
  const resolvedSearchParams = await searchParams;
  const childCategoryIdsParam = resolvedSearchParams?.childCategoryIds;
  const categoryIdNum = Number(categoryId);
  if (isNaN(categoryIdNum)) return notFound();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <CategoryServicesContent categoryId={categoryIdNum} childCategoryIdsParam={childCategoryIdsParam} />
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 