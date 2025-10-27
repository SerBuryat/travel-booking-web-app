import {CategoryService} from '@/service/CategoryService';
import {CategoryHeaderComponent} from '@/components/CategoryHeaderComponent';
import ServicesClient from './ServicesClient';
import {notFound} from 'next/navigation';
import {servicesForCategories} from "@/lib/service/searchServices";
import React from "react";

interface PageProps {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ childCategoryIds?: string }>;
}

async function CategoryServicesContent({ categoryId, childCategoryIdsParam }: { categoryId: number, childCategoryIdsParam?: string }) {
  const categoryService = new CategoryService();
  const categoryWithRelations = await categoryService.getById(categoryId);
  if (!categoryWithRelations) return notFound();
  
  const childCategoriesIds = categoryWithRelations.children.map((child) => child.id);

  // Parse selected child category IDs from param
  let selectedChildIds: number[] = [];
  if (childCategoryIdsParam) {
    selectedChildIds = childCategoryIdsParam.split(',').map(Number).filter(Boolean);
  }

  // If none selected, use parent + all children; else use parent + selected children
  const serviceCategoryIds =
      selectedChildIds.length > 0
        ? [...selectedChildIds]
        : [categoryId, ...childCategoriesIds];

  const services = await servicesForCategories(serviceCategoryIds);

  return (
    <>
      <div className="pt-4 pb-4">
        <CategoryHeaderComponent name={categoryWithRelations.name} photo={categoryWithRelations.photo} />
      </div>
      <ServicesClient
          category={categoryWithRelations}
          childCategories={categoryWithRelations.children}
          initialServices={services}
          selectedChildIds={selectedChildIds}
      />
    </>
  );
}

export default async function CategoryServicesPage({params, searchParams}: PageProps) {
  const {categoryId} = await params;
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