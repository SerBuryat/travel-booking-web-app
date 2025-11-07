"use client";

import React from 'react';
import { FormField, CreateRequestButton, BackButton } from '../../_components';
import { useHealthRequest } from '../../_hooks';

export default function HealthRequestPage() {
  const { form, onSubmit, isSubmitting, errors, isValid, result } = useHealthRequest();

  return (
    <div className="max-w-4xl pt-2 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Здоровье</h1>
      
      <form onSubmit={onSubmit} className="space-y-4">
        {/* tarea_id и type заполняются на сервере */}
        <FormField
            {...form.register('tbids_health_attrs.provision_time')}
            name="tbids_health_attrs.provision_time"
            label="Время предоставления (provision_time)"
            type="datetime-local"
            required
            error={errors.tbids_health_attrs?.provision_time as any}
        />
        <FormField
            {...form.register('tbids_health_attrs.adults_qty', { valueAsNumber: true })}
            name="tbids_health_attrs.adults_qty"
            label="Взрослые (adults_qty)"
            type="number"
            required
            error={errors.tbids_health_attrs?.adults_qty as any}
        />
        <FormField
            {...form.register('comment')}
            name="comment"
            label="Комментарий"
            type="textarea"
            error={errors.comment}
        />
        <FormField
            {...form.register('budget', { valueAsNumber: true })}
            name="budget"
            label="Бюджет"
            type="number"
            required
            error={errors.budget}
        />
      </form>

      {/* Submit Buttons */}
      <div className="flex flex-col gap-2 mt-6">
        <CreateRequestButton 
          onClick={onSubmit} 
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
        </CreateRequestButton>
        <BackButton />
      </div>

      {/* Result Modal */}
      {result && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 70 }}>
          <div className="bg-white rounded-2xl p-6 m-4 max-w-md w-full">
            <div className={`text-center ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              <h3 className="text-lg font-semibold mb-2">
                {result.success ? 'Успешно!' : 'Ошибка'}
              </h3>
              <p className="mb-4">{result.message}</p>
              <button
                onClick={() => window.location.href = '/requests'}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {result.success ? 'Вернуться к заявкам' : 'Попробовать снова'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

