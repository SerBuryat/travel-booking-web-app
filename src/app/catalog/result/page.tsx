import {Header} from '@/components/Header';
import {SearchBar} from '@/components/SearchBar';
import React from 'react';
import ResultView from '@/components/ResultView';
import {GeneralCategoriesListComponent} from '@/components/GeneralCategoriesListComponent';
import {searchServices} from "@/lib/service/searchServices";

export default async function ResultPage({ searchParams }:
{ searchParams: Promise<{ search?: string; categoryId?: string }> }) {

  const params = await searchParams;

  // Достаем категории из параметров
  const categoriesIds =
      params.categoryId
          ? params.categoryId.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
          : [];

  // Ищем сервисы
  const searchValue = params.search;
  const services =
      searchValue ? await searchServices(searchValue, { categoryIds: categoriesIds }) : []

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <SearchBar searchValue={searchValue} showCancelButton={true} />
      </Header>
      <ResultView
          searchValue={searchValue}
          selectedCategoryIds={categoriesIds}
          services={services}
        />
      <GeneralCategoriesListComponent />
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 