'use client';

import React, { useState } from 'react';

export const RegistryServiceButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="text-gray-600 hover:text-gray-800 transition-colors"
        style={{ 
          color: '#707579',
          fontSize: '13px', 
          fontWeight: 400,
          fontFamily: 'Inter, sans-serif'
        }}
      >
        Registry service
      </button>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Service Registration</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-sm text-gray-700 space-y-4">
              <p>
                Register your service with Daily Task Manager to reach more customers and grow your business. Our platform connects service providers with customers looking for reliable, quality services.
              </p>
              
              <div>
                <h3 className="font-semibold mb-2">Benefits of Registration</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Access to a large customer base</li>
                  <li>Easy service management dashboard</li>
                  <li>Secure payment processing</li>
                  <li>Customer reviews and ratings</li>
                  <li>Marketing and promotion tools</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Registration Process</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Complete the online application form</li>
                  <li>Provide business documentation</li>
                  <li>Service verification and approval</li>
                  <li>Account setup and training</li>
                  <li>Start accepting customers</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Valid business license</li>
                  <li>Insurance coverage</li>
                  <li>Background check clearance</li>
                  <li>Service quality standards compliance</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Contact Registration Team</h3>
                <p>Ready to get started? Contact our registration team at:</p>
                <p className="mt-2">
                  <strong>Email:</strong> registration@dailytaskmanager.com<br />
                  <strong>Phone:</strong> +1 (555) 123-4567<br />
                  <strong>Hours:</strong> Monday-Friday, 9AM-6PM EST
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 