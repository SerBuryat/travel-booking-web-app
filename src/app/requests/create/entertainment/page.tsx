"use client";

import React from 'react';
import { FormField, CreateRequestButton, BackButton } from '../../_components';
import { useEntertainmentRequest } from '../../_hooks';

export default function EntertainmentRequestPage() {
  const { form, onSubmit, isSubmitting, errors, isValid, result } = useEntertainmentRequest();

  return (
    <div className="max-w-4xl pt-2 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Туры/активности</h1>
      
      <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              {...form.register('location')}
              name="location"
              label="Город/регион"
              placeholder="Где хотите провести активность"
              required
              error={errors.location}
            />
            
            <FormField
              {...form.register('activityDate')}
              name="activityDate"
              label="Дата проведения"
              type="date"
              required
              error={errors.activityDate}
            />
            
            <FormField
              {...form.register('activityType')}
              name="activityType"
              label="Тип активности"
              placeholder="Экскурсия, поход, экстремальный спорт..."
              error={errors.activityType}
            />
            
            <FormField
              {...form.register('participants', { valueAsNumber: true })}
              name="participants"
              label="Количество участников"
              type="number"
              placeholder="Введите количество участников"
              required
              error={errors.participants}
            />
            
            <FormField
              {...form.register('difficultyLevel')}
              name="difficultyLevel"
              label="Уровень сложности"
              placeholder="Начинающий, средний, продвинутый..."
              error={errors.difficultyLevel}
            />
            
            <FormField
              {...form.register('duration')}
              name="duration"
              label="Продолжительность"
              placeholder="Сколько часов/дней"
              error={errors.duration}
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
              label="Особые пожелания"
              type="textarea"
              placeholder="Расскажите о ваших интересах и предпочтениях..."
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
