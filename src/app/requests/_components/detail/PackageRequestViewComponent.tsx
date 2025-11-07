"use client";

import React from "react";
import { PackageRequestView } from "@/lib/request/client/view/types";
import { 
  CategoryField, 
  AreaField, 
  BudgetField, 
  CommentField, 
  AdultsField, 
  ProvisionTimeField,
  StartDateField,
  NightsRangeField
} from '../fields';

type Props = {
  data: PackageRequestView;
};

export default function PackageRequestViewComponent({ data }: Props) {
  return (
    <>
      <CategoryField categoryName={data.categoryName} />
      <AreaField areaName={data.areaName} />
      <ProvisionTimeField provisionTime={data.provisionTime} />      
      <BudgetField budget={data.budget} />
      <CommentField comment={data.comment} />
      {/* Количество гостей */}
      {data.adultsQty && <AdultsField adultsQty={data.adultsQty} />}
      {data.kidsQty && (
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Дети</div>
          <div className="text-sm font-medium text-gray-900">{data.kidsQty}</div>
        </div>
      )}
      {/* Дата начала и Ночей - рядом друг с другом */}
      <div className="col-span-2 grid grid-cols-2 gap-3">
        <StartDateField startDate={data.startDate} />
        <NightsRangeField nightsFrom={data.nightsFrom} nightsTo={data.nightsTo} />
      </div>
    </>
  );
}

