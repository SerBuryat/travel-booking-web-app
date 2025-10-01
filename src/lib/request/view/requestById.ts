"use server";

import { prisma } from "@/lib/db/prisma";
import { formatDateToDDMMYYHHmm } from "@/utils/date";
import { AnyRequestView } from "./types";
import { resolveAttributesInclude } from "../attributesResolver";

export async function requestById(id: number, currentUserId: number): Promise<AnyRequestView> {
  // First, get the basic bid info with category to determine request type
  const bid = await prisma.tbids.findFirst({
    where: { id },
    include: {
      tarea: { select: { name: true } },
      tcategories: { select: { name: true, sysname: true } },
    },
  });

  if (!bid) {
    throw new Error('NOT_FOUND');
  }

  // Check ownership
  if (bid.tclients_id !== currentUserId) {
    throw new Error('NOT_FOUND');
  }

  const requestType = bid.tcategories?.sysname ?? '';
  const { include, mapAttributes } = resolveAttributesInclude(requestType);

  // Get the bid with attributes
  const bidWithAttributes = await prisma.tbids.findUnique({
    where: { id },
    include: {
      tarea: { select: { name: true } },
      tcategories: { select: { name: true, sysname: true } },
      ...include,
    },
  });

  if (!bidWithAttributes) {
    throw new Error('NOT_FOUND');
  }

  // Base request data
  const baseRequest = {
    id: bidWithAttributes.id,
    number: bidWithAttributes.number ?? '',
    areaName: bidWithAttributes.tarea.name,
    categoryName: bidWithAttributes.tcategories?.name ?? '',
    status: bidWithAttributes.status as any,
    createdAt: formatDateToDDMMYYHHmm(bidWithAttributes.created_at),
    requestType,
    budget: bidWithAttributes.budget.toFixed(2),
    comment: bidWithAttributes.comment,
  };

  // Get attributes based on request type
  const attributes = (() => {
    switch (requestType) {
      case 'accomodation':
        const accomAttrs = bidWithAttributes.tbids_accomodation_attrs?.[0];
        return accomAttrs ? mapAttributes(accomAttrs) : {};
      case 'transport':
        const transportAttrs = bidWithAttributes.tbids_transport_attrs?.[0];
        return transportAttrs ? mapAttributes(transportAttrs) : {};
      case 'entertainment':
        const entertainmentAttrs = bidWithAttributes.tbids_entertainment_attrs?.[0];
        return entertainmentAttrs ? mapAttributes(entertainmentAttrs) : {};
      default:
        return {};
    }
  })();

  return { ...baseRequest, ...attributes } as AnyRequestView;
}
