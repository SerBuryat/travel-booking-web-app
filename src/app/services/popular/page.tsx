import { ServiceService } from '@/service/ServiceService';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { AllPopularServicesComponent } from '@/components/AllPopularServicesComponent';

export default async function PopularServicesPage() {
  const popularServices = await ServiceService.getPopularServices(10);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <SearchBar searchValue="" />
        <AllPopularServicesComponent services={popularServices} />
      </Header>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 