'use server';

import { prisma } from "@/lib/db/prisma";
import { DEFAULT_SERVICE_IMAGE_3 } from "@/utils/images";

export interface ProviderProposal {
  id: number;
  tbids_id: number;
  tservices_id: number;
  tproviders_id: number;
  created_at: Date;
  comment: string | null;
  status: string;
  price: string | null;
  tservices: {
    id: number;
    name: string;
    price: string;
    preview_photo_url: string;
  };
}


/**
 * Search proposals for a request
 * @param providerId - The ID of the provider(tproviders.id)
 * @param requestId - The ID of the request(tbids.id)
 * @returns The proposals(ProviderProposal[])
 */
export async function searchProposals(requestId: number, providerId: number): Promise<ProviderProposal[]> {
  const proposals = await prisma.tproposals.findMany({
    where: {
      tbids_id: requestId,
      tproviders_id: providerId,
    },
    include: {
      tservices: {
        include: {
          tphotos: {
            select: {
              url: true,
              is_primary: true,
            },
          },
        },
      },
    },
  });

  return proposals.map(proposal => mapToProviderProposal(proposal));
}

function mapToProviderProposal(proposal: any): ProviderProposal {
  const photos = proposal.tservices.tphotos || [];
  const primaryPhoto = photos.find((photo: any) => photo.is_primary);
  const previewPhoto = primaryPhoto || photos[0];
  const preview_photo_url = previewPhoto?.url || DEFAULT_SERVICE_IMAGE_3;

  return {
    id: proposal.id,
    tbids_id: proposal.tbids_id,
    tservices_id: proposal.tservices_id,
    tproviders_id: proposal.tproviders_id,
    created_at: proposal.created_at,
    comment: proposal.comment,
    status: proposal.status,
    price: proposal.price ? String(proposal.price) : null,
    tservices: {
      id: proposal.tservices.id,
      name: proposal.tservices.name,
      price: String(proposal.tservices.price),
      preview_photo_url,
    },
  };
}