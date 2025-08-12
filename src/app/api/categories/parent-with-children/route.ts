import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/service/CategoryService';

export async function GET(request: NextRequest) {
  try {
    const categoryService = new CategoryService();
    const categories = await categoryService.getAllParentWithChildren();

    return NextResponse.json({
      success: true,
      categories: categories
    });

  } catch (error) {
    console.error('Ошибка получения категорий:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Ошибка получения категорий'
      },
      { status: 500 }
    );
  }
}
