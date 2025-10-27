'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {ServiceType} from '@/model/ServiceType';

interface ShortViewServiceComponentProps {
  service: ServiceType;
  onClick?: (service: ServiceType) => void;
}

export const ShortViewServiceComponent: React.FC<ShortViewServiceComponentProps> = ({ 
  service, 
  onClick 
}) => {
  const router = useRouter();
  // Generate a deterministic gradient for service photo based on service ID
  const getGradientForId = (id: number) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return gradients[id % gradients.length];
  };

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
        style={{ background: getGradientForId(service.id) }}
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