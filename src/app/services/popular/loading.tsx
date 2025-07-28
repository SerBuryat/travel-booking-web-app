import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <SearchBar searchValue="" />
        <div className="p-4 pt-2">
          <div className="text-center py-8 text-gray-400">Loading popular services...</div>
        </div>
      </Header>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 