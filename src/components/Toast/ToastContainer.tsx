'use client';

import React from 'react';
import { useToast } from './ToastContext';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col items-end"
      style={{ pointerEvents: 'none' }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <Toast toast={toast} onClose={() => hideToast(toast.id)} />
        </div>
      ))}
    </div>
  );
};

