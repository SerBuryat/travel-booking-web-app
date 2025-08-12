import { NextRequest, NextResponse } from 'next/server';
import { AreaService } from '@/service/AreaService';

export async function GET(request: NextRequest) {
  try {
    const areaService = new AreaService();
    const areas = await areaService.getAllAreas();

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
