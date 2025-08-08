# Prisma INSERT Guide: Nested Writes

## Обзор

В Prisma есть возможность создавать связанные сущности одним запросом при `INSERT` - это называется **nested writes** (вложенные записи). Это отличается от `include` и `select`, которые работают только для операций чтения.

## Основные возможности

### 1. Create с include (НЕ РАБОТАЕТ)

```typescript
// ❌ ЭТО НЕ РАБОТАЕТ для INSERT
await prisma.client.create({
  data: { /* данные */ },
  include: { auth: true } // include работает только для SELECT
});
```

### 2. Nested Writes (РАБОТАЕТ)

```typescript
// ✅ Создание клиента + его аутентификации
await prisma.tclients.create({
  data: {
    name: "John",
    email: "john@example.com",
    // Вложенное создание связанных записей
    tclients_auth: {
      create: {
        auth_id: "auth123",
        token: "token123",
        token_expires_at: new Date()
      }
    },
    tclients_settings: {
      create: {
        notifications_enabled: true,
        language: "en"
      }
    }
  }
});
```

### 3. Создание множественных связанных записей

```typescript
// Создание провайдера + несколько сервисов
await prisma.tproviders.create({
  data: {
    name: "Provider Name",
    // Создание нескольких сервисов
    tservices: {
      create: [
        {
          name: "Service 1",
          description: "Description 1"
        },
        {
          name: "Service 2", 
          description: "Description 2"
        }
      ]
    }
  }
});
```

### 4. Создание с connect (связывание с существующими записями)

```typescript
await prisma.tclients.create({
  data: {
    name: "John",
    // Связывание с существующим провайдером
    provider_id: 1, // или
    tproviders: {
      connect: { id: 1 }
    }
  }
});
```

### 5. Создание с connectOrCreate

```typescript
await prisma.tclients.create({
  data: {
    name: "John",
    tproviders: {
      connectOrCreate: {
        where: { id: 1 },
        create: { name: "New Provider" }
      }
    }
  }
});
```

## В транзакциях

```typescript
await prisma.$transaction(async (tx) => {
  return await tx.tclients.create({
    data: {
      name: "John",
      tclients_auth: {
        create: {
          auth_id: "auth123",
          token: "token123"
        }
      },
      tclients_settings: {
        create: {
          notifications_enabled: true
        }
      }
    }
  });
});
```

## Сложные примеры

### Создание клиента с полным профилем

```typescript
await prisma.tclients.create({
  data: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    tclients_auth: {
      create: {
        auth_id: "auth_123",
        token: "jwt_token_here",
        token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 часа
      }
    },
    tclients_settings: {
      create: {
        notifications_enabled: true,
        language: "en",
        timezone: "UTC"
      }
    },
    tproviders: {
      create: {
        name: "John's Business",
        description: "Professional services",
        tservices: {
          create: [
            {
              name: "Consulting",
              description: "Business consulting services",
              price: 100.00,
              tcontacts: {
                create: {
                  type: "email",
                  value: "consulting@johnsbusiness.com"
                }
              },
              tlocations: {
                create: {
                  address: "123 Business St",
                  city: "New York",
                  country: "USA"
                }
              }
            },
            {
              name: "Training",
              description: "Professional training services",
              price: 75.00
            }
          ]
        }
      }
    }
  }
});
```

### Создание провайдера с множественными сервисами

```typescript
await prisma.tproviders.create({
  data: {
    name: "Tech Solutions Inc",
    description: "Comprehensive technology solutions",
    tservices: {
      create: [
        {
          name: "Web Development",
          description: "Custom web applications",
          price: 5000.00,
          tcategories: {
            connect: { id: 1 } // Подключение к существующей категории
          },
          tcontacts: {
            create: [
              {
                type: "email",
                value: "web@techsolutions.com"
              },
              {
                type: "phone",
                value: "+1-555-0123"
              }
            ]
          },
          tlocations: {
            create: {
              address: "456 Tech Avenue",
              city: "San Francisco",
              state: "CA",
              country: "USA",
              postal_code: "94105"
            }
          },
          tphotos: {
            create: [
              {
                url: "https://example.com/photo1.jpg",
                alt_text: "Web development showcase"
              },
              {
                url: "https://example.com/photo2.jpg",
                alt_text: "Team working"
              }
            ]
          }
        },
        {
          name: "Mobile Development",
          description: "iOS and Android applications",
          price: 8000.00,
          tcontacts: {
            create: {
              type: "email",
              value: "mobile@techsolutions.com"
            }
          }
        }
      ]
    }
  }
});
```

## Ограничения

### ❌ Что НЕ работает для INSERT:

- **`include`** - работает только для SELECT
- **`select`** - работает только для SELECT
- **`where`** в корневом объекте - для INSERT используется `data`

### ✅ Что работает для INSERT:

- **`create`** - создание связанных записей
- **`connect`** - связывание с существующими записями
- **`connectOrCreate`** - связывание или создание
- **`update`** - обновление связанных записей (в update операциях)
- **`upsert`** - создание или обновление связанных записей

## Лучшие практики

### 1. Структурирование данных

```typescript
// Хорошо - четкая структура
const clientData = {
  name: "John",
  email: "john@example.com",
  tclients_auth: {
    create: {
      auth_id: "auth123",
      token: "token123"
    }
  }
};

await prisma.tclients.create({ data: clientData });
```

### 2. Обработка ошибок

```typescript
try {
  await prisma.tclients.create({
    data: {
      name: "John",
      tclients_auth: {
        create: {
          auth_id: "auth123",
          token: "token123"
        }
      }
    }
  });
} catch (error) {
  if (error.code === 'P2002') {
    // Обработка дублирования
    console.log('Duplicate entry');
  } else if (error.code === 'P2003') {
    // Обработка нарушения внешнего ключа
    console.log('Foreign key constraint failed');
  }
}
```

### 3. Использование в транзакциях

```typescript
await prisma.$transaction(async (tx) => {
  const client = await tx.tclients.create({
    data: {
      name: "John",
      tclients_auth: {
        create: {
          auth_id: "auth123",
          token: "token123"
        }
      }
    }
  });

  // Дополнительные операции в той же транзакции
  await tx.tnotifications.create({
    data: {
      client_id: client.id,
      message: "Welcome to our platform!"
    }
  });

  return client;
});
```

## Вывод

Для операций INSERT в Prisma используйте **nested writes** вместо `include`/`select`. Это позволяет создавать сложные связанные структуры данных одним запросом, обеспечивая атомарность и производительность.
