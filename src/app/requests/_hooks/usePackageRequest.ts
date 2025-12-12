'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackageRequestData, packageRequestSchema } from '@/schemas/requests/create';
import { createPackageRequest } from "@/lib/request/client/create/createRequest";
import { log } from '@/lib/utils/logger';
import { generateTraceId } from '@/lib/utils/traceId';
import { useAuth } from '@/contexts/AuthContext';

export interface RequestSubmissionResult {
  success: boolean;
  message: string;
  requestId?: number;
  error?: string;
}

export const usePackageRequest = () => {
  const [result, setResult] = useState<RequestSubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<PackageRequestData>({
    resolver: zodResolver(packageRequestSchema),
    mode: 'onChange', // Валидация при изменении полей
    reValidateMode: 'onChange', // Перевалидация при изменении после первой валидации
    defaultValues: {
      budget: 0,
      comment: null,
      tbids_package_attrs: {
        provision_time: undefined as unknown as Date,
        adults_qty: 1,
        kids_qty: null,
        start_date: undefined as unknown as Date,
        nights_from: 1,
        nights_to: null,
      }
    }
  });

  const onSubmit = async (data: PackageRequestData) => {
    const traceId = generateTraceId();
    setIsSubmitting(true);
    setResult(null);

    log(
      'usePackageRequest',
      'Начало создания заявки на комплексный отдых',
      'info',
      {
        userId: user?.userId,
        budget: data.budget
      },
      undefined,
      traceId
    );

    try {
      const responseData = await createPackageRequest(data, traceId);
      
      log(
        'usePackageRequest',
        'Заявка на комплексный отдых успешно создана',
        'info',
        {
          userId: user?.userId,
          requestId: responseData.id
        },
        undefined,
        traceId
      );

      setResult({
        success: true,
        message: 'Заявка на комплексный отдых успешно отправлена!',
        requestId: responseData.id
      });

      // Сброс формы при успехе
      form.reset();

    } catch (error) {
      log(
        'usePackageRequest',
        'Ошибка создания заявки на комплексный отдых',
        'error',
        {
          userId: user?.userId,
          budget: data.budget
        },
        error,
        traceId
      );
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

