function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatDateToDDMMYYHHmm(date: Date): string {
  const d = new Date(date);
  const day = pad2(d.getDate());
  const month = pad2(d.getMonth() + 1);
  const year = `${d.getFullYear()}`.slice(-2);
  const hours = pad2(d.getHours());
  const minutes = pad2(d.getMinutes());
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

/**
 * Форматирует дату и время из строки БД или Date объекта в формат YYYY-MM-DD HH:mm.
 * 
 * Функция обрабатывает строки формата БД (например, "2026-01-31 16:00:00.000000")
 * без создания Date объекта, чтобы избежать проблем со сдвигом времени.
 * 
 * @param dateValue - Дата в виде строки (формат БД) или Date объекта
 * @returns Отформатированная строка в формате "YYYY-MM-DD HH:mm" или пустая строка при ошибке
 * 
 * @example
 * formatDateTime("2026-01-31 16:00:00.000000") // "2026-01-31 16:00"
 * formatDateTime(new Date("2026-01-31T16:00:00Z")) // "2026-01-31 16:00"
 */
export function formatDateTime(dateValue?: string | Date): string {
  if (!dateValue) return '';
  try {
    // Если это строка в формате БД (2026-01-31 16:00:00.000000), просто обрезаем до YYYY-MM-DD HH:mm
    // НЕ создаем Date объект, чтобы избежать сдвига времени
    if (typeof dateValue === 'string') {
      // Убираем секунды и миллисекунды, оставляем только дату и время до минут
      // Поддерживаем форматы: "2026-01-31 16:00:00.000000" или "2026-01-31T16:00:00.000Z" и т.д.
      const match = dateValue.match(/(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
      if (match) {
        return `${match[1]} ${match[2]}`;
      }
      // Если не удалось распарсить, возвращаем пустую строку вместо создания Date
      return '';
    }
    // Если это Date объект, используем UTC методы для получения исходного значения из БД
    // Prisma возвращает даты как Date объекты, которые могут иметь сдвиг времени
    // Используем UTC методы, чтобы получить то же значение, что хранится в БД
    if (dateValue instanceof Date) {
      if (isNaN(dateValue.getTime())) return '';
      const year = dateValue.getUTCFullYear();
      const month = (dateValue.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = dateValue.getUTCDate().toString().padStart(2, '0');
      const hours = dateValue.getUTCHours().toString().padStart(2, '0');
      const minutes = dateValue.getUTCMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Форматирует дату из строки БД или Date объекта в формат YYYY-MM-DD (только дата, без времени).
 * 
 * Функция обрабатывает строки формата БД без создания Date объекта,
 * чтобы избежать проблем со сдвигом времени.
 * 
 * @param dateValue - Дата в виде строки (формат БД) или Date объекта
 * @returns Отформатированная строка в формате "YYYY-MM-DD" или пустая строка при ошибке
 * 
 * @example
 * formatDateOnly("2026-01-31 16:00:00.000000") // "2026-01-31"
 * formatDateOnly(new Date("2026-01-31T16:00:00Z")) // "2026-01-31"
 */
export function formatDateOnly(dateValue?: string | Date): string {
  if (!dateValue) return '';
  try {
    // Если это строка в формате БД, обрезаем до YYYY-MM-DD (только дата)
    if (typeof dateValue === 'string') {
      const match = dateValue.match(/(\d{4}-\d{2}-\d{2})/);
      return match ? match[1] : '';
    }
    // Если это Date объект, используем UTC методы
    if (dateValue instanceof Date) {
      if (isNaN(dateValue.getTime())) return '';
      const year = dateValue.getUTCFullYear();
      const month = (dateValue.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = dateValue.getUTCDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  } catch {
    return '';
  }
}



