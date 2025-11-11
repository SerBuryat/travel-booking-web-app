'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {ServiceType} from '@/model/ServiceType';

interface ShortViewServiceComponentProps {
  service: ServiceType;
  onClick?: (service: ServiceType) => void;
}

export const ShortViewServiceComponent: React.FC<ShortViewServiceComponentProps> = ({ 
  service, onClick
}) => {
  const router = useRouter();

  // Truncate description if too long
  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleClick = () => {
    if (onClick) {
      onClick(service);
    } else {
      // Navigate to service page
      router.push(`/services/${service.id}`);
    }
  };

  return (
    <div 
      className="bg-white rounded-[24px] overflow-hidden shadow-lg cursor-pointer w-40"
      onClick={handleClick}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Service photo header */}
      <div 
        className="h-40 w-full"
        style={{
          backgroundImage: `url(${service.preview_photo_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
      }}
      ></div>
      
      {/* Service content */}
      <div className="p-3">
        <h3 
          className="text-black font-semibold mb-1 line-clamp-2"
          style={{ fontWeight: 600 }}
        >
          {service.name}
        </h3>
        <p 
          className="text-xs leading-relaxed"
          style={{ color: '#707579', fontWeight: 400 }}
        >
          {truncateDescription(service.description)}
        </p>
      </div>
    </div>
  );
}; 