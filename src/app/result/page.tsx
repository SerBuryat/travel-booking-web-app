import { ServiceService } from '@/service/ServiceService';
import { CategoryService } from '@/service/CategoryService';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import React from 'react';
import ResultView from '@/components/ResultView';

export default async function ResultPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const params = await searchParams;
  const searchValue = params.search || '';
  let services: any[] = [];
  
  const popularServicesCount = 4;
  if (searchValue) {
    services = await ServiceService.getPopularServicesByName(searchValue, popularServicesCount);
  }
  
  // Extract categories from services with relations
  const categories = services
    .map(service => service.category)
    .filter(Boolean)
    .reduce((unique: any[], category: any) => {
      if (!unique.find(c => c.id === category.id)) {
        unique.push(category);
      }
      return unique;
    }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <SearchBar searchValue={searchValue} showCancelButton={true} />
      </Header>
      <ResultView
          searchValue={searchValue}
          services={services}
          categories={categories}
        />
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 