# Настройка тестирования с Jest

## Установка зависимостей

Для запуска тестов вам нужно установить Jest и связанные зависимости:

```bash
npm install --save-dev jest @types/jest jest-environment-jsdom ts-jest @testing-library/jest-dom
```

## Конфигурация

### 1. Jest Configuration (`jest.config.js`)

Файл уже настроен для работы с:
- TypeScript
- Next.js
- Алиасами путей (`@/`)
- Покрытием кода
- JSDOM окружением
- Моками Prisma

### 2. Jest Setup (`jest.setup.js`)

Файл содержит:
- Настройку Jest DOM
- Моки для Next.js router и navigation
- Моки для Prisma Client
- Глобальные настройки тестов

### 3. Prisma Mocks

Для работы с Prisma в тестах созданы моки:

- `src/__mocks__/prisma-client.ts` - мок для Prisma Client
- Моки в `jest.setup.js` для `@/lib/prisma`

## Запуск тестов

### Основные команды

```bash
# Запуск всех тестов
npm test

# Запуск тестов в watch режиме (рекомендуется для разработки)
npm run test:watch

# Запуск тестов с покрытием кода
npm run test:coverage

# Запуск тестов для CI/CD
npm run test:ci
```

### Запуск конкретных тестов

```bash
# Запуск тестов в конкретной папке
npm test -- src/service/__tests__/

# Запуск конкретного теста
npm test -- ClientService.test.ts

# Запуск тестов по паттерну
npm test -- --testNamePattern="createOrUpdateWithTelegramAuth"
```

## Структура тестов

### Организация файлов

```
src/
├── __mocks__/              # Глобальные моки
│   └── prisma-client.ts    # Мок Prisma Client
├── service/
│   ├── __tests__/          # Тесты для сервисов
│   │   ├── ClientService.test.ts
│   │   ├── basic.test.ts
│   │   ├── prisma-mock.test.ts
│   │   └── MockingExamples.test.ts
│   └── ClientService.ts
├── repository/
│   └── __tests__/          # Тесты для репозиториев
└── components/
    └── __tests__/          # Тесты для компонентов
```

### Именование файлов

- `*.test.ts` - тесты для TypeScript файлов
- `*.spec.ts` - альтернативное именование
- `__tests__/` - папка для тестов
- `__mocks__/` - папка для моков

## Примеры тестов

### Базовый тест

```typescript
import { ClientService } from '../ClientService';

describe('ClientService', () => {
  it('should create a new client', async () => {
    // Arrange
    const service = new ClientService();
    
    // Act
    const result = await service.someMethod();
    
    // Assert
    expect(result).toBeDefined();
  });
});
```

### Тест с моками

```typescript
import { ClientService } from '../ClientService';
import { ClientRepository } from '@/repository/ClientRepository';

// Мокаем зависимости
jest.mock('@/repository/ClientRepository');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    tclients: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    tclients_auth: {
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('ClientService', () => {
  let mockRepository: jest.Mocked<ClientRepository>;
  let service: ClientService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = new ClientRepository() as jest.Mocked<ClientRepository>;
    service = new ClientService();
    (service as any).clientRepository = mockRepository;
  });

  it('should call repository method', async () => {
    // Arrange
    mockRepository.findByAuthId = jest.fn().mockResolvedValue(null);
    
    // Act
    await service.createOrUpdateWithTelegramAuth(/* params */);
    
    // Assert
    expect(mockRepository.findByAuthId).toHaveBeenCalled();
  });
});
```

### Тест с Prisma моками

```typescript
import { prisma } from '@/lib/prisma';

describe('Prisma Mock Test', () => {
  it('should have mocked prisma client', () => {
    expect(prisma).toBeDefined();
    expect(prisma.tclients).toBeDefined();
    expect(prisma.tclients_auth).toBeDefined();
  });

  it('should be able to call mocked methods', () => {
    expect(() => prisma.tclients.findUnique({ where: { id: 1 } })).not.toThrow();
    expect(() => prisma.tclients_auth.create({ data: {} })).not.toThrow();
  });
});
```

## Покрытие кода

### Настройка покрытия

Покрытие кода настраивается в `jest.config.js`:

```javascript
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  '!src/**/*.d.ts',
  '!src/**/*.test.{ts,tsx}',
  '!src/**/*.spec.{ts,tsx}',
],
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
},
```

### Просмотр покрытия

```bash
# Запуск с покрытием
npm run test:coverage

# Открытие отчета в браузере (если доступно)
open coverage/lcov-report/index.html
```

## Лучшие практики

### 1. Структура тестов

- Используйте `describe` для группировки
- Используйте `beforeEach` для настройки
- Следуйте паттерну AAA (Arrange-Act-Assert)

### 2. Мокирование

- Мокайте только внешние зависимости
- Используйте `jest.clearAllMocks()` в `beforeEach`
- Проверяйте вызовы методов
- Мокайте Prisma для изоляции тестов

### 3. Именование

- Используйте описательные имена тестов
- Группируйте связанные тесты
- Используйте `it` для описания поведения

### 4. Обработка ошибок

- Тестируйте успешные и неуспешные сценарии
- Используйте `mockRejectedValue` для ошибок
- Проверяйте корректную обработку ошибок

## Отладка тестов

### Логирование

```typescript
// Включение логов в тестах
console.log('Debug info:', someVariable);

// Или используйте debugger
debugger;
```

### Watch режим

```bash
# Запуск в watch режиме
npm run test:watch

# Запуск только измененных файлов
npm test -- --watch --onlyChanged
```

### Отладка в IDE

Большинство IDE поддерживают отладку Jest тестов:

- **VS Code**: Установите Jest extension
- **WebStorm**: Встроенная поддержка
- **Vim/Neovim**: Используйте jest.nvim

## Troubleshooting

### Частые проблемы

1. **Ошибки импорта Prisma**
   - Убедитесь, что моки Prisma настроены в `jest.setup.js`
   - Проверьте файл `src/__mocks__/prisma-client.ts`
   - Убедитесь, что `@/lib/prisma` замокан

2. **Ошибки импорта**
   - Проверьте настройки `moduleNameMapper` в `jest.config.js`
   - Убедитесь, что пути корректны

3. **Ошибки TypeScript**
   - Проверьте `tsconfig.json`
   - Убедитесь, что `@types/jest` установлен

4. **Ошибки моков**
   - Используйте `jest.clearAllMocks()` в `beforeEach`
   - Проверьте правильность мокирования

5. **Ошибки окружения**
   - Убедитесь, что `jest-environment-jsdom` установлен
   - Проверьте настройки в `jest.setup.js`

### Полезные команды

```bash
# Очистка кэша Jest
npx jest --clearCache

# Запуск с подробным выводом
npx jest --verbose

# Запуск одного теста с выводом
npx jest --verbose ClientService.test.ts

# Запуск тестов с отладкой
npx jest --verbose --no-cache
```

## Prisma в тестах

### Мокирование Prisma

Для тестирования с Prisma используются моки:

```typescript
// В jest.setup.js
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    tclients: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    // ... другие модели
  })),
}));

// В тестах
jest.mock('@/lib/prisma', () => ({
  prisma: {
    tclients: {
      findUnique: jest.fn(),
      // ... другие методы
    },
  },
}));
```

### Тестирование с реальной базой данных

Для интеграционных тестов можно использовать реальную базу данных:

```typescript
// Только для интеграционных тестов
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Integration Tests', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should work with real database', async () => {
    // Тесты с реальной БД
  });
});
```
