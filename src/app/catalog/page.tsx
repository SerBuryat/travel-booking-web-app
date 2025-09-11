import {Header} from '@/components/Header';
import {SearchBar} from '@/components/SearchBar';
import Catalog from "@/app/catalog/Catalog";

export default async function CatalogPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <SearchBar searchValue="" />
      </Header>
      <div className="pb-20">
        <Catalog />
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 