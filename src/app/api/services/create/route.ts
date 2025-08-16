import { NextRequest, NextResponse } from 'next/server';
import { ServiceRegistrationService } from '@/service/ServiceRegistrationService';
import { ServiceCreateModel } from '@/model/ServiceCreateModel';
import { getServerUser } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  try {
    // Получаем данные пользователя с валидацией токена
    const user = await getServerUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Парсинг JSON из тела запроса
    const body = await request.json();
    
    // Валидация обязательных полей сервиса
    if (!body.name || !body.description || !body.price || !body.tcategories_id || !body.address || !body.tarea_id) {
      return NextResponse.json(
        { 
          error: 'Missing required service fields',
          required: ['name', 'description', 'price', 'tcategories_id', 'address', 'tarea_id']
        },
        { status: 400 }
      );
    }

    // Валидация обязательных полей провайдера
    if (!body.providerCompanyName || !body.providerContactPerson || !body.providerPhone) {
      return NextResponse.json(
        { 
          error: 'Missing required provider fields',
          required: ['providerCompanyName', 'providerContactPerson', 'providerPhone']
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
      serviceOptions: body.serviceOptions || [],
      // Новые поля провайдера
      providerCompanyName: body.providerCompanyName,
      providerContactPerson: body.providerContactPerson,
      providerPhone: body.providerPhone
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
    const createdService = await serviceRegistrationService.createService(serviceData, user.id);

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
          { error: 'Required service fields are missing' },
          { status: 400 }
        );
      }
      if (error.message === 'Provider information is required') {
        return NextResponse.json(
          { error: 'Provider information is required' },
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
