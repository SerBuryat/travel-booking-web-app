import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const categories = await prisma.tcategories.findMany({
    where: { parent_id: null },
    select: {
      id: true,
      name: true,
      code: true,
      photo: true,
    },
    orderBy: { id: 'asc' },
  });
  return NextResponse.json(categories);
} 