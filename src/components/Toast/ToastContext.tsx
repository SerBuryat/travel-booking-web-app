'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => string;
  hideToast: (id: string) => void;
  updateToast: (id: string, message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType, duration?: number): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration: duration ?? (type === 'loading' ? undefined : 3000) };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-hide non-loading toasts
    if (type !== 'loading' && newToast.duration) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = useCallback((id: string, message: string, type: ToastType) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, message, type, duration: type === 'loading' ? undefined : 3000 } : toast
      )
    );

    // Auto-hide if not loading
    if (type !== 'loading') {
      setTimeout(() => {
        hideToast(id);
      }, 3000);
    }
  }, [hideToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, updateToast }}>
      {children}
    </ToastContext.Provider>
  );
};

