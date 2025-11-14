'use client';

import { useState } from 'react';
import { useProviderProposals } from './useProviderProposals';
import { ProviderProposal } from '@/lib/request/provider/proposal/searchProposals';

interface ExistsProviderProposalsProps {
  requestId: number;
  providerId: number | null;
}

/**
 * Компонент для отображения предложений провайдера по заявке
 * 
 * Особенности:
 * - Загружает proposals только при монтировании
 * - Показывает скелетон во время загрузки
 * - Отображает свернутый список предложений (раскрываемый)
 * - Показывает ошибку в желтой рамке при неудаче
 */
export function ExistsProviderProposals({ requestId, providerId }: ExistsProviderProposalsProps) {
  const { proposals, isLoading, error } = useProviderProposals(requestId, providerId);
  const [isExpanded, setIsExpanded] = useState(true);

  if (isLoading) {
    return <ProposalsSkeleton />;
  }

  if (error) {
    return <ProposalsError error={error} />;
  }

  if (proposals.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-3 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
      >
        <h3 className="text-sm font-semibold text-gray-900">
          Ваши отклики: {proposals.length}
        </h3>
        <div className={`ml-2 flex items-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDownIcon />
        </div>
      </button>
      {isExpanded && (
        <div className="space-y-2">
          {proposals.map(proposal => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Компонент карточки предложения (свернутый вид)
 */
function ProposalCard({ proposal }: { proposal: ProviderProposal }) {
  const formatPrice = (price: string | null) => {
    if (!price) return 'Цена не указана';
    return `${price} ₽`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает';
      case 'accepted':
        return 'Принято';
      case 'rejected':
        return 'Отклонено';
      default:
        return status;
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-stretch gap-3">
        {/* Preview photo */}
        <div className="flex-shrink-0">
          <img
            src={proposal.tservices.preview_photo_url}
            alt={proposal.tservices.name}
            className="w-12 h-full rounded object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-service-image-3.jpg';
            }}
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {proposal.tservices.name}
            </h4>
            <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(proposal.status)}`}>
              {getStatusText(proposal.status)}
            </span>
          </div>

          <div className="space-y-1">
            {/* Prices */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Предложенная цена:</span>
              <span className="font-semibold text-[#007AFF]">
                {formatPrice(proposal.price)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Стандартная цена:</span>
              <span className="font-semibold text-gray-900">
                {proposal.tservices.price} ₽
              </span>
            </div>

            {/* Comment (if exists) */}
            {proposal.comment && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600 line-clamp-2">
                  {proposal.comment}
                </p>
              </div>
            )}

            {/* Date */}
            <div className="mt-2 pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-400">
                Создано {formatDate(proposal.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Компонент скелетона загрузки
 */
function ProposalsSkeleton() {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="mb-3">
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        {[1, 2].map(i => (
          <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-stretch gap-3">
              <div className="w-12 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Компонент отображения ошибки
 */
function ProposalsError({ error }: { error: string }) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          {error}
        </p>
      </div>
    </div>
  );
}

/**
 * Иконка стрелки вниз
 */
function ChevronDownIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}
