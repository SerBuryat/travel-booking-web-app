"use server";

import { prisma } from "@/lib/db/prisma";
import { formatDateToDDMMYYHHmm } from "@/utils/date";
import { MyRequestView } from "@/lib/view/types";

/**
 * Returns bids of a client, newest first, with area/category names.
 */
export async function showMyRequests(clientId: number): Promise<MyRequestView[]> {
  const bids = await prisma.tbids.findMany({
    where: { tclients_id: clientId },
    include: {
      tarea: { select: { name: true } },
      tcategories: { select: { name: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return bids.map((bid) => ({
    number: bid.number ?? "",
    areaName: bid.tarea.name,
    categoryName: bid.tcategories?.name ?? "",
    status: bid.status as MyRequestView["status"],
    createdAt: formatDateToDDMMYYHHmm(bid.created_at),
  }));
}



