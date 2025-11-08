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
  const isSubmitDisabled = isSubmitting || selectedServices.size === 0 || allServicesUsed;

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
    <div className="space-y-6 bg-white">
      {/* Сообщение, если все сервисы использованы */}
      {allServicesUsed && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Все объекты уже использованы
              </h3>
              <p className="text-xs text-yellow-700 leading-relaxed">
                Вы создали предложения для всех подходящих объектов. Добавьте новый объект, чтобы отправить еще одно предложение.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Список сервисов для выбора */}
        <div className="space-y-3">
          <span className="inline-block text-xs font-medium uppercase tracking-wide" style={{ color: '#707579' }}>
            {allServicesUsed
              ? `Объекты недоступны (${services.length} из ${services.length})`
              : `${selectedServices.size} из ${availableServices.length || services.length} доступных`}
          </span>

          <div className="space-y-3">
            {services.map((service) => {
              const isSelected = selectedServices.has(service.id);
              
              return (
                <div key={service.id} className="relative">
                  <div
                    className={`cursor-pointer transition-all duration-200 rounded-[24px] ${
                      service.isUsedInProposal 
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-md'
                    }`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <HorizontalViewServiceComponent service={service} onClick={() => {}} />
                  </div>
                  
                  {/* Минималистичный индикатор */}
                  {!service.isUsedInProposal && (
                    <div className="absolute top-3 right-3">
                      {isSelected ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: '#95E59D' }}>
                          <svg className="h-3 w-3 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white" />
                      )}
                    </div>
                  )}
                  
                  {/* Статус для использованных сервисов */}
                  {service.isUsedInProposal && (
                    <div className="absolute top-3 right-3">
                      <div className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-600">
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <label
              htmlFor="price"
              className="block text-sm font-medium mb-0 pl-2"
              style={{
                color: '#A2ACB0',
                marginLeft: '8px',
                marginTop: '4px',
                marginBottom: '-8px',
                zIndex: 10,
                position: 'relative',
                width: 'fit-content',
                background: 'white',
                paddingLeft: '4px',
                paddingRight: '4px'
              }}
            >
              Цена за все
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              inputMode="decimal"
              className="w-full px-3 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-[#A2ACB0] border-gray-300"
              style={{ borderRadius: '14px' }}
            />
          </div>
          
          <div className="relative">
            <label
              htmlFor="comment"
              className="block text-sm font-medium mb-0 pl-2"
              style={{
                color: '#A2ACB0',
                marginLeft: '8px',
                marginTop: '4px',
                marginBottom: '-8px',
                zIndex: 10,
                position: 'relative',
                width: 'fit-content',
                background: 'white',
                paddingLeft: '4px',
                paddingRight: '4px'
              }}
            >
              Комментарий
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Дополнительная информация для клиента..."
              rows={3}
              className="w-full resize-none px-3 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-[#A2ACB0] border-gray-300"
              style={{ borderRadius: '14px' }}
            />
          </div>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Кнопка */}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full transition-transform duration-200"
          style={{
            backgroundColor: isSubmitDisabled ? '#DDEFE0' : '#95E59D',
            color: '#000000',
            borderRadius: '128px',
            fontSize: 17,
            fontWeight: 400,
            paddingTop: 12,
            paddingBottom: 12
          }}
        >
          {isSubmitting ? 'Создание...' : allServicesUsed ? 'Нет доступных объектов' : 'Отправить отклик'}
        </button>
      </form>
    </div>
  );
}
