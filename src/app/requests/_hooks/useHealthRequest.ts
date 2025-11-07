'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HealthRequestData, healthRequestSchema } from '@/schemas/requests/create';
import { createHealthRequest } from "@/lib/request/client/create/createRequest";

export interface RequestSubmissionResult {
  success: boolean;
  message: string;
  requestId?: number;
  error?: string;
}

export const useHealthRequest = () => {
  const [result, setResult] = useState<RequestSubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HealthRequestData>({
    resolver: zodResolver(healthRequestSchema),
    mode: 'onChange', // Валидация в реальном времени
    defaultValues: {
      budget: 0,
      comment: null,
      tbids_health_attrs: {
        provision_time: undefined as unknown as Date,
        adults_qty: 1,
      }
    }
  });

  const onSubmit = async (data: HealthRequestData) => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const responseData = await createHealthRequest(data);
      setResult({
        success: true,
        message: 'Заявка на здоровье успешно отправлена!',
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

