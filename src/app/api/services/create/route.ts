import { NextRequest, NextResponse } from 'next/server';
import { ServiceRegistrationService } from '@/service/ServiceRegistrationService';
import { ServiceCreateModel } from '@/model/ServiceCreateModel';

export async function POST(request: NextRequest) {
  try {
    // Парсинг JSON из тела запроса
    const body = await request.json();
    
    // Валидация обязательных полей
    if (!body.name || !body.description || !body.price || !body.tcategories_id || !body.address || !body.tarea_id) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['name', 'description', 'price', 'tcategories_id', 'address', 'tarea_id']
        },
        { status: 400 }
      );
    }

    // Создание модели данных
    const serviceData: ServiceCreateModel = {
      name: body.name,
      description: body.description,
      price: body.price,
      tcategories_id: Number(body.tcategories_id),
      address: body.address,
      tarea_id: Number(body.tarea_id),
      phone: body.phone,
      tg_username: body.tg_username,
      serviceOptions: body.serviceOptions || []
    };

    // Валидация числовых полей
    if (!Number.isFinite(serviceData.tcategories_id) || !Number.isFinite(serviceData.tarea_id)) {
      return NextResponse.json(
        { error: 'Invalid category_id or area_id' },
        { status: 400 }
      );
    }

    // Валидация цены
    if (isNaN(parseFloat(serviceData.price)) || parseFloat(serviceData.price) <= 0) {
      return NextResponse.json(
        { error: 'Invalid price value' },
        { status: 400 }
      );
    }

    // Создание сервиса через сервисный слой
    const serviceRegistrationService = new ServiceRegistrationService();
    const createdService = await serviceRegistrationService.createService(serviceData);

    // Возврат успешного ответа
    return NextResponse.json(
      { 
        success: true,
        message: 'Service created successfully',
        service: createdService
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create service error:', error);
    
    // Обработка известных ошибок
    if (error instanceof Error) {
      if (error.message === 'Required fields are missing') {
        return NextResponse.json(
          { error: 'Required fields are missing' },
          { status: 400 }
        );
      }
      if (error.message === 'Price must be greater than 0') {
        return NextResponse.json(
          { error: 'Price must be greater than 0' },
          { status: 400 }
        );
      }
    }

    // Общая ошибка сервера
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
