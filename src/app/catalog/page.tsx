import { getCategoriesByCodeIn } from '@/repository/CategoryRepository';
import { getPopularServices } from '@/repository/ServiceRepository';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import Catalog from "@/app/catalog/Catalog";
import { getGeneralCategoryCodes } from '@/utils/generalCategories';

export default async function CatalogPage() {
  const generalCategoryCodes = getGeneralCategoryCodes();
  const categories = await getCategoriesByCodeIn(generalCategoryCodes);
  const popularServices = await getPopularServices(6);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <SearchBar searchValue="" />
        <Catalog categories={categories} popularServices={popularServices} />
      </Header>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 