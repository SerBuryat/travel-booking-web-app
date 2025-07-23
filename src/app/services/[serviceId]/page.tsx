import React, { Suspense } from 'react';
import { getServiceById } from '@/repository/ServiceRepository';
import SingleServiceView, { SingleServiceViewLoadingSkeleton } from './SingleServiceView';

export default async function ServicePage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params;
  const id = Number(serviceId);
  if (isNaN(id)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
          <p className="text-gray-500">Invalid service ID</p>
        </div>
      </div>
    );
  }
  const service = await getServiceById(id);
  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
          <p className="text-gray-500">Service does not exist</p>
        </div>
      </div>
    );
  }
  return (
    <Suspense fallback={<SingleServiceViewLoadingSkeleton />}> 
      <SingleServiceView service={service} />
    </Suspense>
  );
} 