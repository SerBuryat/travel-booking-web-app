import {redirect} from 'next/navigation';
import ProviderServicesComponent from './_components/ProviderServicesComponent';
import {PAGE_ROUTES} from "@/utils/routes";
import {getUserAuthOrThrow, UserAuth} from "@/lib/auth/getUserAuth";
import {servicesForProvider} from "@/lib/service/searchServices";
import Link from 'next/link';
import { parentCategories } from '@/lib/category/searchCategories';
import { CategoryEntity } from '@/entity/CategoryEntity';
import { ToastProvider, ToastContainer } from '@/components/Toast';

export default async function ProviderServicesPage() {

  let userAuth: UserAuth;
  try {
    userAuth = await getUserAuthOrThrow();
  } catch (error) {
    console.log('Error in ProviderServicesPage - server side', error);
    redirect(PAGE_ROUTES.WEB_AUTH);
  }

  if (userAuth.role !== 'provider' || !userAuth.providerId) {
    console.log(
        '[ProviderServicesPage] Невозможно отобразить сервисы провайдера для пользователя. ' +
        'Отстутствует роль или `providerId`', userAuth
    )
    redirect(PAGE_ROUTES.HOME);
  }

  const services = await servicesForProvider(userAuth.providerId);

  // Early empty state: skip heavy logic and show friendly prompt
  if (!services || services.length === 0) {
    return (
        <ToastProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Мои объекты
                </h1>
              </div>

              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  У вас пока нет объектов
                </h2>
                <p className="text-gray-600 mb-6">
                  Добавьте первый объект, и он появится в этом списке.
                </p>
                <Link
                    href={PAGE_ROUTES.PROVIDER.CREATE_SERVICE}
                    className="inline-flex items-center gap-2 text-black"
                    style={{
                      backgroundColor: '#95E59D',
                      borderRadius: 30,
                      fontSize: 16,
                      fontWeight: 500,
                      padding: '10px 20px',
                      cursor: 'pointer',
                    }}
                >
                  добавить новый объект
                </Link>
              </div>
            </div>
          </div>
          <ToastContainer />
        </ToastProvider>
    );
  }

  const parents = await parentCategories();

  // Build mapping parentId -> services[]
  const parentToServices: Record<number, typeof services> = {} as Record<number, typeof services>;
  (parents as CategoryEntity[]).forEach((p) => { parentToServices[p.id] = []; });
  for (const s of services) {
    const parentId = s.category?.parent_id ?? s.category?.id ?? null;
    if (parentId && parentToServices[parentId]) {
      parentToServices[parentId].push(s);
    }
  }

  return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Мои объекты
              </h1>
            </div>

            <ProviderServicesComponent parents={parents as CategoryEntity[]} parentToServices={parentToServices} />

            {/* Sticky Add Service Button */}
            <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 flex justify-center" style={{ zIndex: 60 }}>
              <Link
                href={PAGE_ROUTES.PROVIDER.CREATE_SERVICE}
                className="text-black"
                style={{
                  backgroundColor: '#95E59D',
                  borderRadius: 30,
                  fontSize: 17,
                  fontWeight: 400,
                  padding: '7px 20px',
                  cursor: 'pointer',
                  opacity: 1
                }}
              >
                добавить новый объект
              </Link>
            </div>
          </div>
        </div>
        <ToastContainer />
      </ToastProvider>
  );
}
