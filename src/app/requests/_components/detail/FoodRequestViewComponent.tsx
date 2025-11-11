"use client";

import React from "react";
import { FoodRequestView } from "@/lib/request/client/view/types";
import { 
  CategoryField, 
  AreaField, 
  BudgetField, 
  CommentField, 
  AdultsField, 
  ProvisionTimeField 
} from '../fields';

type Props = {
  data: FoodRequestView;
};

export default function FoodRequestViewComponent({ data }: Props) {
  return (
    <>
      <CategoryField categoryName={data.categoryName} />
      <AreaField areaName={data.areaName} />
      <ProvisionTimeField provisionTime={data.provisionTime} />
      {data.adultsQty && <AdultsField adultsQty={data.adultsQty} />}
      <BudgetField budget={data.budget} />
      <CommentField comment={data.comment} />
    </>
  );
}

