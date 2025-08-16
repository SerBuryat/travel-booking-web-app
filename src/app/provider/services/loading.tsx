export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="mt-2 h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
              <div className="mt-1 h-3 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
              <div className="mt-6">
                <div className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-300 animate-pulse">
                  <div className="h-4 w-32 bg-gray-400 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
