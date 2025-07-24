import { getAllServiceByLikeName } from '@/repository/ServiceRepository';
import { getCategoriesByIds, getAllParentCategories, getCategoryParent } from '@/repository/CategoryRepository';
import SearchedServicesView from '@/components/SearchedServicesView';
import React from 'react';

function parseIds(ids: string | undefined): number[] {
  if (!ids) return [];
  return ids.split(',').map((id) => parseInt(id, 10)).filter(Boolean);
}

export default async function CatalogServicesPage({ searchParams }: { searchParams: { search?: string; ids?: string } }) {
  const search = searchParams.search || '';
  const ids = parseIds(searchParams.ids);
  let services: any[] = [];
  if (search && search.length >= 3) {
    services = await getAllServiceByLikeName(search);
  } else if (ids.length > 0) {
    // fallback: fetch by ids
    // You can implement getServicesByIds if needed
    services = [];
  }
  const categoryIds = Array.from(new Set(services.map((s: any) => s.tcategories_id)));
  const categories = categoryIds.length > 0 ? await getCategoriesByIds(categoryIds) : [];

  // Fetch parent categories for all found tservices
  const parentCategoryMap: Record<number, any> = {};
  for (const catId of categoryIds) {
    const parent = await getCategoryParent(catId);
    if (parent && !parentCategoryMap[parent.id]) {
      parentCategoryMap[parent.id] = parent;
    }
  }
  const parentCategoriesFromServices = Object.values(parentCategoryMap);

  // Optionally fetch all parent categories for Catalog.tsx
  const parentCategories = await getAllParentCategories();
  return (
    <SearchedServicesView
      search={search}
      services={services}
      categories={[...categories, ...parentCategoriesFromServices]}
      parentCategories={parentCategories}
    />
  );
} 