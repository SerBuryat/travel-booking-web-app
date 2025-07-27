import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';

export default function ResultLoading() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header>
        <SearchBar searchValue="" showCancelButton={true} />
        <div className="w-full max-w-3xl mx-auto pt-8 px-4 bg-white">
          {/* Loading skeleton for category buttons */}
          <div className="flex flex-wrap mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-200 rounded-[10px] mr-2 mb-2 animate-pulse"
              />
            ))}
          </div>
          
          {/* Loading skeleton for Popular section */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          
          {/* Loading skeleton for services grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                {/* Service image skeleton */}
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 animate-pulse" />
                {/* Service name skeleton */}
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
                {/* Service description skeleton */}
                <div className="h-3 w-full bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-3 w-2/3 bg-gray-200 rounded mb-2 animate-pulse" />
                {/* Service price skeleton */}
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
          
          {/* Loading skeleton for catalog section */}
          <div className="pt-0 p-10">
            <div className="overflow-y-auto">
              <ul>
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="relative mb-4">
                    <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
                      {/* Category image skeleton */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 animate-pulse" />
                      {/* Category content skeleton */}
                      <div className="flex-1">
                        <div className="h-5 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                      </div>
                      {/* Arrow skeleton */}
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Header>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
} 