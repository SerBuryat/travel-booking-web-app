# Руководство по транзакциям в Prisma ORM

## Обзор

Транзакции в Prisma обеспечивают атомарность операций - либо все операции выполняются успешно, либо ни одна из них не выполняется (откат). Это критически важно для поддержания целостности данных.

## Основные способы работы с транзакциями

### 1. $transaction с callback функцией (Рекомендуемый)

```typescript
const result = await prisma.$transaction(async (tx) => {
  // Все операции здесь выполняются в одной транзакции
  const client = await tx.tclients.create({
    data: { name: 'John', email: 'john@example.com' }
  });
  
  const auth = await tx.tclients_auth.create({
    data: {
      tclients_id: client.id,
      auth_type: 'telegram',
      auth_id: 'telegram_123'
    }
  });
  
  return { client, auth };
});
```

**Преимущества:**
- Простой и понятный синтаксис
- Автоматический откат при ошибке
- Возможность использовать результаты предыдущих операций
- Поддержка условной логики

### 2. $transaction с массивом операций

```typescript
const results = await prisma.$transaction([
  prisma.tclients.create({ data: { name: 'Alice', email: 'alice@example.com' } }),
  prisma.tclients.create({ data: { name: 'Bob', email: 'bob@example.com' } }),
  prisma.tcategories.create({ data: { code: 'HOTEL', name: 'Отели' } })
]);
```

**Применение:** Когда операции независимы друг от друга и не требуют результатов предыдущих операций.

### 3. Вложенные транзакции

```typescript
await prisma.$transaction(async (outerTx) => {
  const client = await outerTx.tclients.create({ data: { name: 'Client' } });
  
  await outerTx.$transaction(async (innerTx) => {
    await innerTx.tclients_auth.create({
      data: { tclients_id: client.id, auth_type: 'telegram' }
    });
  });
});
```

## Типизированные транзакции

Для лучшей типизации используйте:

```typescript
import { PrismaClient } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime/library';

type TransactionClient = Omit<PrismaClient, ITXClientDenyList>;

await prisma.$transaction(async (tx: TransactionClient) => {
  // Типизированная транзакция
});
```

## Параметры транзакций

### Таймаут

```typescript
await prisma.$transaction(async (tx) => {
  // Операции
}, {
  timeout: 5000 // 5 секунд
});
```

### Уровень изоляции

```typescript
await prisma.$transaction(async (tx) => {
  // Операции
}, {
  isolationLevel: 'Serializable'
});
```

**Доступные уровни:**
- `ReadUncommitted` - самый низкий уровень изоляции
- `ReadCommitted` - по умолчанию
- `RepeatableRead` - предотвращает грязное чтение
- `Serializable` - самый высокий уровень изоляции

## Обработка ошибок

### Базовый пример

```typescript
try {
  const result = await prisma.$transaction(async (tx) => {
    const client = await tx.tclients.create({
      data: { name: 'Test', email: 'test@example.com' }
    });
    
    await tx.tclients_auth.create({
      data: { tclients_id: client.id, auth_type: 'telegram' }
    });
    
    return client;
  });
} catch (error) {
  console.error('Transaction failed:', error);
  // Обработка ошибки
}
```

### Условная логика

```typescript
await prisma.$transaction(async (tx) => {
  const existingClient = await tx.tclients.findUnique({
    where: { email: 'test@example.com' }
  });
  
  if (existingClient) {
    // Обновляем существующего клиента
    await tx.tclients.update({
      where: { id: existingClient.id },
      data: { name: 'Updated Name' }
    });
  } else {
    // Создаем нового клиента
    await tx.tclients.create({
      data: { name: 'New Client', email: 'test@example.com' }
    });
  }
});
```

## Лучшие практики

### 1. Минимизируйте размер транзакций

❌ Плохо:
```typescript
await prisma.$transaction(async (tx) => {
  // Сотни операций в одной транзакции
  for (let i = 0; i < 1000; i++) {
    await tx.tclients.create({ data: { name: `Client ${i}` } });
  }
});
```

✅ Хорошо:
```typescript
// Разбиваем на батчи
const batchSize = 100;
for (let i = 0; i < 1000; i += batchSize) {
  await prisma.$transaction(async (tx) => {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, 1000); j++) {
      batch.push(tx.tclients.create({ data: { name: `Client ${j}` } }));
    }
    await Promise.all(batch);
  });
}
```

### 2. Избегайте долгих операций в транзакциях

❌ Плохо:
```typescript
await prisma.$transaction(async (tx) => {
  await tx.tclients.create({ data: { name: 'Client' } });
  
  // Долгая операция блокирует транзакцию
  await someExternalAPI();
  
  await tx.tclients_auth.create({ data: { /* ... */ } });
});
```

✅ Хорошо:
```typescript
// Выполняем внешние операции до или после транзакции
const externalData = await someExternalAPI();

await prisma.$transaction(async (tx) => {
  await tx.tclients.create({ data: { name: 'Client' } });
  await tx.tclients_auth.create({ data: { /* ... */ } });
});
```

### 3. Используйте правильные уровни изоляции

```typescript
// Для чтения данных
await prisma.$transaction(async (tx) => {
  const clients = await tx.tclients.findMany();
  return clients;
}, { isolationLevel: 'ReadCommitted' });

// Для критических операций
await prisma.$transaction(async (tx) => {
  // Операции с деньгами, статусами и т.д.
}, { isolationLevel: 'Serializable' });
```

### 4. Обрабатывайте специфические ошибки

```typescript
try {
  await prisma.$transaction(async (tx) => {
    await tx.tclients_auth.create({
      data: { auth_id: 'duplicate_id' } // Может вызвать ошибку уникальности
    });
  });
} catch (error) {
  if (error.code === 'P2002') {
    // Ошибка дубликата
    console.log('Auth ID already exists');
  } else if (error.code === 'P2003') {
    // Ошибка внешнего ключа
    console.log('Foreign key constraint failed');
  } else {
    throw error;
  }
}
```

## Примеры из проекта

### Создание клиента с аутентификацией

```typescript
async createClientWithAuth(telegramData: TelegramUser, authId: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Создаем клиента
    const client = await tx.tclients.create({
      data: {
        name: telegramData.first_name,
        email: telegramData.username ? `${telegramData.username}@telegram.org` : null,
        additional_info: {
          telegram_id: telegramData.id,
          username: telegramData.username,
          language_code: telegramData.language_code
        }
      }
    });

    // 2. Создаем аутентификацию
    const auth = await tx.tclients_auth.create({
      data: {
        tclients_id: client.id,
        auth_type: 'telegram',
        auth_id: authId,
        auth_context: {
          telegram_id: telegramData.id,
          username: telegramData.username
        },
        role: 'user'
      }
    });

    // 3. Создаем базовые настройки
    await tx.tclients_settings.create({
      data: {
        tclients_id: client.id,
        setting_key: 'notifications_enabled',
        setting_value: 'true'
      }
    });

    return { client, auth };
  });
}
```

### Создание сервиса с полной информацией

```typescript
async createServiceWithFullInfo(serviceData: CreateServiceData) {
  return await prisma.$transaction(async (tx) => {
    // 1. Проверяем/создаем провайдера
    let provider = await tx.tproviders.findFirst({
      where: { tclients_id: serviceData.clientId }
    });

    if (!provider) {
      provider = await tx.tproviders.create({
        data: {
          tclients_id: serviceData.clientId,
          company_name: serviceData.companyName,
          phone: serviceData.phone,
          status: 'active'
        }
      });
    }

    // 2. Создаем сервис
    const service = await tx.tservices.create({
      data: {
        name: serviceData.name,
        description: serviceData.description,
        tcategories_id: serviceData.categoryId,
        price: serviceData.price,
        provider_id: provider.id,
        status: 'active'
      }
    });

    // 3. Создаем контактную информацию
    if (serviceData.contact) {
      await tx.tcontacts.create({
        data: {
          tservices_id: service.id,
          email: serviceData.contact.email,
          phone: serviceData.contact.phone,
          website: serviceData.contact.website
        }
      });
    }

    // 4. Создаем локацию
    if (serviceData.location) {
      await tx.tlocations.create({
        data: {
          tservices_id: service.id,
          name: serviceData.location.name,
          address: serviceData.location.address,
          latitude: serviceData.location.latitude,
          longitude: serviceData.location.longitude,
          tarea_id: serviceData.location.areaId
        }
      });
    }

    // 5. Создаем фото
    if (serviceData.photos && serviceData.photos.length > 0) {
      const photoPromises = serviceData.photos.map((photo, index) =>
        tx.tphotos.create({
          data: {
            tservices_id: service.id,
            url: photo.url,
            is_primary: index === 0
          }
        })
      );
      await Promise.all(photoPromises);
    }

    return service;
  });
}
```

## Отладка транзакций

### Логирование

```typescript
await prisma.$transaction(async (tx) => {
  console.log('Starting transaction');
  
  const client = await tx.tclients.create({
    data: { name: 'Test Client' }
  });
  console.log('Client created:', client.id);
  
  const auth = await tx.tclients_auth.create({
    data: { tclients_id: client.id, auth_type: 'telegram' }
  });
  console.log('Auth created:', auth.id);
  
  console.log('Transaction completed successfully');
});
```

### Проверка состояния

```typescript
await prisma.$transaction(async (tx) => {
  // Проверяем состояние до операции
  const beforeCount = await tx.tclients.count();
  console.log('Clients before:', beforeCount);
  
  await tx.tclients.create({ data: { name: 'Test' } });
  
  // Проверяем состояние после операции
  const afterCount = await tx.tclients.count();
  console.log('Clients after:', afterCount);
});
```

## Заключение

Транзакции в Prisma обеспечивают надежность и целостность данных. Используйте их для:

- Создания связанных данных
- Обновления нескольких таблиц
- Операций с деньгами и статусами
- Любых операций, требующих атомарности

Помните о правильной обработке ошибок и выборе подходящего уровня изоляции для ваших задач.
