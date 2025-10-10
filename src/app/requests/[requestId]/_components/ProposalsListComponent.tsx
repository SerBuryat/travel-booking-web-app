'use client';

import React from 'react';
import { ProposalView } from '@/lib/request/client/proposal/getRequestProposals';
import { HorizontalViewServiceComponent } from '@/components/HorizontalViewServiceComponent';
import { formatDateToDDMMYYHHmm } from '@/utils/date';

interface ProposalsListComponentProps {
  proposals: ProposalView[];
  count: number;
}

export default function ProposalsListComponent({ proposals, count }: ProposalsListComponentProps) {
  if (count === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Отклики провайдеров</h2>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Пока нет откликов от провайдеров</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Отклики провайдеров ({count})
      </h2>
      
      <div className="space-y-6">
        {proposals.map((proposal, index) => (
          <ProposalItem key={`${proposal.provider.id}_${proposal.created_at}_${index}`} proposal={proposal} />
        ))}
      </div>
    </div>
  );
}

function ProposalItem({ proposal }: { proposal: ProposalView }) {
  const formatPrice = (price: string | null) => {
    if (!price) return 'Цена не указана';
    return `${price} ₽`;
  };

  const formatOriginalPrice = (price: string) => {
    return `${price} ₽`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Информация о предложении */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Провайдер:</span> {proposal.provider.company_name}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Телефон:</span> {proposal.provider.phone}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {formatDateToDDMMYYHHmm(new Date(proposal.created_at))}
          </div>
        </div>
        
        {proposal.comment && (
          <div className="bg-gray-50 rounded-md p-3 mt-2">
            <div className="text-sm">
              <span className="font-medium text-gray-600">Комментарий:</span>
              <p className="mt-1 text-gray-800">{proposal.comment}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Сервисы */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-600 mb-3">
          Предлагаемые сервисы ({proposal.services.length}):
        </h4>
        <div className="space-y-3">
          {proposal.services.map((serviceItem) => (
            <div key={serviceItem.id} className="bg-gray-50 rounded-lg p-3">
              {/* Информация о ценах для каждого сервиса */}
              <div className="flex items-center space-x-6 mb-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Оригинальная цена:</span>
                  <span className="ml-1 text-gray-800">{formatOriginalPrice(serviceItem.originalPrice)}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Предложенная цена:</span>
                  <span className="ml-1 font-bold text-green-600">{formatPrice(serviceItem.price)}</span>
                </div>
              </div>
              
              {/* Сервис */}
              <HorizontalViewServiceComponent service={serviceItem.service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
