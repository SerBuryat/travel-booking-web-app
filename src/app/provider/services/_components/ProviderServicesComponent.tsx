'use client';

import {ServiceType} from '@/model/ServiceType';
import React, {useMemo, useState, useEffect, useRef} from "react";
import {HorizontalViewServiceComponent} from "@/components/HorizontalViewServiceComponent";
import {useRouter, useSearchParams} from 'next/navigation';
import {PAGE_ROUTES} from "@/utils/routes";
import { CategoryEntity } from '@/entity/CategoryEntity';
import { deleteService } from '@/lib/provider/servicesEdit';
import { useToast } from '@/components/Toast';

interface ProviderServicesComponentProps {
  parents: CategoryEntity[];
  parentToServices: Record<number, ServiceType[]>;
}

export default function ProviderServicesComponent({ parents, parentToServices }: ProviderServicesComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast, updateToast } = useToast();

  const selectedCategoryParam = searchParams.get('categoryId');
  const selectedParentCategoryId = selectedCategoryParam ? Number(selectedCategoryParam) : undefined;

  // State for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceType | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<number | null>(null);
  
  // State for dropdown menu
  const [openMenuServiceId, setOpenMenuServiceId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const visibleParents = useMemo(() => {
    return parents.filter((p) => (parentToServices[p.id]?.length ?? 0) > 0);
  }, [parents, parentToServices]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside menu and menu button
      const isMenuClick = menuRef.current?.contains(target);
      const isButtonClick = openMenuServiceId !== null && 
        menuButtonRefs.current.get(openMenuServiceId)?.contains(target);
      
      if (!isMenuClick && !isButtonClick) {
        setOpenMenuServiceId(null);
      }
    };

    if (openMenuServiceId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuServiceId]);

  const handleSelectCategory = (categoryId: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    // set primary correct key; also clear the typo key for consistency
    newParams.set('categoryId', String(categoryId));
    const path = PAGE_ROUTES.PROVIDER.SERVICES;
    router.push(`${path}?${newParams.toString()}`);
  };
  const totalServices = useMemo(() =>
      Object.values(parentToServices)
          .reduce((acc, arr) => acc + arr.length, 0)
      , [parentToServices]
  );

  if (totalServices === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              ID провайдера не найден
            </h3>
            <div className="mt-1 text-sm text-yellow-700">
              <p>
                Не удалось определить ID провайдера. Обратитесь к администратору.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredServices: ServiceType[] = useMemo(() => {
    if (!selectedParentCategoryId) return Object.values(parentToServices).flat();
    return parentToServices[selectedParentCategoryId] ?? [];
  }, [parentToServices, selectedParentCategoryId]);

  // Menu handlers
  const handleMenuToggle = (serviceId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuServiceId(openMenuServiceId === serviceId ? null : serviceId);
  };

  const handleCloseMenu = () => {
    setOpenMenuServiceId(null);
  };

  // Delete handlers
  const handleDeleteClick = (service: ServiceType, e: React.MouseEvent) => {
    e.stopPropagation();
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
    handleCloseMenu();
  };

  const handleEditClick = (service: ServiceType, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement edit functionality
    console.log('Edit service:', service.id);
    handleCloseMenu();
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    const toastId = showToast('Удаление объекта...', 'loading');
    setDeletingServiceId(serviceToDelete.id);

    try {
      await deleteService(serviceToDelete.id);
      updateToast(toastId, 'Объект успешно удален', 'success');
      
      // Wait for fade-out animation
      setTimeout(() => {
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
        setDeletingServiceId(null);
        router.refresh();
      }, 500);
    } catch (error) {
      console.error('Error deleting service:', error);
      updateToast(toastId, 'Ошибка при удалении объекта', 'error');
      setDeletingServiceId(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Filter buttons (reference: child category buttons design) */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
          <button
            onClick={() => router.push(PAGE_ROUTES.PROVIDER.SERVICES)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${!selectedParentCategoryId ? 'text-white' : ''}`}
            style={{
              backgroundColor: !selectedParentCategoryId ? '#B0D5FD' : '#F5F5F5',
              color: '#000000',
              fontWeight: 500
            }}
          >
            Все
          </button>

          {visibleParents.map((cat) => {
            const isActive = selectedParentCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${isActive ? 'text-white' : ''}`}
                style={{
                  backgroundColor: isActive ? '#B0D5FD' : '#F5F5F5',
                  color: '#000000',
                  fontWeight: 500
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {filteredServices.map((service) => {
        const isDeleting = deletingServiceId === service.id;
        const isMenuOpen = openMenuServiceId === service.id;
        
        return (
          <div 
            key={service.id} 
            className={`relative transition-all duration-500 ${isDeleting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
          >
            <HorizontalViewServiceComponent service={service} />
            
            {/* Three dots menu button */}
            <button
              ref={(el) => {
                if (el) menuButtonRefs.current.set(service.id, el);
              }}
              onClick={(e) => handleMenuToggle(service.id, e)}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/95 shadow-md hover:shadow-lg hover:bg-white transition-all duration-200 z-10"
              title="Действия"
            >
              <svg 
                className="w-5 h-5 text-gray-600" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {isMenuOpen && (
              <div 
                ref={menuRef}
                className="absolute top-14 right-3 bg-white rounded-xl shadow-2xl overflow-hidden z-20 border border-gray-100"
                style={{ 
                  minWidth: '180px',
                  fontFamily: 'Inter, sans-serif',
                  animation: 'fadeIn 0.2s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Edit option */}
                <button
                  onClick={(e) => handleEditClick(service, e)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <svg 
                    className="w-5 h-5 text-blue-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Редактировать</span>
                </button>

                {/* Divider */}
                <div className="border-t border-gray-100"></div>

                {/* Delete option */}
                <button
                  onClick={(e) => handleDeleteClick(service, e)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-red-50 transition-colors"
                >
                  <svg 
                    className="w-5 h-5 text-red-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                  <span className="text-sm font-medium text-red-600">Удалить</span>
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && serviceToDelete && (
        <div 
          className="fixed inset-0 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)', zIndex: 9999 }}
          onClick={handleCancelDelete}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all"
            style={{ fontFamily: 'Inter, sans-serif' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Удалить <span className="text-xl text-gray-600 truncate underline"> {serviceToDelete.name} </span>?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
              Это действие нельзя будет отменить
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-3 rounded-xl font-medium text-gray-700 transition-colors"
                style={{ backgroundColor: '#F3F4F6' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-colors"
                style={{ backgroundColor: '#EF4444' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
