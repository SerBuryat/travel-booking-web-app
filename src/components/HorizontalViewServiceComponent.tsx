'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {ServiceType} from '@/model/ServiceType';

interface HorizontalViewServiceComponentProps {
  service: ServiceType;
  onClick?: (service: ServiceType) => void;
}

export const HorizontalViewServiceComponent: React.FC<HorizontalViewServiceComponentProps> = ({ 
  service, onClick
}) => {
  const router = useRouter();

  // Truncate description if too long
  const truncateDescription = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleClick = () => {
    if (onClick) {
      onClick(service);
    } else {
      router.push(`/services/${service.id}`);
    }
  };

  return (
    <div 
      className="bg-white rounded-[24px] overflow-hidden shadow-lg border cursor-pointer hover:shadow-md transition-shadow mb-3"
      onClick={handleClick}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="flex h-52">
        {/* Service photo - 1/4 width */}
        <div 
          className="w-1/4 h-full"
          style={{
            backgroundImage: `url(${service.preview_photo_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
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
              {service.address}
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
               {service.options.map((tag, index) => (
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
                 {
                   service.rating && service.view_count > 0
                       ? `${service.rating}/5`
                       : 'Нет оценок'
                 }
               </span>
              {/* Price on the right */}
              <span 
                className="text-xs font-semibold"
                style={{ color: '#007AFF', fontWeight: 600 }}
              >
                {service.price} ₽
              </span>
            </div>
        </div>
      </div>
    </div>
  );
}; 