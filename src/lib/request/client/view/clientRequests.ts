"use server";

import { prisma } from "@/lib/db/prisma";
import { formatDateToDDMMYYHHmm } from "@/utils/date";
import { RequestView } from "@/lib/request/client/view/types";

/**
 * Returns bids of a client, newest first, with area/category names.
 */
export async function clientRequests(clientId: number): Promise<RequestView[]> {
  const bids = await prisma.tbids.findMany({
    where: { tclients_id: clientId },
    include: {
      tarea: { select: { name: true } },
      tcategories: { select: { name: true, sysname: true } },
      tproposals: { select: { id: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return bids.map((bid) => ({
    id: bid.id,
    number: bid.number ?? "",
    areaName: bid.tarea.name,
    categoryName: bid.tcategories?.name ?? "",
    status: bid.status as RequestView["status"],
    createdAt: formatDateToDDMMYYHHmm(bid.created_at),
    requestType: bid.tcategories?.sysname ?? "",
    budget: bid.budget.toFixed(2),
    comment: bid.comment,
    proposalsCount: bid.tproposals.length,
  }));
}



