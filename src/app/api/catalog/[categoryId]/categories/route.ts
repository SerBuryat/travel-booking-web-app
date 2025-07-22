import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { categoryId: string } }) {
  try {
    const { categoryId } = params;
    const categories = await prisma.tcategories.findMany({
      where: { parent_id: Number(categoryId) },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch child categories' }, { status: 500 });
  }
} 