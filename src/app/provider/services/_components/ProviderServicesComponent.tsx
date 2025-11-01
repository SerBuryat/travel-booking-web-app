import {ServiceType} from '@/model/ServiceType';
import {PAGE_ROUTES} from "@/utils/routes";
import React from "react";
import {HorizontalViewServiceComponent} from "@/components/HorizontalViewServiceComponent";

interface ProviderServicesComponentProps {
  providerId?: number;
  services: ServiceType[];
}

export default function ProviderServicesComponent({ services }: ProviderServicesComponentProps) {
  if (!services) {
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

  if (services.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-3 text-sm font-medium text-gray-900">
              У вас пока нет сервисов
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Создайте свой первый сервис, чтобы начать работу
            </p>
            <div className="mt-5">
              <a
                href={PAGE_ROUTES.PROVIDER.CREATE_SERVICE}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Создать сервис
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">

      {/* Список сервисов */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Мои сервисы</h3>
            <a
              href={PAGE_ROUTES.PROVIDER.CREATE_SERVICE}
              className="inline-flex items-center px-2 sm:px-3 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Добавить сервис
            </a>
          </div>
        </div>

        <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
          <div className="space-y-3">
            {services.map((service) => (
                <HorizontalViewServiceComponent key={service.id} service={service}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
