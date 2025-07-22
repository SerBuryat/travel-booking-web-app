import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryIdsParam = searchParams.get('categoryIds');
  if (categoryIdsParam) {
    const categoryIds = categoryIdsParam.split(',').map(id => Number(id));
    try {
      const services = await prisma.tservices.findMany({
        where: {
          tcategories_id: { in: categoryIds },
        },
      });
      return NextResponse.json({ success: true, data: services });
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Failed to fetch services by categoryIds' }, { status: 500 });
    }
  }
  const tcategories_id = searchParams.get('tcategories_id');
  if (!tcategories_id) {
    return NextResponse.json({ success: false, error: 'Missing tcategories_id' }, { status: 400 });
  }
  try {
    const services = await prisma.tservices.findMany({
      where: { tcategories_id: Number(tcategories_id) },
      select: {
        id: true,
        description: true,
        tcategories_id: true,
        price: true,
      },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 