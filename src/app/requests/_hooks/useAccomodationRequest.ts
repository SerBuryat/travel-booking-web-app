'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AccomodationRequestData, accomodationRequestSchema } from '@/schemas/requests/create';

export interface RequestSubmissionResult {
  success: boolean;
  message: string;
  requestId?: number;
  error?: string;
}

export const useAccomodationRequest = () => {
  const [result, setResult] = useState<RequestSubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AccomodationRequestData>({
    resolver: zodResolver(accomodationRequestSchema),
    mode: 'onChange', // Валидация в реальном времени
    defaultValues: {
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      accommodationType: '',
      budget: '',
      additionalNotes: ''
    }
  });

  const onSubmit = async (data: AccomodationRequestData) => {
    setIsSubmitting(true);
    setResult(null);

    try {
      // TODO: Заменить на реальный API endpoint
      const response = await fetch('/api/requests/accomodation', {
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
        message: 'Заявка на проживание успешно отправлена!',
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
