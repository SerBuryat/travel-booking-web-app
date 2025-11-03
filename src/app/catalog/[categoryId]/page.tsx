import {notFound, redirect} from 'next/navigation';
import { Header } from '@/components/Header';
import { SearchBarWrapper } from '@/components/SearchBarWrapper';
import { VerticalServicesViewComponent } from '@/components/VerticalServicesViewComponent';
import { servicesForCategories } from '@/lib/service/searchServices';
import { getCategoryNameById } from '@/lib/category/searchCategories';
import { PAGE_ROUTES } from '@/utils/routes';
import {CategoryService} from "@/service/CategoryService";

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const categoryIdNum = Number(categoryId);

  // todo - перевести прямые редиректы на `PAGE_ROUTES`
  if (isNaN(categoryIdNum)) {
    redirect("/error");
  }

  try {
    // Получаем название категории
    const categoryName = await getCategoryNameById(categoryIdNum);

    // todo - поправить, чтобы был отдельный поиск сервисов по parentId
    const categoryService = new CategoryService();
    const categoryWithRelations = await categoryService.getById(categoryIdNum);
    const childCategoriesIds =
        categoryWithRelations.children.map((child) => child.id);
    
    // Получаем сервисы для категории (ограничиваем 10 штуками)
    const services = await servicesForCategories(childCategoriesIds, { take: 10 });

    return (
      <div className="min-h-screen bg-white pb-10">
        <div className="max-w-md mx-auto">
          {/* Header с поисковой строкой */}
          <Header>
            <SearchBarWrapper />
          </Header>

          {/* Заголовок */}
          <div className="px-4 py-4">
            <h1 
              className="text-lg font-semibold text-gray-800"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Сервисы категории: {categoryName}
            </h1>
          </div>

          {/* Список сервисов */}
          <div>
            <VerticalServicesViewComponent services={services}/>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
      </div>
    );
  } catch (error) {
    console.error('Ошибка при загрузке страницы категории:', error);
    return notFound();
  }
}
