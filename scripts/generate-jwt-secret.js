#!/usr/bin/env node

const crypto = require('crypto');

/**
 * Генерирует безопасный JWT_SECRET
 */
function generateJWTSecret() {
  // Генерируем случайную строку длиной 64 символа
  const secret = crypto.randomBytes(32).toString('hex');
  
  console.log('🔐 Сгенерирован безопасный JWT_SECRET:');
  console.log('');
  console.log(`JWT_SECRET=${secret}`);
  console.log('');
  console.log('📝 Добавьте эту строку в ваш .env файл');
  console.log('⚠️  ВАЖНО: Никогда не коммитьте .env файл в git!');
  console.log('');
  console.log('💡 Для продакшена используйте еще более сложный секрет');
}

// Запускаем генерацию
generateJWTSecret(); 