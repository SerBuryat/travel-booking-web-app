'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AccomodationRequestData, accomodationRequestSchema } from '@/schemas/requests/create';
import {createAccommodationRequest} from "@/lib/request/create/createRequest";

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
      budget: 0,
      comment: null,
      tbids_accomodation_attrs: {
        date_from: undefined as unknown as Date,
        date_to: undefined as unknown as Date,
        adults_qty: 1,
        kids_qty: null,
      }
    }
  });

  const onSubmit = async (data: AccomodationRequestData) => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const responseData = await createAccommodationRequest(data);
      setResult({
        success: true,
        message: 'Заявка на проживание успешно отправлена!',
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
