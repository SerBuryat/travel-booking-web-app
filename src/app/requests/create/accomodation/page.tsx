"use client";

import React from 'react';
import { FormField, CreateRequestButton, BackButton } from '../../_components';
import { useAccomodationRequest } from '../../_hooks';

export default function AccomodationRequestPage() {
  const { form, onSubmit, isSubmitting, errors, isValid, result } = useAccomodationRequest();

  return (
    <div className="max-w-4xl pt-2 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Проживание</h1>
      
      <form onSubmit={onSubmit} className="space-y-4">
        {/* tarea_id и type заполняются на сервере */}
        <FormField
            {...form.register('tbids_accomodation_attrs.date_from')}
            name="tbids_accomodation_attrs.date_from"
            label="Дата заезда"
            type="date"
            required
            error={errors.tbids_accomodation_attrs?.date_from as any}
        />
        <FormField
            {...form.register('tbids_accomodation_attrs.date_to')}
            name="tbids_accomodation_attrs.date_to"
            label="Дата выезда"
            type="date"
            required
            error={errors.tbids_accomodation_attrs?.date_to as any}
        />
        <FormField
            {...form.register('tbids_accomodation_attrs.adults_qty', { valueAsNumber: true })}
            name="tbids_accomodation_attrs.adults_qty"
            label="Количество взрослых"
            type="number"
            required
            error={errors.tbids_accomodation_attrs?.adults_qty as any}
        />
        <FormField
            {...form.register('tbids_accomodation_attrs.kids_qty', { valueAsNumber: true })}
            name="tbids_accomodation_attrs.kids_qty"
            label="Количество детей"
            type="number"
            error={errors.tbids_accomodation_attrs?.kids_qty as any}
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
