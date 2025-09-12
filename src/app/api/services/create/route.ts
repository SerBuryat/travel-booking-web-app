import {NextRequest, NextResponse} from 'next/server';
import {ServiceRegistrationService} from '@/service/ServiceRegistrationService';
import {ServiceCreateModel} from '@/model/ServiceCreateModel';
import {getUserAuthOrThrow} from '@/lib/auth/userAuth';
import {withErrorHandling} from '@/lib/api/errorHandler';

async function handlePost(request: NextRequest) {
  const userAuth = await getUserAuthOrThrow();

  const body = await request.json();

  if (!body.name || !body.description || !body.price || !body.tcategories_id || !body.address || !body.tarea_id) {
    return NextResponse.json(
      {
        error: 'Missing required service fields',
        required: ['name', 'description', 'price', 'tcategories_id', 'address', 'tarea_id']
      },
      { status: 400 }
    );
  }

  if (!body.providerCompanyName || !body.providerContactPerson || !body.providerPhone) {
    return NextResponse.json(
      {
        error: 'Missing required provider fields',
        required: ['providerCompanyName', 'providerContactPerson', 'providerPhone']
      },
      { status: 400 }
    );
  }

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
    providerCompanyName: body.providerCompanyName,
    providerContactPerson: body.providerContactPerson,
    providerPhone: body.providerPhone
  };

  if (!Number.isFinite(serviceData.tcategories_id) || !Number.isFinite(serviceData.tarea_id)) {
    return NextResponse.json(
      { error: 'Invalid category_id or area_id' },
      { status: 400 }
    );
  }

  if (isNaN(parseFloat(serviceData.price)) || parseFloat(serviceData.price) <= 0) {
    return NextResponse.json(
      { error: 'Invalid price value' },
      { status: 400 }
    );
  }

  const serviceRegistrationService = new ServiceRegistrationService();
  const createdService = await serviceRegistrationService.createService(serviceData, userAuth.userId);

  return NextResponse.json(
    {
      success: true,
      message: 'Service created successfully',
      service: createdService
    },
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePost, {
  authErrorMessage: 'Unauthorized',
  defaultErrorMessage: 'Internal server error'
});
