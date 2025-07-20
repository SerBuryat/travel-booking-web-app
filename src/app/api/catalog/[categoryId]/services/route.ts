import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const categoryIdNum = parseInt(categoryId);
    
    if (isNaN(categoryIdNum)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // First, get all child category IDs for the given category
    const childCategories = await prisma.tcategories.findMany({
      where: { parent_id: categoryIdNum },
      select: { id: true },
    });

    // Create array of category IDs: the selected category + all its children
    const categoryIds = [categoryIdNum, ...childCategories.map(cat => cat.id)];

    // Fetch services from all these categories
    const services = await prisma.tservices.findMany({
      where: { 
        tcategories_id: { 
          in: categoryIds 
        } 
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tcategories_id: true,
      },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({ 
      success: true, 
      data: services,
      meta: {
        categoryId: categoryIdNum,
        childCategoryCount: childCategories.length,
        totalCategoriesSearched: categoryIds.length
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 