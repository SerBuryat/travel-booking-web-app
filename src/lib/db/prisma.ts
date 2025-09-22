import {PrismaClient} from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Получаем уровни логирования из переменных окружения
const getPrismaLogLevels = (): Array<'query' | 'info' | 'warn' | 'error'> => {
  const logLevels = process.env.PRISMA_LOG_LEVELS;
  
  if (!logLevels) {
    return ['error']; // По умолчанию только ошибки
  }
  
  const levels = logLevels.split(',').map(level => level.trim()) as Array<'query' | 'info' | 'warn' | 'error'>;
  
  // Валидация уровней логирования
  const validLevels: Array<'query' | 'info' | 'warn' | 'error'> = ['query', 'info', 'warn', 'error'];
  const filteredLevels = levels.filter(level => validLevels.includes(level));
  
  return filteredLevels.length > 0 ? filteredLevels : ['error'];
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: getPrismaLogLevels(),
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 