'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  CreateServiceData,
  createServiceSchema,
} from '@/schemas/service/createServiceSchema';
import { useAuth } from '@/contexts/AuthContext';
import { updateService } from '@/lib/provider/servicesEdit';
import type { ServiceEditData, PhotoUpdateData } from '@/lib/provider/servicesEdit';
import { PAGE_ROUTES } from '@/utils/routes';

export interface ServiceUpdateResult {
  success: boolean;
  message: string;
  error?: string;
}

interface UseProvideEditServiceProps {
  serviceId: number;
  initialData: ServiceEditData;
}

export const useProvideEditService = ({ serviceId, initialData }: UseProvideEditServiceProps) => {
  const [result, setResult] = useState<ServiceUpdateResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<CreateServiceData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description || '',
      price: initialData.price,
      tcategories_id: initialData.tcategories_id,
      address: initialData.address,
      tarea_id: initialData.tarea_id,
      phone: initialData.phone || '',
      tg_username: initialData.tg_username || '',
      serviceOptions: initialData.serviceOptions || [],
    },
  });

  // Обновляем форму при изменении initialData
  useEffect(() => {
    form.reset({
      name: initialData.name,
      description: initialData.description || '',
      price: initialData.price,
      tcategories_id: initialData.tcategories_id,
      address: initialData.address,
      tarea_id: initialData.tarea_id,
      phone: initialData.phone || '',
      tg_username: initialData.tg_username || '',
      serviceOptions: initialData.serviceOptions || [],
    });
  }, [initialData, form]);

  const onSubmit = async (data: CreateServiceData, photos?: PhotoUpdateData) => {
    if (!user) {
      setResult({
        success: false,
        message: 'Пользователь не аутентифицирован',
        error: 'Authentication required',
      });
      return;
    }

    if (!photos) {
      setResult({
        success: false,
        message: 'Необходимо загрузить фотографии',
        error: 'Photos required',
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      // Обновляем сервис
      await updateService(serviceId, data, photos);

      setResult({
        success: true,
        message: 'Сервис успешно обновлен!',
      });

    } catch (error) {
      console.error('Ошибка обновления сервиса:', error);
      setResult({
        success: false,
        message: 'Произошла ошибка при обновлении сервиса',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
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
    onSubmit,
    isSubmitting,
    errors: form.formState.errors,
    result,
    resetResult,
  };
};

