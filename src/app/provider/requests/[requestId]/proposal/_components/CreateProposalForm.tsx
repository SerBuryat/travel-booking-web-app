'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProposalServiceType } from '@/lib/request/provider/proposal/getProviderServicesForRequest';
import { HorizontalViewServiceComponent } from '@/components/HorizontalViewServiceComponent';
import { createProposal } from '@/lib/request/provider/proposal/createProposal';

interface CreateProposalFormProps {
  requestId: number;
  services: ProposalServiceType[];
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

  // Проверяем, все ли сервисы использованы
  const allServicesUsed = services.length > 0 && services.every(service => service.isUsedInProposal);
  const availableServices = services.filter(service => !service.isUsedInProposal);

  const handleServiceToggle = (serviceId: number) => {
    // Не позволяем выбирать уже использованные сервисы
    const service = services.find(s => s.id === serviceId);
    if (service?.isUsedInProposal) {
      return;
    }

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

    // Цена теперь опциональна
    let priceValue: number | undefined;
    if (price.trim()) {
      priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        setError('Введите корректную цену');
        return;
      }
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
    <div className={`space-y-6 ${allServicesUsed ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Сообщение, если все сервисы использованы */}
      {allServicesUsed && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Все сервисы уже использованы
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Вы уже создали предложения для всех подходящих сервисов по этой заявке. 
                  Новые предложения создать невозможно.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
      {/* Список сервисов для выбора */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {allServicesUsed 
            ? `Все сервисы использованы (${services.length} из ${services.length})`
            : `Выберите подходящие сервисы (${selectedServices.size} выбрано из ${availableServices.length} доступных)`
          }
        </h3>
        <div className="space-y-3">
          {services.map((service) => {
            const isSelected = selectedServices.has(service.id);
            
            return (
              <div key={service.id} className="relative">
                <div
                  className={`cursor-pointer transition-all duration-200 rounded-lg ${
                    service.isUsedInProposal 
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                  }`}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  <HorizontalViewServiceComponent service={service} onClick={() => {}} />
                </div>
                
                {/* Минималистичный индикатор */}
                {!service.isUsedInProposal && (
                  <div className="absolute top-3 right-3">
                    {isSelected ? (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full bg-white"></div>
                    )}
                  </div>
                )}
                
                {/* Статус для использованных сервисов */}
                {service.isUsedInProposal && (
                  <div className="absolute top-3 right-3">
                    <div className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                      Использован
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Поля ввода */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Цена за все (опционально)
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
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
          disabled={isSubmitting || selectedServices.size === 0 || allServicesUsed}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Создание...' : allServicesUsed ? 'Нет доступных сервисов' : 'Отправить отклик'}
        </button>
      </div>
    </form>
    </div>
  );
}
