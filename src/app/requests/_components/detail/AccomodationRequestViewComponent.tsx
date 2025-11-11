"use client";

import React from "react";
import { AccomodationRequestView } from "@/lib/request/client/view/types";
import { 
  CategoryField, 
  AreaField, 
  BudgetField, 
  CommentField, 
  AdultsField, 
  DatesField 
} from '../fields';

type Props = {
  data: AccomodationRequestView;
};

export default function AccomodationRequestViewComponent({ data }: Props) {
  return (
    <>
      <CategoryField categoryName={data.categoryName} />
      <AreaField areaName={data.areaName} />
      <DatesField dateFrom={data.dateFrom} dateTo={data.dateTo} />
      {data.adultsQty && <AdultsField adultsQty={data.adultsQty} />}
      <BudgetField budget={data.budget} />
      <CommentField comment={data.comment} />
    </>
  );
}
