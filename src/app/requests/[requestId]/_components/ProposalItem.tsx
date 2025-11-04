'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProposalView } from '@/lib/request/client/proposal/getRequestProposals';

interface ProposalItemProps {
  proposal: ProposalView;
}

export default function ProposalItem({ proposal }: ProposalItemProps) {
  const router = useRouter();

  const formatPrice = (price: string | null) => {
    if (!price) return 'Цена не указана';
    return `${price} ₽`;
  };

  const truncateComment = (comment: string | null, maxLength: number = 100) => {
    if (!comment) return null;
    return comment.length > maxLength ? `${comment.slice(0, maxLength)}...` : comment;
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleServiceClick = (serviceId: number) => {
    router.push(`/services/${serviceId}`);
  };

  return (
    <div className="space-y-4">
      {proposal.services.map((serviceItem) => {
        const service = serviceItem.service;
        
        return (
          <div key={serviceItem.id} className="bg-white rounded-[24px]">
            {/* Верхний блок с информацией о предложении */}
            <div className="p-4">
              {/* Название сервиса */}
              <div className="mb-4">
                <h3
                  className="text-black font-semibold"
                  style={{ fontWeight: 600, fontSize: '17px' }}
                >
                  {service.name}
                </h3>
              </div>

              {/* Предложенная цена */}
              <div className="flex justify-between items-start mb-3">
                <span style={{ fontSize: '13px', fontWeight: 400, color: '#707579' }}>
                  Предложенная цена
                </span>
                <span style={{ fontSize: '17px', fontWeight: 600, color: '#007AFF' }}>
                  {formatPrice(serviceItem.price)}
                </span>
              </div>

              {/* Стандартная цена объекта */}
              <div className="flex justify-between items-start mb-3">
                <span style={{ fontSize: '13px', fontWeight: 400, color: '#707579' }}>
                  Стандартная цена объекта
                </span>
                <span style={{ fontSize: '17px', fontWeight: 600, color: '#007AFF' }}>
                  {serviceItem.originalPrice} ₽
                </span>
              </div>

              {/* Комментарий */}
              {proposal.comment && (
                <div className="flex justify-between items-start mb-4">
                  <span style={{ fontSize: '13px', fontWeight: 400, color: '#707579' }}>
                    Комментарий
                  </span>
                  <span
                    className="text-right ml-4"
                    style={{ fontSize: '13px', fontWeight: 400, color: '#000000', maxWidth: '70%' }}
                  >
                    {truncateComment(proposal.comment)}
                  </span>
                </div>
              )}
            </div>

            {/* Встроенный код из HorizontalViewServiceComponent */}
            <div 
              className="bg-white rounded-[24px] overflow-hidden cursor-pointer mb-3"
              onClick={() => handleServiceClick(service.id)}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <div className="flex h-50">
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
                  {/* Top section: address */}
                  <div className="mb-2">
                    <p
                      className="text-xs"
                      style={{ color: '#707579', fontWeight: 400 }}
                    >
                      {truncateText(service.address, 50)}
                    </p>
                  </div>
                  
                  {/* Middle section: description */}
                  <div className="mb-3">
                    <p 
                      className="text-xs leading-relaxed"
                      style={{ color: '#333333', fontWeight: 400 }}
                    >
                      {truncateText(service.description, 75)}
                    </p>
                  </div>
                   
                  {/* Tags section - horizontal scrollable */}
                  <div className="mb-3 overflow-x-auto scrollbar-hide">
                    <div className="inline-flex gap-2">
                      {service.options?.map((tag, index) => (
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
                      style={{ color: '#007AFF', fontWeight: 600, fontSize: "17px" }}
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
                      style={{ color: '#007AFF', fontWeight: 600, fontSize: "17px" }}
                    >
                      {service.price} ₽
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

