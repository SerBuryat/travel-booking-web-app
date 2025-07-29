import { getPopularServiceByLikeName, getAllServiceByLikeName } from '@/repository/ServiceRepository';
import { CategoryRepository } from '@/repository/CategoryRepository';
import { getGeneralCategoryCodes } from '@/utils/generalCategories';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import React from 'react';
import ResultView from '@/components/ResultView';

function parseIds(ids: string | undefined): number[] {
  if (!ids) return [];
  return ids.split(',').map((id) => parseInt(id, 10)).filter(Boolean);
}

export default async function ResultPage({ searchParams }: { searchParams: Promise<{ search?: string; ids?: string; showAll?: string }> }) {
  const params = await searchParams;
  const searchValue = params.search || '';
  const ids = parseIds(params.ids);
  const showAll = params.showAll === 'true';
  let services: any[] = [];
  
  const popularServicesCount = 4;
  if (searchValue) {
    if (showAll) {
      services = await getAllServiceByLikeName(searchValue);
    } else {
      services = await getPopularServiceByLikeName(searchValue, popularServicesCount);
    }
  } else if (ids.length > 0) {
    // fallback: fetch by ids
    // You can implement getServicesByIds if needed
    services = [];
  }
  
  const categoryIds = Array.from(new Set(services.map((s: any) => s.tcategories_id)));
  const categories = categoryIds.length > 0 ? await CategoryRepository.getCategoriesByIds(categoryIds) : [];

  // Fetch parent categories for all found services
  const parentCategoryMap: Record<number, any> = {};
  for (const catId of categoryIds) {
    const parent = await CategoryRepository.getCategoryParent(catId);
    if (parent && !parentCategoryMap[parent.id]) {
      parentCategoryMap[parent.id] = parent;
    }
  }
  const parentCategoriesFromServices = Object.values(parentCategoryMap);

  // Fetch general categories for GeneralCategoriesListComponent
  const generalCategoryCodes = getGeneralCategoryCodes();
  const generalCategories = await CategoryRepository.findAllByCodeIn(generalCategoryCodes);
  
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <SearchBar searchValue={searchValue} showCancelButton={true} />
        <ResultView
          searchValue={searchValue}
          services={services}
          categories={[...categories, ...parentCategoriesFromServices]}
          generalCategories={generalCategories}
          showAll={showAll}
        />
      </Header>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 