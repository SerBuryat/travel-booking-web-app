'use client';
import React, {useCallback, useState} from 'react';
import {ImageCarousel} from '@/components/ImageCarousel';
import {ServiceTypeFull} from '@/model/ServiceType';
import {useRouter} from 'next/navigation';
import {PAGE_ROUTES} from '@/utils/routes';
import {DEFAULT_SERVICE_IMAGE_1, DEFAULT_SERVICE_IMAGE_2, DEFAULT_SERVICE_IMAGE_3} from '@/utils/images';

export default function SingleServiceView({ 
  service, 
  parentCategoryName 
}: { 
  service: ServiceTypeFull;
  parentCategoryName?: string | null;
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
    // todo -  переделать на server action
    try {
      const res = await fetch(`/api/services/${service.id}/click`, { method: 'POST' });
      if (res.status === 401) {
        router.push(PAGE_ROUTES.NO_AUTH);
        return;
      }
    } catch (e) {
      // ignore for MVP
    } finally {
      openModal();
    }
  }

  const handleCategoryClick = useCallback(() => {
    if (service.category?.id) {
      router.push(`/catalog/${service.category.id}/services`);
    }
  }, [service.category, router]);

  const handleParentCategoryClick = useCallback(() => {
    if (service.category?.parent_id) {
      router.push(`/catalog/${service.category.parent_id}/services`);
    }
  }, [service.category, router]);

  const formatDate = (dateValue?: string | Date): string => {
    if (!dateValue) return '';
    try {
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                     'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return '';
    }
  };

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
                  {formatDate(service.created_at)}
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
        {/* Address */}
        <p 
          className="text-gray-500 mb-3 text-center"
          style={{ fontSize: '15px', color: '#AAAAAA', fontWeight: 400 }}
        >
          {service.address}
        </p>

        {/* Category and Options - два ряда */}
        {(service.category || serviceOptions.length > 0) && (
          <div className="mb-3 space-y-2">
            {/* Первый ряд - Category */}
            {service.category && (
              <div className="flex items-center gap-2">
                {parentCategoryName ? (
                  <>
                    <button
                      onClick={handleParentCategoryClick}
                      className="inline-flex items-center px-3 py-1 rounded-full transition-colors hover:opacity-80"
                      style={{ 
                        backgroundColor: '#E3F2FD',
                        color: '#007AFF',
                        fontSize: '13px',
                        fontWeight: 500
                      }}
                    >
                      {parentCategoryName}
                    </button>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#AAAAAA" 
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                    <button
                      onClick={handleCategoryClick}
                      className="inline-flex items-center px-3 py-1 rounded-full transition-colors hover:opacity-80"
                      style={{ 
                        backgroundColor: '#E3F2FD',
                        color: '#007AFF',
                        fontSize: '13px',
                        fontWeight: 500
                      }}
                    >
                      {service.category.name}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCategoryClick}
                    className="inline-flex items-center px-3 py-1 rounded-full transition-colors hover:opacity-80"
                    style={{ 
                      backgroundColor: '#E3F2FD',
                      color: '#007AFF',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                  >
                    {service.category.name}
                  </button>
                )}
              </div>
            )}
            {/* Второй ряд - Options */}
            {serviceOptions.length > 0 && (
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
                  {serviceOptions.map((option, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0"
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
          </div>
        )}

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
            style={{ fontSize: '17px', color: 'black', fontWeight: 400 }}
          >
            {service.description}
          </p>
        </div>

        {/* Additional Service Info */}
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Цена:</span>
            <span className="text-2xl font-bold text-blue-600">
              {service.price} ₽
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Рейтинг:</span>
            <span className="text-xl font-bold text-blue-600">
              {
                service.rating && service.view_count && service.view_count > 0
                    ? `${service.rating}/5`
                    : 'Нет оценок'
              }
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center" style={{ zIndex: 60 }}>
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 m-0 sm:m-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Контакты</h3>
              <button onClick={closeModal} className="text-gray-500">✕</button>
            </div>
            {service.contacts && service.contacts.length > 0 ? (
              <div className="space-y-3">
                {service.contacts.map((c) => (
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