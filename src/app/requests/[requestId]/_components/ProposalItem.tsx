'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProposalView } from '@/lib/request/client/proposal/getRequestProposals';
import { PAGE_ROUTES } from '@/utils/routes';
import { ServiceTypeFull } from '@/model/ServiceType';
import { getServiceById } from '@/lib/service/searchServices';

interface ProposalItemProps {
  proposal: ProposalView;
}

export default function ProposalItem({ proposal }: ProposalItemProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceTypeFull | null>(null);

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

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleContactClick = async (serviceId: number) => {
    try {
      const res = await fetch(`/api/services/${serviceId}/click`, { method: 'POST' });
      if (res.status === 401) {
        router.push(PAGE_ROUTES.TELEGRAM_AUTH);
        return;
      }
      
      // Загружаем полную информацию о сервисе с контактами
      const fullService = await getServiceById(serviceId);
      setSelectedService(fullService);
    } catch (e) {
      // ignore for MVP
    } finally {
      openModal();
    }
  };

  const handleDetailsClick = (serviceId: number) => {
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
              className="bg-white rounded-[24px] overflow-hidden mb-3"
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

            {/* Кнопки действий */}
            <div className="flex gap-3 px-4 pb-4">
              <button
                onClick={() => handleContactClick(service.id)}
                className="flex-1 py-3 text-black rounded-full"
                style={{ 
                  backgroundColor: '#95E59D', 
                  fontSize: '17px', 
                  fontWeight: 400 
                }}
              >
                Связаться
              </button>
              <button
                onClick={() => handleDetailsClick(service.id)}
                className="flex-1 py-3 rounded-full"
                style={{ 
                  border: '1px solid black',
                  color: 'black',
                  backgroundColor: 'white',
                  fontSize: '17px', 
                  fontWeight: 400 
                }}
              >
                Подробнее
              </button>
            </div>
          </div>
        );
      })}

      {/* Contacts Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center" style={{ zIndex: 60 }}>
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 m-0 sm:m-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Контакты</h3>
              <button onClick={closeModal} className="text-gray-500">✕</button>
            </div>
            {selectedService.contacts && selectedService.contacts.length > 0 ? (
              <div className="space-y-3">
                {selectedService.contacts.map((c) => (
                  <div key={c.id} className="rounded-lg border border-gray-100 p-4">
                    {c.phone && <div className="text-sm text-gray-700"><span className="font-medium">Телефон:</span> {c.phone}</div>}
                    {c.email && <div className="text-sm text-gray-700"><span className="font-medium">Email:</span> {c.email}</div>}
                    {c.tg_username && <div className="text-sm text-gray-700"><span className="font-medium">Telegram:</span> @{c.tg_username}</div>}
                    {c.whatsap && <div className="text-sm text-gray-700"><span className="font-medium">WhatsApp:</span> {c.whatsap}</div>}
                    {c.website && <div className="text-sm text-blue-600"><a href={c.website} target="_blank" rel="noreferrer">Сайт</a></div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">Контактная информация недоступна</div>
            )}
            <div className="mt-6">
              <button onClick={closeModal} className="w-full py-3 rounded-xl bg-gray-100 text-gray-700">Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

