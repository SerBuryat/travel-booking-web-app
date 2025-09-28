'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EntertainmentRequestData, entertainmentRequestSchema } from '@/schemas/requests/create';

export interface RequestSubmissionResult {
  success: boolean;
  message: string;
  requestId?: number;
  error?: string;
}

export const useEntertainmentRequest = () => {
  const [result, setResult] = useState<RequestSubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EntertainmentRequestData>({
    resolver: zodResolver(entertainmentRequestSchema),
    mode: 'onChange', // Валидация в реальном времени
    defaultValues: {
      location: '',
      activityDate: '',
      activityType: '',
      participants: 1,
      difficultyLevel: '',
      duration: '',
      budget: '',
      additionalNotes: ''
    }
  });

  const onSubmit = async (data: EntertainmentRequestData) => {
    setIsSubmitting(true);
    setResult(null);

    try {
      // TODO: Заменить на реальный API endpoint
      const response = await fetch('/api/requests/entertainment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Ошибка при отправке заявки');
      }

      setResult({
        success: true,
        message: 'Заявка на туры/активности успешно отправлена!',
        requestId: responseData.requestId
      });

      // Сброс формы при успехе
      form.reset();

    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      setResult({
        success: false,
        message: 'Произошла ошибка при отправке заявки',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetResult = () => {
    setResult(null);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    result,
    resetResult
  };
};