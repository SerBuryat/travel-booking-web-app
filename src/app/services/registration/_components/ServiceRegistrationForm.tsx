'use client';

import React, {useState} from 'react';
import {useServiceRegistration} from '../_hooks/useServiceRegistration';
import {ServiceNameInput} from './ServiceNameInput';
import {ServiceDescriptionInput} from './ServiceDescriptionInput';
import {ServicePriceInput} from './ServicePriceInput';
import {CategorySelectionModal} from './CategorySelectionModal';
import {ServiceAddressInput} from './ServiceAddressInput';
import {ServiceAreaSelect} from './ServiceAreaSelect';
import {ServicePhoneInput} from './ServicePhoneInput';
import {ServiceTelegramInput} from './ServiceTelegramInput';
import {ServiceWebsiteInput} from './ServiceWebsiteInput';
import {ServiceWhatsAppInput} from './ServiceWhatsAppInput';
import {ServiceOptionsSelection} from './ServiceOptionsSelection';
import {ProviderCompanyNameInput} from './ProviderCompanyNameInput';
import {ProviderContactPersonInput} from './ProviderContactPersonInput';
import {ProviderPhoneInput} from './ProviderPhoneInput';
import {RequiredFieldsList} from './RequiredFieldsList';
import {ProgressBar} from './ProgressBar';
import {ResultModal} from './ResultModal';
import {TermsModal} from './TermsModal';
import {SectionTitle} from './SectionTitle';
import {useServicePhotos, MAX_FILE_SIZE_MB} from "@/lib/service/hooks/useServicePhotos";
import {ServicePhotoUpload} from "@/app/provider/services/create/_components/ServicePhotoUpload";
import {ServiceEventDateInput} from "@/app/provider/services/create/_components/ServiceEventDateInput";

export const ServiceRegistrationForm: React.FC = () => {
  const { form, onSubmit, isSubmitting, errors, result, resetResult } = useServiceRegistration();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const {
    photos,
    addPhotos,
    removePhoto,
    setPrimaryPhoto,
    clearPhotos,
    error: photosError,
    isSizeLimitExceeded
  } = useServicePhotos();

  const handleSubmit = (data: any) => {
    onSubmit(data, photos);
  };
  
  // Текст условий сотрудничества
  const fullTermsText = `Условия сотрудничества\n\n1. Общие положения\nНастоящие условия определяют порядок сотрудничества между платформой и сервисными провайдерами.\n\n2. Обязанности провайдера\nПровайдер обязуется предоставлять достоверную информацию о своих услугах, поддерживать актуальность данных и соблюдать сроки предоставления услуг.\n\n3. Комиссия\nПлатформа взимает комиссию в размере 10% с каждой успешно завершенной сделки.\n\n4. Ответственность\nКаждая сторона несет ответственность за свои обязательства в соответствии с законодательством.\n\n5. Изменение условий\nПлатформа оставляет за собой право изменять условия сотрудничества с уведомлением провайдеров за 30 дней.\n\n6. Согласие\nПри регистрации сервиса вы автоматически соглашаетесь с настоящими условиями сотрудничества.`;
  const shortTermsText = 'При регистрации сервиса вы соглашаетесь с условиями сотрудничества платформы. Мы гарантируем безопасность ваших данных и прозрачность расчетов. Комиссия платформы составляет 10% с каждой завершенной сделки. Вы обязуетесь предоставлять актуальную информацию о своих услугах и соблюдать сроки предоставления услуг.';

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

      {/* Terms Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        fullText={fullTermsText}
        shortText={shortTermsText}
      />

      {/* Main Form */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 pb-20">
        {/* Заполните анкету */}
        <SectionTitle>Заполните анкету</SectionTitle>

        <ServiceNameInput
            register={form.register}
            error={errors.name}
        />

        <CategorySelectionModal
            selectedCategory={form.watch('tcategories_id')}
            onSelect={(categoryId) => form.setValue('tcategories_id', categoryId)}
            error={errors.tcategories_id}
        />

        <ServiceAreaSelect
            selectedArea={form.watch('tarea_id')}
            onAreaSelect={(areaId) => form.setValue('tarea_id', areaId)}
            error={errors.tarea_id}
        />

        <ServiceAddressInput
            register={form.register}
            error={errors.address}
        />

        <ServiceDescriptionInput
            register={form.register}
            error={errors.description}
        />

        {/* Контакты заведения */}
        <SectionTitle>Контакты заведения</SectionTitle>

        <ServicePhoneInput
            register={form.register}
            error={errors.phone}
        />

        <ServiceTelegramInput
            register={form.register}
            error={errors.tg_username}
        />

        <ServiceWebsiteInput
            register={form.register}
            error={errors.website}
        />

        <ServiceWhatsAppInput
            register={form.register}
            error={errors.whatsap}
        />

        {/* Стоимость */}
        <SectionTitle>Стоимость</SectionTitle>

        <ServicePriceInput
            register={form.register}
            error={errors.price}
        />

        {/* Данные контактного лица */}
        <SectionTitle>Данные контактного лица</SectionTitle>

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

        {/* Логотип и Фото заведения */}
        <SectionTitle>Логотип и Фото заведения</SectionTitle>

        <ServicePhotoUpload
            photos={photos}
            onAddPhotos={addPhotos}
            onRemovePhoto={removePhoto}
            onSetPrimary={setPrimaryPhoto}
            onClearPhotos={clearPhotos}
            error={photosError}
        />

        {/* Дополнительно */}
        <SectionTitle>Дополнительно</SectionTitle>

        <ServiceEventDateInput
            register={form.register}
            error={errors.event_date}
        />

        <ServiceOptionsSelection
            selectedOptions={form.watch('serviceOptions') || []}
            onOptionsChange={(options) => form.setValue('serviceOptions', options)}
        />

        {/* Условия сотрудничества */}
        <SectionTitle>Условия сотрудничества</SectionTitle>

        <div className="bg-gray-50 rounded-lg">
          <p style={{color: '#707579'}}>
            {shortTermsText.substring(0, 75)}...
            <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="font-bold underline hover:opacity-80"
                style={{color: '#707579'}}
            >
              Читать полностью
            </button>
          </p>
        </div>

        {/* Список незаполненных полей */}
        <RequiredFieldsList
            watch={form.watch}
            errors={errors}
        />

        {/* Предупреждение о превышении лимита размера */}
        {isSizeLimitExceeded && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Лимит размера превышен
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Вы не сможете создать сервис, так как за один раз можно загрузить максимум {MAX_FILE_SIZE_MB} MB новых фото. Удалите часть фото, чтобы продолжить.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Кнопка отправки */}
        <button
            type="submit"
            disabled={!form.formState.isValid || isSubmitting || isSizeLimitExceeded}
            className="w-full py-2 transition-all duration-300 text-lg"
            style={{
              backgroundColor: isSubmitting || !form.formState.isValid || isSizeLimitExceeded ? '#ccc' : '#95E59D',
              color: isSubmitting || !form.formState.isValid || isSizeLimitExceeded ? 'white' : '#000000',
              borderRadius: '128px'
            }}
        >
          {isSubmitting ? 'Отправка...' : 'отправить заявку'}
        </button>

        {/* Кнопка для тестирования ошибок (только в development) */}
        {process.env.NODE_ENV === 'development' && (
          <button
            type="button"
            onClick={() => {
              const formData = form.getValues();
              onSubmit(formData, photos, true);
            }}
            disabled={!form.formState.isValid || isSubmitting || isSizeLimitExceeded}
            className="w-full py-2 transition-all duration-300 text-lg mt-3"
            style={{
              backgroundColor: isSubmitting || !form.formState.isValid || isSizeLimitExceeded ? '#ccc' : '#ff6b6b',
              color: 'white',
              borderRadius: '128px'
            }}
          >
            {isSubmitting ? 'Отправка...' : 'Создать с ошибкой (DEV)'}
          </button>
        )}
      </form>
    </>
  );
};
