'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { ImageCarousel } from '@/components/ImageCarousel';
import { ServiceTypeFull } from '@/model/ServiceType';
import { useRouter } from 'next/navigation';
import { PAGE_ROUTES } from '@/utils/routes';
export default function SingleServiceView({ service }: { service: ServiceTypeFull }) {
  // Mock images for carousel (gradient backgrounds)
  const mockImages = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ];

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  async function handleContactClick() {
    try {
      const res = await fetch(`/api/services/${service.id}/click`, { method: 'POST' });
      if (res.status === 401) {
        router.push(PAGE_ROUTES.TELEGRAM_AUTH);
        return;
      }
    } catch (e) {
      // ignore for MVP
    } finally {
      openModal();
    }
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Photo Carousel */}
      <div className="w-full">
        <ImageCarousel images={mockImages} autoPlayInterval={5000} />
      </div>
      {/* Service Content */}
      <div className="px-4 py-6">
        {/* Service Name */}
        <h1 
          className="text-2xl font-bold text-black mb-3 text-center"
          style={{ fontSize: '24px', fontWeight: 700 }}
        >
          {service.name}
        </h1>
        {/* Address */}
        <p 
          className="text-gray-500 mb-6 text-center"
          style={{ fontSize: '15px', color: '#AAAAAA', fontWeight: 400 }}
        >
          123 Main Street, Downtown District, City Center, 12345
        </p>
        {/* Description Section */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h2 
            className="text-gray-600 mb-3"
            style={{ fontSize: '15px', color: '#707579' }}
          >
            Description
          </h2>
          <p 
            className="text-black leading-relaxed"
            style={{ fontSize: '17px', color: 'black', fontWeight: 400 }}
          >
            {service.description}
          </p>
        </div>
        {/* Additional Service Info */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Price:</span>
            <span className="text-2xl font-bold text-blue-600">
              ${service.price}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              service.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {service.status}
            </span>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="h-28" />
      </div>

      {/* Sticky Contact Button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 flex justify-center" style={{ zIndex: 60 }}>
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