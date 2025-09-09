import { NextResponse } from 'next/server';
import { AreaService } from '@/service/AreaService';

export async function GET() {
  try {
    const areas = await AreaService.getAll();

    return NextResponse.json({
      success: true,
      areas: areas
    });

  } catch (error) {
    console.error('Ошибка получения зон:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Ошибка получения зон'
      },
      { status: 500 }
    );
  }
}
