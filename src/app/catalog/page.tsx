import { getAllParentCategories } from '@/repository/CategoryRepository';
import { Header } from '@/components/Header';
import Catalog from './Catalog';

export default async function CatalogPage() {
  const categories = await getAllParentCategories();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <Catalog categories={categories} />
      </Header>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 