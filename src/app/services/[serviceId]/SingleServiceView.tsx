'use client';
import React from 'react';
import { ImageCarousel } from '@/components/ImageCarousel';
import { ServiceType } from '@/model/ServiceType';

export default function SingleServiceView({ service }: { service: ServiceType }) {
  // Mock images for carousel (gradient backgrounds)
  const mockImages = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ];

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
        <div className="mt-8 space-y-3">
          <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Book Now
          </button>
          <button className="w-full border border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Contact Provider
          </button>
        </div>
      </div>
    </div>
  );
} 