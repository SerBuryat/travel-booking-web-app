'use client';
import React, {useCallback, useState} from 'react';
import {ImageCarousel} from '@/components/ImageCarousel';
import {ServiceTypeFull} from '@/model/ServiceType';
import {useRouter} from 'next/navigation';
import {PAGE_ROUTES} from '@/utils/routes';
import {DEFAULT_SERVICE_IMAGE_3} from '@/utils/images';
import {createOrUpdateClick} from '@/lib/service/clickService';
import ContactsModal from '@/components/ContactsModal';
import {formatRating} from '@/utils/rating';
import {formatDateTime, formatDateOnly} from '@/utils/date';

export default function SingleServiceView({ 
  service
}: { 
  service: ServiceTypeFull;
}) {

  const imagesUrls =
      !service.photos || service.photos.length == 0
          ? [DEFAULT_SERVICE_IMAGE_3]
          : service.photos.map(photo => photo.url)

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  async function handleContactClick() {
    try {
      // Создаем или обновляем клик через server action
      await createOrUpdateClick(service.id);
    } catch (error) {
      // Если ошибка авторизации (JWT is required, Invalid JWT и т.д.), перенаправляем на страницу входа
      if (error instanceof Error && (
        error.message.includes('JWT') || 
        error.message.includes('auth') ||
        error.message.includes('Unauthorized')
      )) {
        router.push(PAGE_ROUTES.WEB_AUTH);
        return;
      }
      // Игнорируем другие ошибки для MVP
    } finally {
      openModal();
    }
  }


  // Безопасная обработка options - может быть null или не массивом
  const serviceOptions = Array.isArray(service.options) ? service.options : [];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Photo Carousel */}
      <div className="w-full">
        <ImageCarousel images={imagesUrls} autoPlayInterval={5000} />
      </div>
      {/* Service Content */}
      <div className="px-4">
        {/* Service Stats */}
        <div className="flex items-center justify-between mb-3 mt-2">
          <div className="flex items-center gap-1.5">
            {service.created_at && (
                <>
                  <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#AAAAAA"
                      strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="text-gray-400" style={{ fontSize: '12px' }}>
                  {formatDateOnly(service.created_at)}
                </span>
                </>
            )}
          </div>
          {(service.view_count !== undefined && service.view_count !== null) && (
              <div className="flex items-center gap-1.5 ml-auto">
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#AAAAAA"
                    strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="text-gray-400" style={{ fontSize: '12px' }}>
                {service.view_count.toLocaleString('ru-RU')}
              </span>
              </div>
          )}
        </div>
        {/* Service Name */}
        <h1 
          className="text-2xl font-bold text-black mb-2 mt-4 text-center"
          style={{ fontSize: '24px', fontWeight: 700 }}
        >
          {service.name}
        </h1>
        
        {/* Event Date for Afisha category */}
        {service.category?.type === 'afisha' && service.event_date && (
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#007AFF"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span 
              className="text-blue-600 font-semibold"
              style={{ fontSize: '16px', fontWeight: 600 }}
            >
              {formatDateTime(service.event_date)}
            </span>
          </div>
        )}
        
        {/* Address */}
        <p 
          className="text-gray-500 mb-3 text-center"
          style={{ fontSize: '15px', color: '#AAAAAA', fontWeight: 400 }}
        >
          {service.address}
        </p>

        {/* Description Section */}
        <div className="bg-gray-100 rounded-lg p-4 mb-3">
          <h2 
            className="text-gray-600 mb-2"
            style={{ fontSize: '15px', color: '#707579' }}
          >
            Описание
          </h2>
          <p 
            className="text-black leading-relaxed"
            style={{ fontSize: '17px', color: 'black', fontWeight: 400, whiteSpace: 'pre-line' }}
          >
            {service.description}
          </p>
        </div>

        {/* Options */}
        {serviceOptions.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((option, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: '#F5F5F5',
                    color: '#707579',
                    fontWeight: 400
                  }}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Service Info */}
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Цена от:</span>
            <span className="text-2xl font-bold text-blue-600">
              {service.price} ₽
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Рейтинг:</span>
            <span className="text-xl font-bold text-blue-600">
              {formatRating(service.rating)}
            </span>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="h-28"/>
      </div>

      {/* Sticky Contact Button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 flex justify-center" style={{zIndex: 60}}>
      <button
          onClick={handleContactClick}
          className="max-w-sm text-black pt-2 pb-2 pr-4 pl-4"
          style={{ backgroundColor: '#95E59D', borderRadius: 30, fontSize: 17, fontWeight: 400 }}
        >
          Связаться
        </button>
      </div>

      {/* Contacts Modal */}
      <ContactsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        contacts={service.contacts || []}
      />
    </div>
  );
} 