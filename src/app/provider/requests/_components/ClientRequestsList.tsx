'use client';

import { ProviderClientRequestItem } from '@/lib/request/provider/clientRequestsForProvider';
import { useClientRequestsList, FilterOption } from './_hooks/useClientRequestsList';
import { FILTER_OPTIONS } from './_constants/filterOptions';
import { renderRequestComponent } from './_utils/renderRequestComponent';
import { ExistsProviderProposals } from './ExistsProviderProposals';

interface ClientRequestsListProps {
  providerId: number | null;
  requests: ProviderClientRequestItem[];
}

/**
 * Компонент списка заявок клиентов для провайдеров
 * 
 * Особенности:
 * - Collapsible дизайн: номер заявки + стрелка вниз
 * - При клике раскрывается детальная информация
 * - Разные компоненты для разных типов заявок
 */
export function ClientRequestsList({ providerId, requests }: ClientRequestsListProps) {
  const {
    filter,
    setFilter,
    visibleRequests,
    expandedRequests,
    toggleRequest,
    handleProposalClick,
  } = useClientRequestsList(providerId, requests);

  if (requests.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      <FilterBar filter={filter} setFilter={setFilter} />
      
      {visibleRequests.length === 0 ? (
        <EmptyFilterState />
      ) : (
        <RequestsList
          providerId={providerId}
          requests={visibleRequests}
          expandedRequests={expandedRequests}
          toggleRequest={toggleRequest}
          handleProposalClick={handleProposalClick}
        />
      )}
    </div>
  );
}

/**
 * Компонент для отображения состояния пустого списка
 */
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-gray-500 text-lg">
        Пока нет заявок от клиентов
      </div>
      <p className="text-gray-400 mt-2">
        Новые заявки будут появляться здесь, когда клиенты создадут запросы
      </p>
    </div>
  );
}

/**
 * Компонент для отображения состояния пустого фильтра
 */
function EmptyFilterState() {
  return (
    <div className="text-center py-12">
      <div className="text-gray-500 text-lg">
        Нет заявок по выбранному фильтру
      </div>
      <p className="text-gray-400 mt-2">
        Попробуйте выбрать другой фильтр
      </p>
    </div>
  );
}

/**
 * Компонент панели фильтров
 */
interface FilterBarProps {
  filter: FilterOption;
  setFilter: (filter: FilterOption) => void;
}

function FilterBar({ filter, setFilter }: FilterBarProps) {
  return (
    <div className="mb-3 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
        {FILTER_OPTIONS.map(option => {
          const isActive = filter === option.key;
          return (
            <button
              key={option.key}
              onClick={() => setFilter(option.key)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${isActive ? 'text-white' : ''}`}
              style={{
                backgroundColor: isActive ? '#B0D5FD' : '#F5F5F5',
                color: '#000000',
                fontWeight: 500
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Компонент списка заявок
 */
interface RequestsListProps {
  providerId: number | null;
  requests: ProviderClientRequestItem[];
  expandedRequests: Set<number>;
  toggleRequest: (requestId: number) => void;
  handleProposalClick: (requestId: number) => void;
}

function RequestsList({
  providerId,
  requests,
  expandedRequests,
  toggleRequest,
  handleProposalClick,
}: RequestsListProps) {
  return (
    <div className="space-y-3">
      {requests.map(({ request, isAlertForRequestRead, hasProviderProposal }) => (
        <RequestCard
          key={request.id}
          request={request}
          providerId={providerId}
          isAlertForRequestRead={isAlertForRequestRead}
          hasProviderProposal={hasProviderProposal}
          isExpanded={expandedRequests.has(request.id)}
          onToggle={() => toggleRequest(request.id)}
          onProposalClick={() => handleProposalClick(request.id)}
        />
      ))}
    </div>
  );
}

/**
 * Компонент карточки заявки
 */
interface RequestCardProps {
  request: ProviderClientRequestItem['request'];
  providerId: number | null;
  isAlertForRequestRead: boolean;
  hasProviderProposal: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onProposalClick: () => void;
}

function RequestCard({
  request,
  providerId,
  isAlertForRequestRead,
  hasProviderProposal,
  isExpanded,
  onToggle,
  onProposalClick,
}: RequestCardProps) {
  const isArchived = request.status !== 'open';
  const requestTitleColor = isArchived
    ? 'text-gray-400'
    : isExpanded
      ? 'text-[#007AFF]'
      : 'text-[#131313]';

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      {/* Заголовок заявки */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 flex items-center gap-2 text-left">
          {!isAlertForRequestRead && (
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#007AFF] opacity-80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#005FCC]" />
            </span>
          )}
          <span className={`text-[16px] font-semibold transition-colors ${requestTitleColor}`}>
            Заявка {request.number || request.id}
          </span>
          {isArchived && (
            <span className="text-xs text-gray-400">(архив)</span>
          )}
        </div>
        <div className={`ml-3 flex items-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDownIcon />
        </div>
      </button>

      {/* Детали заявки */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="pt-3">
            {renderRequestComponent(request)}
          </div>
          <div className="mt-3 text-xs text-gray-400 text-right">
            Создано {request.createdAt}
          </div>
          
          {/* Предложения провайдера */}
          {hasProviderProposal && providerId && (
            <ExistsProviderProposals
              requestId={request.id}
              providerId={providerId}
            />
          )}
          
          {/* Кнопка отклика */}
          <div className="mt-4">
            <button
              onClick={isArchived ? undefined : onProposalClick}
              disabled={isArchived}
              className={`w-full transition-transform ${
                isArchived
                  ? 'cursor-not-allowed opacity-50'
                  : 'text-black hover:scale-[1.01]'
              }`}
              style={{
                backgroundColor: isArchived ? '#E5E5E5' : '#95E59D',
                borderRadius: 30,
                fontSize: 17,
                fontWeight: 400,
                padding: '10px 16px'
              }}
            >
              Посмотреть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Иконка стрелки вниз
 */
function ChevronDownIcon() {
  return (
    <svg
      className="w-4 h-4 text-black"
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
