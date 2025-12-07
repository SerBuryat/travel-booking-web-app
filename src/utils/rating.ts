/**
 * Форматирует рейтинг сервиса для отображения
 * @param rating - рейтинг сервиса (string или undefined)
 * @returns отформатированная строка рейтинга или 'Нет оценок'
 */
export function formatRating(rating?: string | null): string {
  if (!rating || rating === '0.00' || rating === '0') {
    return 'Нет оценок';
  }
  return `${rating}/5`;
}

