"use client";

import React from 'react';
import { FormField, CreateRequestButton, BackButton } from '../../_components';
import { useTransportRequest } from '../../_hooks';

export default function TransportRequestPage() {
  const { form, onSubmit, isSubmitting, errors, isValid, result } = useTransportRequest();

  return (
    <div className="max-w-4xl pt-2 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Транспорт</h1>
      
      <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              {...form.register('from')}
              name="from"
              label="Откуда"
              placeholder="Город отправления"
              required
              error={errors.from}
            />
            
            <FormField
              {...form.register('to')}
              name="to"
              label="Куда"
              placeholder="Город назначения"
              required
              error={errors.to}
            />
            
            <FormField
              {...form.register('departureDate')}
              name="departureDate"
              label="Дата отправления"
              type="date"
              required
              error={errors.departureDate}
            />
            
            <FormField
              {...form.register('departureTime')}
              name="departureTime"
              label="Время отправления"
              type="text"
              placeholder="Предпочтительное время"
              error={errors.departureTime}
            />
            
            <FormField
              {...form.register('transportType')}
              name="transportType"
              label="Тип транспорта"
              placeholder="Самолет, поезд, автобус, автомобиль..."
              error={errors.transportType}
            />
            
            <FormField
              {...form.register('passengers', { valueAsNumber: true })}
              name="passengers"
              label="Количество пассажиров"
              type="number"
              placeholder="Введите количество пассажиров"
              required
              error={errors.passengers}
            />
            
            <FormField
              {...form.register('budget')}
              name="budget"
              label="Бюджет"
              placeholder="Введите ваш бюджет"
              error={errors.budget}
            />
            
            <FormField
              {...form.register('additionalNotes')}
              name="additionalNotes"
              label="Дополнительные требования"
              type="textarea"
              placeholder="Особые требования к транспорту..."
              rows={4}
              error={errors.additionalNotes}
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
