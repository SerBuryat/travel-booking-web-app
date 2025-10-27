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
import {ServiceOptionsSelection} from './ServiceOptionsSelection';
import {ProviderCompanyNameInput} from './ProviderCompanyNameInput';
import {ProviderContactPersonInput} from './ProviderContactPersonInput';
import {ProviderPhoneInput} from './ProviderPhoneInput';
import {RequiredFieldsList} from './RequiredFieldsList';
import {ProgressBar} from './ProgressBar';
import {ResultModal} from './ResultModal';
import {TermsModal} from './TermsModal';
import {SectionTitle} from './SectionTitle';

export const ServiceRegistrationForm: React.FC = () => {
  const { form, onSubmit, isSubmitting, errors, result, resetResult } = useServiceRegistration();
  const [showTermsModal, setShowTermsModal] = useState(false);
  
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
       <form onSubmit={onSubmit} className="space-y-8 pb-20">
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
        
        {/* Дополнительно */}
        <SectionTitle>Дополнительно</SectionTitle>
        
        <ServiceOptionsSelection 
          selectedOptions={form.watch('serviceOptions') || []}
          onOptionsChange={(options) => form.setValue('serviceOptions', options)}
        />
        
        {/* Логотип и Фото заведения */}
        <SectionTitle>Логотип и Фото заведения</SectionTitle>
        
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 border-dashed flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-sm">Скоро</p>
          </div>
        </div>
        
        {/* Условия сотрудничества */}
        <SectionTitle>Условия сотрудничества</SectionTitle>
        
        <div className="bg-gray-50 rounded-lg">
          <p style={{ color: '#707579' }}>
            {shortTermsText.substring(0, 75)}...
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="font-bold underline hover:opacity-80"
              style={{ color: '#707579' }}
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

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={!form.formState.isValid || isSubmitting}
          className="w-full py-2 transition-all duration-300 text-lg"
          style={{ 
            backgroundColor: isSubmitting || !form.formState.isValid ? '#ccc' : '#95E59D',
            color: isSubmitting || !form.formState.isValid ? 'white' : '#000000',
            borderRadius: '128px' 
          }}
        >
          {isSubmitting ? 'Отправка...' : 'отправить заявку'}
        </button>
      </form>
    </>
  );
};
