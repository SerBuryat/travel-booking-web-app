'use client';

import React from 'react';
import {ClientWithAuthType} from '@/model/ClientType';

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ClientWithAuthType;
}

export default function UserInfoModal({ isOpen, onClose, user }: UserInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Данные пользователя</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* JSON данные */}
        <div className="p-4">
          <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded border overflow-auto max-h-96">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
