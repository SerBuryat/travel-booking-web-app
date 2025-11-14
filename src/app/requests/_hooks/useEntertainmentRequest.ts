'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EntertainmentRequestData, entertainmentRequestSchema } from '@/schemas/requests/create';
import {createEntertainmentRequest} from "@/lib/request/client/create/createRequest";

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
    mode: 'onChange', // Валидация при изменении полей
    reValidateMode: 'onChange', // Перевалидация при изменении после первой валидации
    defaultValues: {
      budget: 0,
      comment: null,
      tbids_entertainment_attrs: {
        provision_time: undefined as unknown as Date,
        adults_qty: 1,
      }
    }
  });

  const onSubmit = async (data: EntertainmentRequestData) => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const responseData = await createEntertainmentRequest(data);
      setResult({
        success: true,
        message: 'Заявка на туры/активности успешно отправлена!',
        requestId: responseData.id
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