'use client';

import React, { useState, useMemo } from 'react';
import { useProvideEditService } from '../_hooks/useProvideEditService';
import type { ServiceEditData } from '@/lib/provider/servicesEdit';

// Импортируем все компоненты формы из create
import { ServiceNameInput } from '@/app/provider/services/create/_components/ServiceNameInput';
import { ServiceDescriptionInput } from '@/app/provider/services/create/_components/ServiceDescriptionInput';
import { ServicePriceInput } from '@/app/provider/services/create/_components/ServicePriceInput';
import { CategorySelectionModal } from '@/app/provider/services/create/_components/CategorySelectionModal';
import { ServiceAddressInput } from '@/app/provider/services/create/_components/ServiceAddressInput';
import { ServiceAreaSelect } from '@/app/provider/services/create/_components/ServiceAreaSelect';
import { ServicePhoneInput } from '@/app/provider/services/create/_components/ServicePhoneInput';
import { ServiceTelegramInput } from '@/app/provider/services/create/_components/ServiceTelegramInput';
import { ServiceOptionsSelection } from '@/app/provider/services/create/_components/ServiceOptionsSelection';
import { RequiredFieldsList } from '@/app/provider/services/create/_components/RequiredFieldsList';
import { ProgressBar } from '@/app/provider/services/create/_components/ProgressBar';
import { ResultModal } from '@/app/provider/services/create/_components/ResultModal';
import { SectionTitle } from '@/app/provider/services/create/_components/SectionTitle';
import { ServicePhotoUpload } from '@/app/provider/services/create/_components/ServicePhotoUpload';
import { useServicePhotos, PhotoItem } from '@/lib/service/hooks/useServicePhotos';

interface ProviderEditServiceFormProps {
  serviceId: number;
  initialData: ServiceEditData;
}

export const ProviderEditServiceForm: React.FC<ProviderEditServiceFormProps> = ({
  serviceId,
  initialData,
}) => {
  const { form, onSubmit, isSubmitting, errors, result, resetResult } = useProvideEditService({
    serviceId,
    initialData,
  });

  // Конвертируем существующие фото в формат PhotoItem
  const initialPhotos: PhotoItem[] = useMemo(() => {
    return initialData.photos.map(photo => ({
      id: photo.id.toString(),
      file: null,
      previewUrl: photo.url,
      isPrimary: photo.isPrimary,
      isExisting: true,
      dbId: photo.id,
    }));
  }, [initialData.photos]);

  const {
    photos,
    addPhotos,
    removePhoto,
    setPrimaryPhoto,
    clearPhotos,
    error: photosError,
    getPhotosForSubmit,
  } = useServicePhotos({ initialPhotos });

  const handleSubmit = (data: any) => {
    const photosData = getPhotosForSubmit();
    onSubmit(data, photosData);
  };

  return (
    <>
      {/* Progress Bar */}
      <ProgressBar isVisible={isSubmitting} />

      {/* Result Modal */}
      {result && <ResultModal result={result} onClose={resetResult} />}

      {/* Main Form */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 pb-20">
        {/* Заполните анкету */}
        <SectionTitle>Основная информация</SectionTitle>

        <ServiceNameInput register={form.register} error={errors.name} />

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

        <ServiceAddressInput register={form.register} error={errors.address} />

        <ServiceDescriptionInput
          register={form.register}
          error={errors.description}
        />

        {/* Контакты заведения */}
        <SectionTitle>Контакты заведения</SectionTitle>

        <ServicePhoneInput register={form.register} error={errors.phone} />

        <ServiceTelegramInput
          register={form.register}
          error={errors.tg_username}
        />

        {/* Стоимость */}
        <SectionTitle>Стоимость</SectionTitle>

        <ServicePriceInput register={form.register} error={errors.price} />

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

        <ServiceOptionsSelection
          selectedOptions={form.watch('serviceOptions') || []}
          onOptionsChange={(options) => form.setValue('serviceOptions', options)}
        />

        {/* Список незаполненных полей */}
        <RequiredFieldsList watch={form.watch} errors={errors} />

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={!form.formState.isValid || isSubmitting}
          className="w-full py-2 transition-all duration-300 text-lg"
          style={{
            backgroundColor:
              isSubmitting || !form.formState.isValid ? '#ccc' : '#95E59D',
            color: isSubmitting || !form.formState.isValid ? 'white' : '#000000',
            borderRadius: '128px',
          }}
        >
          {isSubmitting ? 'Сохранение...' : 'сохранить изменения'}
        </button>
      </form>
    </>
  );
};

