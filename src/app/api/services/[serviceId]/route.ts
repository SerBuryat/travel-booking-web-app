import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params;
    const serviceIdNum = parseInt(serviceId);
    
    if (isNaN(serviceIdNum)) {
      return NextResponse.json(
        { success: false, error: 'Invalid service ID' },
        { status: 400 }
      );
    }

    const service = await prisma.tservices.findUnique({
      where: { id: serviceIdNum },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tcategories_id: true,
        provider_id: true,
        rating: true,
        rating_count: true,
        status: true,
        created_at: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 