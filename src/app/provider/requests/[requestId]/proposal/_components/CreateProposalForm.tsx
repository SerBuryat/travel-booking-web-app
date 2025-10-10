'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceType } from '@/model/ServiceType';
import { HorizontalViewServiceComponent } from '@/components/HorizontalViewServiceComponent';
import { createProposal } from '@/lib/request/provider/proposal/createProposal';

interface CreateProposalFormProps {
  requestId: number;
  services: ServiceType[];
}

/**
 * Форма создания предложения провайдера
 */
export function CreateProposalForm({ requestId, services }: CreateProposalFormProps) {
  const [selectedServices, setSelectedServices] = useState<Set<number>>(new Set());
  const [price, setPrice] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  
  const router = useRouter();

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedServices.size === 0) {
      setError('Выберите хотя бы один сервис');
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('Введите корректную цену');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createProposal({
        requestId,
        serviceIds: Array.from(selectedServices),
        price: priceValue,
        comment: comment.trim() || undefined
      });

      if (result.success) {
        router.push('/provider/requests?success=proposal_created');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Произошла ошибка при создании предложения');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Список сервисов для выбора */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Выберите подходящие сервисы ({selectedServices.size} выбрано)
        </h3>
        <div className="space-y-2">
          {services.map((service) => (
            <div key={service.id} className="relative">
              <div
                className={`cursor-pointer transition-all ${
                  selectedServices.has(service.id)
                    ? 'ring-2 ring-blue-500 ring-opacity-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleServiceToggle(service.id)}
              >
                <HorizontalViewServiceComponent service={service} onClick={() => {}} />
              </div>
              
              {/* Чекбокс */}
              <div className="absolute top-2 right-2">
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    selectedServices.has(service.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {selectedServices.has(service.id) && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Поля ввода */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Цена за все <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Комментарий (опционально)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Дополнительная информация для клиента..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Кнопки */}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isSubmitting || selectedServices.size === 0}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Создание...' : 'Отправить отклик'}
        </button>
      </div>
    </form>
  );
}
