import React from 'react';
import { searchArticles } from '@/lib/article/searchArticles';
import { ArticlesList } from './ArticlesList';

/**
 * Серверный компонент для получения и отображения списка статей по текущей локации пользователя.
 * Статьи отображаются в горизонтальном скролле.
 */
export const AreaArticlesComponent: React.FC = async () => {
  const articles = await searchArticles();

  return (
    <div className="px-4 py-4">
      {/* Заголовок */}
      <div className="mb-4">
        <span
          className="text-[#707579]"
          style={{
            fontSize: '13px',
            fontWeight: 400,
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
          }}
        >
          СТАТЬИ
        </span>
      </div>

      {/* Горизонтальный скролл статей или сообщение об отсутствии */}
      <ArticlesList articles={articles} />
    </div>
  );
};

