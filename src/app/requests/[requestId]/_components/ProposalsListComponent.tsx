'use client';

import React from 'react';
import { ProposalView } from '@/lib/request/client/proposal/getRequestProposals';
import ProposalItem from './ProposalItem';

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
      <h3 className="font-bold text-gray-800 mb-4">
        Отклики: {count}
      </h3>
      
      <div className="space-y-6">
        {proposals.map((proposal, index) => (
          <ProposalItem key={`${proposal.provider.id}_${proposal.created_at}_${index}`} proposal={proposal} />
        ))}
      </div>
    </div>
  );
}
