'use client';

import React from 'react';
import { useServiceRegistration } from '../_hooks/useServiceRegistration';
import { ServiceNameInput } from './ServiceNameInput';
import { ServiceDescriptionInput } from './ServiceDescriptionInput';
import { ServicePriceInput } from './ServicePriceInput';
import { CategorySelectionModal } from './CategorySelectionModal';
import { ServiceAddressInput } from './ServiceAddressInput';
import { ServiceAreaSelect } from './ServiceAreaSelect';
import { ServicePhoneInput } from './ServicePhoneInput';
import { ServiceTelegramInput } from './ServiceTelegramInput';
import { ServiceOptionsSelection } from './ServiceOptionsSelection';
import { ProviderCompanyNameInput } from './ProviderCompanyNameInput';
import { ProviderContactPersonInput } from './ProviderContactPersonInput';
import { ProviderPhoneInput } from './ProviderPhoneInput';
import { RequiredFieldsList } from './RequiredFieldsList';
import { CreateServiceButton } from './CreateServiceButton';
import { ProgressBar } from './ProgressBar';
import { ResultModal } from './ResultModal';

export const ServiceRegistrationForm: React.FC = () => {
  const { form, onSubmit, isSubmitting, errors, result, resetResult } = useServiceRegistration();

  return (
    <>
      {/* Progress Bar */}
      <ProgressBar isVisible={isSubmitting} />

      {/* Result Modal */}
      {result && (
        <ResultModal 
          result={result} 
          onClose={resetResult} 
        />
      )}

             {/* Main Form */}
       <form onSubmit={onSubmit} className="space-y-8 pb-20">
        {/* Секция: Основная информация о сервисе */}
        <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl border border-blue-100 shadow-lg shadow-blue-50">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Основная информация
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServiceNameInput 
              register={form.register} 
              error={errors.name} 
            />
            <ServicePriceInput 
              register={form.register} 
              error={errors.price} 
            />
          </div>
          <div className="mt-4">
            <ServiceDescriptionInput 
              register={form.register} 
              error={errors.description} 
            />
          </div>
        </div>

        {/* Секция: Категория и опции */}
        <div className="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl border border-green-100 shadow-lg shadow-green-50">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            Категория и опции
          </h3>
          <div className="space-y-4">
            <CategorySelectionModal 
              selectedCategory={form.watch('tcategories_id')}
              onSelect={(categoryId) => form.setValue('tcategories_id', categoryId)}
              error={errors.tcategories_id}
            />
            <ServiceOptionsSelection 
              selectedOptions={form.watch('serviceOptions') || []}
              onOptionsChange={(options) => form.setValue('serviceOptions', options)}
            />
          </div>
        </div>

        {/* Секция: Локация */}
        <div className="bg-gradient-to-br from-white to-orange-50 p-8 rounded-2xl border border-orange-100 shadow-lg shadow-orange-50">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            Локация
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServiceAddressInput 
              register={form.register} 
              error={errors.address} 
            />
            <ServiceAreaSelect 
              selectedArea={form.watch('tarea_id')}
              onAreaSelect={(areaId) => form.setValue('tarea_id', areaId)}
              error={errors.tarea_id}
            />
          </div>
        </div>

        {/* Секция: Данные провайдера */}
        <div className="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-50">
          <h3 className="text-xl font-bold text-black mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            Данные компании
          </h3>
          <div className="space-y-4">
            <ProviderCompanyNameInput 
              register={form.register} 
              error={errors.providerCompanyName} 
            />
            <ProviderContactPersonInput 
              register={form.register} 
              error={errors.providerContactPerson} 
            />
            <ProviderPhoneInput 
              register={form.register} 
              error={errors.providerPhone} 
            />
          </div>
        </div>

        {/* Секция: Контакты */}
        <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl border border-purple-100 shadow-lg shadow-purple-50">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            Контактная информация
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServicePhoneInput 
              register={form.register} 
              error={errors.phone} 
            />
            <ServiceTelegramInput 
              register={form.register} 
              error={errors.tg_username} 
            />
          </div>
        </div>

        {/* Список незаполненных полей */}
        <RequiredFieldsList 
          watch={form.watch}
          errors={errors}
        />

        {/* Кнопка отправки */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-blue-100 shadow-lg">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Готовы создать сервис?
            </h3>
            <p className="text-sm text-gray-600">
              Заполните все обязательные поля и нажмите кнопку ниже
            </p>
          </div>
          <CreateServiceButton 
            isSubmitting={isSubmitting}
            disabled={!form.formState.isValid}
          />
        </div>
      </form>
    </>
  );
};
