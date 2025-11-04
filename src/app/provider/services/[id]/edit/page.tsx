import React from 'react';
import { redirect } from 'next/navigation';
import { getServiceForEdit } from '@/lib/provider/servicesEdit';
import { PAGE_ROUTES } from '@/utils/routes';
import { ProviderEditServiceForm } from './_components/ProviderEditServiceForm';
import { ToastProvider, ToastContainer } from '@/components/Toast';

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const serviceId = parseInt(id, 10);

  // Проверка валидности ID
  if (isNaN(serviceId) || serviceId <= 0) {
    console.error('[EditServicePage] Invalid service ID:', id);
    redirect(PAGE_ROUTES.PROVIDER.SERVICES);
  }

  let serviceData;
  try {
    // Получаем данные сервиса для редактирования
    serviceData = await getServiceForEdit(serviceId);
  } catch (error) {
    console.error('[EditServicePage] Error fetching service data:', error);
    // Редирект в случае ошибки (сервис не найден, не принадлежит провайдеру и т.д.)
    redirect(PAGE_ROUTES.PROVIDER.SERVICES);
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Редактирование объекта
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {serviceData.name}
            </p>
          </div>
          
          <ProviderEditServiceForm 
            serviceId={serviceId}
            initialData={serviceData}
          />
        </div>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}

