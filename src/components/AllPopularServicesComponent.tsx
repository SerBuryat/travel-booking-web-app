'use client';

import React from 'react';
import { ShortViewServiceComponent } from './ShortViewServiceComponent';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
}

interface AllPopularServicesComponentProps {
  services: Service[];
}

export const AllPopularServicesComponent: React.FC<AllPopularServicesComponentProps> = ({ services }) => {
  return (
    <div className="p-4 pt-2">
      {/* Title */}
      <div className="mb-4">
        <h2 
          className="text-gray-900 font-semibold"
          style={{ 
            fontSize: '20px', 
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Popular services
        </h2>
      </div>
      
      <div className="overflow-y-auto">
        {services.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No popular services found.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => (
                <ShortViewServiceComponent
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
            <div className="h-24" />
          </>
        )}
      </div>
    </div>
  );
}; 