'use client';

import React, {useState} from 'react';

export const PrivatePolicyButton: React.FC = () => {
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
        Политика конфиденциальности
      </button>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Privacy Policy</h2>
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
                This Privacy Policy describes how Daily Task Manager (&#34;we&#34;, &#34;our&#34;, or &#34;us&#34;) collects, uses, and shares your personal information when you use our service marketplace application.
              </p>
              
              <div>
                <h3 className="font-semibold mb-2">Information We Collect</h3>
                <p>We collect information you provide directly to us, such as when you create an account, request services, or contact us for support.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">How We Use Your Information</h3>
                <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Information Sharing</h3>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Data Security</h3>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Contact Us</h3>
                <p>If you have any questions about this Privacy Policy, please contact us at privacy@dailytaskmanager.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 