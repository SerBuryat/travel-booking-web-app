'use server';

import { prisma } from '@/lib/db/prisma';
import { currentLocation } from '@/lib/location/currentLocation';

/**
 * Дефолтное описание для статей, если не удалось получить описание с сайта
 */
const DEFAULT_ARTICLE_DESCRIPTION = 'Интересная статья, посмотрите — вам понравится';

/**
 * Тип данных статьи для возврата на фронтенд
 */
export type ArticleType = {
  url: string;
  title: string;
  description: string;
  image: string | null;
};

/**
 * Тип данных, полученных с сайта через fetchArticlesData
 */
type ArticleData = {
  title: string;
  description: string;
  image: string | null;
};

/**
 * Получение списка статей для текущей локации пользователя.
 * 
 * Логика:
 * - Получает areaId через currentLocation()
 * - Загружает активные статьи из БД, отсортированные по priority
 * - Для статей с upload_time === null фетчит данные с сайта и обновляет БД
 * - Для статей с upload_time !== null использует данные из БД
 * - Фильтрует статьи без title (логирует ошибку)
 * 
 * @returns {Promise<ArticleType[]>} Массив статей для отображения
 */
export async function searchArticles(): Promise<ArticleType[]> {
  try {
    // Получаем текущую локацию пользователя
    const location = await currentLocation();
    if (!location) {
      console.error('[searchArticles] Не удалось получить текущую локацию пользователя');
      return [];
    }

    const areaId = location.id;

    // Получаем статьи из БД
    const dbArticles = await prisma.tarticles.findMany({
      where: {
        tarea_id: areaId,
        is_active: true,
      },
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        image: true,
        upload_time: true,
        priority: true,
      },
      orderBy: {
        priority: 'desc',
      },
    });

    if (dbArticles.length === 0) {
      return [];
    }

    // Обрабатываем каждую статью параллельно
    const processedArticlesPromises = dbArticles.map(async (article) => {
      try {
        let articleData: ArticleData;

        // Если upload_time === null, фетчим данные с сайта
        if (article.upload_time === null) {
          const fetchedData = await fetchArticlesData(article.url);

          // Если не удалось получить данные или нет title, пропускаем статью
          if (!fetchedData || !fetchedData.title) {
            if (!fetchedData) {
              console.error(`[searchArticles] Не удалось получить данные для статьи: ${article.url}`);
            } else {
              console.error(`[searchArticles] Статья без title: ${article.url}`);
            }
            return null;
          }

          // Обновляем запись в БД (description уже содержит дефолт если не получен)
          try {
            await prisma.tarticles.update({
              where: { id: article.id },
              data: {
                title: fetchedData.title,
                description: fetchedData.description, // Сохраняем description (может быть дефолтным)
                image: fetchedData.image,
                upload_time: new Date(),
              },
            });
          } catch (updateError) {
            console.error(`[searchArticles] Ошибка при обновлении статьи в БД (id: ${article.id}, url: ${article.url}):`, updateError);
            // Продолжаем выполнение, используем полученные данные
          }

          articleData = fetchedData;
        } else {
          // Используем данные из БД
          // Проверяем наличие title
          if (!article.title) {
            console.error(`[searchArticles] Статья в БД без title (id: ${article.id}, url: ${article.url})`);
            return null;
          }

          // Используем description из БД (он уже должен быть сохранен, включая дефолт)
          articleData = {
            title: article.title,
            description: article.description || DEFAULT_ARTICLE_DESCRIPTION, // Если по какой-то причине null, используем дефолт
            image: article.image,
          };
        }

        return {
          url: article.url,
          title: articleData.title,
          description: articleData.description,
          image: articleData.image,
        };
      } catch (error) {
        console.error(`[searchArticles] Ошибка при обработке статьи (id: ${article.id}, url: ${article.url}):`, error);
        // Пропускаем проблемную статью, продолжаем обработку остальных
        return null;
      }
    });

    // Ждем завершения всех промисов и фильтруем null значения
    const processedArticlesResults = await Promise.all(processedArticlesPromises);
    const processedArticles = processedArticlesResults.filter(
      (article): article is ArticleType => article !== null
    );

    return processedArticles;
  } catch (error) {
    console.error('[searchArticles] Критическая ошибка:', error);
    return [];
  }
}

/**
 * Приватная функция для получения данных статьи с сайта через OpenGraph/meta теги.
 * Использует библиотеку open-graph-scraper для надежного парсинга.
 * 
 * @param {string} url URL статьи
 * @returns {Promise<ArticleData | null>} Данные статьи или null в случае ошибки
 */
async function fetchArticlesData(url: string): Promise<ArticleData | null> {
  try {
    // Динамический импорт для избежания проблем с SSR/SSG
    const ogs = (await import('open-graph-scraper')).default;
    const { result } = await ogs({
      url,
      timeout: 10000, // 10 секунд таймаут
      // User-Agent устанавливается автоматически библиотекой
    });

    // Извлекаем данные с приоритетом: og:* -> twitter:* -> dc:* -> другие
    const title = result.ogTitle || result.twitterTitle || result.dcTitle || null;
    const description = result.ogDescription || result.twitterDescription || result.dcDescription || DEFAULT_ARTICLE_DESCRIPTION;
    
    // ogImage и twitterImage - это массивы объектов с url
    const ogImageUrl = Array.isArray(result.ogImage) && result.ogImage.length > 0 
      ? result.ogImage[0].url 
      : null;
    const twitterImageUrl = Array.isArray(result.twitterImage) && result.twitterImage.length > 0
      ? result.twitterImage[0].url
      : null;
    const image = ogImageUrl || twitterImageUrl || null;

    // Если нет title, возвращаем null (статья будет отфильтрована)
    if (!title) {
      console.error(`[fetchArticlesData] Не найден title для статьи: ${url}`);
      return null;
    }

    return {
      title: String(title).trim(),
      description: String(description).trim(),
      image: image ? String(image).trim() : null,
    };
  } catch (error) {
    console.error(`[fetchArticlesData] Ошибка при получении данных для ${url}:`, error);
    return null;
  }
}


