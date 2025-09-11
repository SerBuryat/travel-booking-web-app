'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {ServiceType} from '@/model/ServiceType';

interface HorizontalViewServiceComponentProps {
  service: ServiceType;
  onClick?: (service: ServiceType) => void;
}

export const HorizontalViewServiceComponent: React.FC<HorizontalViewServiceComponentProps> = ({ 
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
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Mock tags for demonstration
  const getMockTags = (id: number) => {
    const allTags = ['Wi-Fi', 'Meal', 'Parking', '24/7', 'Premium'];
    const numTags = 2 + (id % 3); // 2-4 tags
    return allTags.slice(0, numTags);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(service);
    } else {
      // Navigate to service page
      router.push(`/services/${service.id}`);
    }
  };

  const tags = getMockTags(service.id);
  // Use actual rating from service data
  const rating = service.rating;

  return (
    <div 
      className="bg-white rounded-[24px] overflow-hidden shadow-sm border cursor-pointer hover:shadow-md transition-shadow mb-3"
      onClick={handleClick}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
             <div className="flex h-48">
        {/* Service photo - 1/4 width */}
        <div 
          className="w-1/4 h-full"
          style={{ background: getGradientForId(service.id) }}
        ></div>
        
        {/* Service content - 3/4 width */}
        <div className="w-3/4 p-4 flex flex-col justify-between">
          {/* Top section: name and address */}
          <div className="mb-2">
                         <h3 
               className="text-black font-semibold mb-1 line-clamp-1"
               style={{ fontWeight: 600, fontSize: '17px' }}
             >
               {service.name}
             </h3>
            <p 
              className="text-xs"
              style={{ color: '#707579', fontWeight: 400 }}
            >
              {service.description.split(' ').slice(0, 3).join(' ')} • 2.5 km away
            </p>
          </div>
          
                     {/* Middle section: description */}
           <div className="mb-3">
             <p 
               className="text-xs leading-relaxed"
               style={{ color: '#333333', fontWeight: 400 }}
             >
               {truncateDescription(service.description)}
             </p>
           </div>
           
           {/* Tags section - horizontal scrollable */}
           <div className="mb-3 overflow-x-auto">
             <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
               {tags.map((tag, index) => (
                 <span
                   key={index}
                   className="px-3 py-1 rounded-full text-xs whitespace-nowrap"
                   style={{ 
                     backgroundColor: '#F5F5F5', 
                     color: '#707579',
                     fontWeight: 400
                   }}
                 >
                   {tag}
                 </span>
               ))}
             </div>
           </div>
           
                       {/* Bottom section: rating and price */}
            <div className="flex items-center justify-between">
              {/* Rating on the left */}
                             <span 
                 className="text-xs font-semibold"
                 style={{ color: '#007AFF', fontWeight: 600 }}
               >
                 {rating ? `${rating}/5` : 'N/A'}
               </span>
              {/* Price on the right */}
              <span 
                className="text-xs font-semibold"
                style={{ color: '#007AFF', fontWeight: 600 }}
              >
                ${service.price}
              </span>
            </div>
        </div>
      </div>
    </div>
  );
}; 