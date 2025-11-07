import React from 'react';
import {notFound, redirect} from 'next/navigation';
import { withUserAuth } from '@/lib/auth/withUserAuth';
import { requestById } from '@/lib/request/client/view/requestById';
import { AnyRequestView } from '@/lib/request/client/view/types';
import AccomodationRequestViewComponent from '../_components/detail/AccomodationRequestViewComponent';
import TransportRequestViewComponent from '../_components/detail/TransportRequestViewComponent';
import EntertainmentRequestViewComponent from '../_components/detail/EntertainmentRequestViewComponent';
import FoodRequestViewComponent from '../_components/detail/FoodRequestViewComponent';
import HealthRequestViewComponent from '../_components/detail/HealthRequestViewComponent';
import PackageRequestViewComponent from '../_components/detail/PackageRequestViewComponent';
import {RequestType} from "@/lib/request/requestType";
import { getRequestProposals } from '@/lib/request/client/proposal/getRequestProposals';
import ProposalsListComponent from './_components/ProposalsListComponent';
import {PAGE_ROUTES} from "@/utils/routes";
import { 
  CategoryField, 
  AreaField, 
  BudgetField, 
  CommentField, 
  CreatedAtField, 
  StatusField 
} from '../_components/fields';

type Props = {
  params: { requestId: string };
};

export default async function RequestDetailPage({ params }: Props) {
  const { requestId } = await params;
  const requestIdNum = Number(requestId);

  if(!requestIdNum) {
    redirect(PAGE_ROUTES.ERROR);
  }
  
  const [request, proposalsResult] = await withUserAuth(async ({ userAuth }) => {
    try {
      const [requestData, proposalsData] = await Promise.all([
        requestById(requestIdNum, userAuth),
        getRequestProposals(requestIdNum)
      ]);
      return [requestData, proposalsData];
    } catch (error) {
      if (error instanceof Error && error.message === 'NOT_FOUND') {
        return [null, null];
      }
      throw error;
    }
  });

  if (!request) {
    notFound();
  }

  const renderRequestComponent = (request: AnyRequestView) => {
    switch (request.requestType) {
      case RequestType.ACCOMMODATION:
        return <AccomodationRequestViewComponent data={request as any} />;
      case RequestType.TRANSPORT:
        return <TransportRequestViewComponent data={request as any} />;
      case RequestType.ENTERTAINMENT:
        return <EntertainmentRequestViewComponent data={request as any} />;
      case RequestType.FOOD:
        return <FoodRequestViewComponent data={request as any} />;
      case RequestType.HEALTH:
        return <HealthRequestViewComponent data={request as any} />;
      case RequestType.PACKAGE:
        return <PackageRequestViewComponent data={request as any} />;
      default:
        return <DefaultRequestViewComponent data={request} />;
    }
  };

  return (
    <div className="w-full mx-auto pt-2 px-4 bg-[#FCFCFC]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Заявка №{request.number}</h1>
      
      <div className="grid grid-cols-2 gap-3">
        {renderRequestComponent(request)}
      </div>
      
      {/* Отображение предложений */}
      {proposalsResult && (
        <ProposalsListComponent 
          proposals={proposalsResult.proposals} 
          count={proposalsResult.count} 
        />
      )}
    </div>
  );
}

function DefaultRequestViewComponent({ data }: { data: AnyRequestView }) {
  return (
    <>
      <CategoryField categoryName={data.categoryName} />
      <AreaField areaName={data.areaName} />
      <BudgetField budget={data.budget} />
      <CommentField comment={data.comment} />
      <CreatedAtField createdAt={data.createdAt} />
      <StatusField status={data.status} />
    </>
  );
}
