'use client';

import React from 'react';
import { ArticleType } from '@/lib/article/searchArticles';

interface ArticlesListProps {
  articles: ArticleType[];
}

/**
 * Клиентский компонент для отображения списка статей.
 * Статьи отображаются в горизонтальном скролле.
 */
export const ArticlesList: React.FC<ArticlesListProps> = ({ articles }) => {

  if (articles.length === 0) {
    return (
      <div className="py-8 text-center">
        <p
          className="text-[#707579]"
          style={{
            fontSize: '14px',
            fontWeight: 400,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Скоро добавим интересные статьи для вашей локации
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Контейнер со скроллом */}
      <div
        className="overflow-x-auto scrollbar-hide"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
        }}
      >
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {articles.map((article, index) => (
            <ArticleCard key={index} article={article} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Компонент карточки статьи.
 */
const ArticleCard: React.FC<{ article: ArticleType; index: number }> = ({ article, index }) => {
  // Константа: максимальное количество символов на всю карточку
  const MAX_CARD_CHARS = 115;

  const handleClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  // Получаем градиент для картинки (если image === null)
  const getGradient = (articleIndex: number) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return gradients[articleIndex % gradients.length];
  };

  // Truncate text helper
  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Вычисляем доступное количество символов для описания
  const titleLength = article.title?.length || 0;
  const availableCharsForDescription = Math.max(0, MAX_CARD_CHARS - titleLength);
  
  // Если заголовок >= 200 символов, показываем "Это интересно!" вместо описания
  const descriptionText = titleLength >= MAX_CARD_CHARS 
    ? 'Это интересно!' 
    : truncateText(article.description || '', availableCharsForDescription);

  const imageStyle = article.image
    ? {
        backgroundImage: `url(${JSON.stringify(article.image)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: getGradient(index),
      };

  return (
    <div
      className="bg-white rounded-[24px] overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
      style={{ fontFamily: 'Inter, sans-serif', width: 'calc(100vw - 6rem)', minWidth: 'calc(100vw - 6rem)', flexShrink: 0 }}
    >
      <div className="flex h-60">
        {/* Article image - 1/3 width */}
        <div
          className="w-1/3 h-full"
          style={imageStyle}
        ></div>

        {/* Article content - 2/3 width */}
        <div className="w-2/3 p-4 flex flex-col justify-between">
          {/* Top section: title */}
          <div className="mb-2">
            <h3
              className="text-black font-semibold mb-1"
              style={{ fontWeight: 600, fontSize: '15px' }}
            >
              {article.title}
            </h3>
          </div>

          {/* Middle section: description */}
          <div className="mb-3 flex-1">
            <p
              className="text-xs leading-relaxed line-clamp-3"
              style={{ color: '#333333', fontWeight: 400 }}
            >
              {descriptionText}
            </p>
          </div>

          {/* Bottom section: button */}
          <div className="flex items-center justify-end">
            <button
              className="text-xs font-semibold transition-colors hover:opacity-80"
              style={{
                color: '#007AFF',
                fontWeight: 600,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Читать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
