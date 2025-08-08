# Руководство по тестированию с Jest в TypeScript

## Обзор

В TypeScript/JavaScript **Jest** является основной альтернативой **Mockito** из Java. Jest предоставляет мощные возможности для мокирования, которые во многом аналогичны Mockito.

## Основные концепции

### 1. **Jest Mock vs Mockito**

| Mockito (Java) | Jest (TypeScript) | Описание |
|----------------|-------------------|----------|
| `@Mock` | `jest.mock()` | Создание мока |
| `@InjectMocks` | Ручное внедрение | Внедрение зависимостей |
| `when().thenReturn()` | `mockFn().mockReturnValue()` | Настройка возвращаемых значений |
| `verify()` | `expect().toHaveBeenCalled()` | Проверка вызовов |
| `any()` | `expect.any()` | Матчеры для аргументов |

### 2. **Типы моков в Jest**

#### **Автоматический мок (Module Mock)**
```typescript
// Мокаем весь модуль
jest.mock('@/repository/ClientRepository');

describe('Test', () => {
  let mockRepository: jest.Mocked<ClientRepository>;
  
  beforeEach(() => {
    mockRepository = new ClientRepository() as jest.Mocked<ClientRepository>;
  });
});
```

#### **Ручной мок (Manual Mock)**
```typescript
// Создаем мок вручную
const mockRepository: Partial<ClientRepository> = {
  findByAuthId: jest.fn().mockResolvedValue(null),
  createWithAuth: jest.fn().mockResolvedValue({} as any)
};
```

#### **Spy (Слежение за реальными методами)**
```typescript
// Следим за реальным методом
const spy = jest.spyOn(realRepository, 'findByAuthId');
spy.mockResolvedValue(null);
```

## Примеры тестирования

### 1. **Базовый тест с моками**

```typescript
import { ClientService } from '../ClientService';
import { ClientRepository } from '@/repository/ClientRepository';

// Мокаем зависимости
jest.mock('@/repository/ClientRepository');

describe('ClientService', () => {
  let clientService: ClientService;
  let mockRepository: jest.Mocked<ClientRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = new ClientRepository() as jest.Mocked<ClientRepository>;
    
    clientService = new ClientService();
    (clientService as any).clientRepository = mockRepository;
  });

  it('должен создать нового клиента', async () => {
    // Arrange
    mockRepository.findByAuthId = jest.fn().mockResolvedValue(null);
    mockRepository.createWithAuth = jest.fn().mockResolvedValue({} as any);

    // Act
    const result = await clientService.createOrUpdateWithTelegramAuth(
      { id: 1, first_name: 'John' } as any,
      'auth123',
      new Date()
    );

    // Assert
    expect(mockRepository.findByAuthId).toHaveBeenCalledWith('auth123');
    expect(mockRepository.createWithAuth).toHaveBeenCalled();
    expect(result).toEqual({});
  });
});
```

### 2. **Тест с различными сценариями**

```typescript
describe('createOrUpdateWithTelegramAuth', () => {
  describe('кейс с созданием нового пользователя', () => {
    beforeEach(() => {
      mockRepository.findByAuthId = jest.fn().mockResolvedValue(null);
      mockRepository.createWithAuth = jest.fn().mockResolvedValue(mockNewClient);
    });

    it('должен создать нового клиента', async () => {
      // Act
      const result = await clientService.createOrUpdateWithTelegramAuth(
        mockTelegramUser,
        mockAuthId,
        mockTokenExpiresAt
      );

      // Assert
      expect(result).toEqual(mockNewClient);
      expect(mockRepository.createWithAuth).toHaveBeenCalledWith({
        name: 'John Doe',
        tclients_auth: {
          create: expect.any(Object)
        }
      });
    });
  });

  describe('кейс с обновлением существующего пользователя', () => {
    beforeEach(() => {
      mockRepository.findByAuthId = jest.fn().mockResolvedValue(mockExistingClient);
      mockRepository.updateWithAuth = jest.fn().mockResolvedValue(mockExistingClient);
    });

    it('должен обновить существующего клиента', async () => {
      // Act
      const result = await clientService.createOrUpdateWithTelegramAuth(
        mockTelegramUser,
        mockAuthId,
        mockTokenExpiresAt
      );

      // Assert
      expect(result).toEqual(mockExistingClient);
      expect(mockRepository.updateWithAuth).toHaveBeenCalledWith(
        mockExistingClient.id,
        expect.objectContaining({
          tclients_auth: {
            update: {
              where: { id: mockExistingClient.tclients_auth[0].id },
              data: { last_login: expect.any(Date) }
            }
          }
        })
      );
    });
  });
});
```

### 3. **Тест обработки ошибок**

```typescript
describe('обработка ошибок', () => {
  it('должен вернуть null при ошибке в findByAuthId', async () => {
    // Arrange
    mockRepository.findByAuthId = jest.fn().mockRejectedValue(new Error('Database error'));

    // Act
    const result = await clientService.createOrUpdateWithTelegramAuth(
      mockTelegramUser,
      mockAuthId,
      mockTokenExpiresAt
    );

    // Assert
    expect(result).toBeNull();
  });
});
```

## Продвинутые техники

### 1. **Mock Implementation**

```typescript
// Кастомная логика в моке
mockRepository.findByAuthId.mockImplementation(async (authId: string) => {
  if (authId === 'existing') {
    return { id: 1, name: 'John' } as any;
  }
  return null;
});
```

### 2. **Различные возвращаемые значения**

```typescript
// Разные значения для разных вызовов
mockRepository.findByAuthId = jest.fn()
  .mockResolvedValueOnce({ id: 1, name: 'John' } as any) // Первый вызов
  .mockResolvedValueOnce({ id: 2, name: 'Jane' } as any) // Второй вызов
  .mockResolvedValue(null); // Все остальные вызовы
```

### 3. **Проверка аргументов**

```typescript
// Проверяем точные аргументы
expect(mockRepository.createWithAuth).toHaveBeenCalledWith({
  name: 'John Doe',
  additional_info: { telegram_id: 123456789 },
  tclients_auth: {
    create: {
      auth_type: 'telegram',
      auth_id: 'auth123',
      token_expires_at: expect.any(Date)
    }
  }
});
```

## Сравнение с Mockito

### **Java Mockito:**
```java
@Mock
private ClientRepository clientRepository;

@InjectMocks
private ClientService clientService;

@Test
public void testCreateUser() {
    // Given
    when(clientRepository.findByAuthId(anyString())).thenReturn(null);
    when(clientRepository.createWithAuth(any())).thenReturn(mockClient);
    
    // When
    ClientWithAuthType result = clientService.createOrUpdateWithTelegramAuth(
        telegramUser, authId, tokenExpiresAt
    );
    
    // Then
    verify(clientRepository).findByAuthId(authId);
    verify(clientRepository).createWithAuth(any());
    assertEquals(mockClient, result);
}
```

### **TypeScript Jest:**
```typescript
describe('ClientService', () => {
  let mockRepository: jest.Mocked<ClientRepository>;
  let clientService: ClientService;

  beforeEach(() => {
    mockRepository = new ClientRepository() as jest.Mocked<ClientRepository>;
    clientService = new ClientService();
    (clientService as any).clientRepository = mockRepository;
  });

  it('should create user', async () => {
    // Given
    mockRepository.findByAuthId = jest.fn().mockResolvedValue(null);
    mockRepository.createWithAuth = jest.fn().mockResolvedValue(mockClient);
    
    // When
    const result = await clientService.createOrUpdateWithTelegramAuth(
        telegramUser, authId, tokenExpiresAt
    );
    
    // Then
    expect(mockRepository.findByAuthId).toHaveBeenCalledWith(authId);
    expect(mockRepository.createWithAuth).toHaveBeenCalled();
    expect(result).toEqual(mockClient);
  });
});
```

## Лучшие практики

### 1. **Структура тестов**
- Используйте `describe` для группировки тестов
- Используйте `beforeEach` для настройки моков
- Следуйте паттерну AAA (Arrange-Act-Assert)

### 2. **Именование**
- Используйте описательные имена тестов
- Группируйте связанные тесты в `describe` блоки
- Используйте `it` для описания поведения

### 3. **Мокирование**
- Мокайте только внешние зависимости
- Используйте `jest.clearAllMocks()` в `beforeEach`
- Проверяйте вызовы методов с правильными аргументами

### 4. **Обработка ошибок**
- Тестируйте как успешные, так и неуспешные сценарии
- Используйте `mockRejectedValue` для ошибок
- Проверяйте корректную обработку ошибок

## Полезные матчеры Jest

```typescript
// Проверка вызовов
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');

// Проверка аргументов
expect(mockFn).toHaveBeenCalledWith(expect.any(String));
expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));

// Проверка возвращаемых значений
expect(result).toEqual(expectedValue);
expect(result).toBeNull();
expect(result).toBeDefined();

// Проверка ошибок
await expect(asyncFn()).rejects.toThrow('Error message');
```

## Заключение

Jest предоставляет мощные возможности для тестирования, которые во многом аналогичны Mockito. Основные различия:

- **Синтаксис**: Jest использует JavaScript/TypeScript синтаксис
- **Типизация**: Jest поддерживает TypeScript типы
- **Гибкость**: Jest предоставляет больше вариантов мокирования
- **Интеграция**: Jest интегрирован с экосистемой JavaScript/TypeScript

Использование Jest для тестирования обеспечивает надежность, читаемость и поддерживаемость кода.
