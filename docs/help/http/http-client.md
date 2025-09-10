## Default HTTP client: usage guide

В проекте есть наш легкий HTTP-клиент для REST-запросов: `src/service/http/httpClient.ts`.

- Основные функции: `get<TResponse>()`, `post<TResponse, TBody>()`.
- Ошибки пробрасываются как `{ status: number, message: string, details?: unknown }`.
- Дефолты: относительные пути, `same-origin` cookies, JSON-заголовки.

### Где находится
`src/service/http/httpClient.ts`

### Базовый пример: GET
```ts
import {get} from '@/service/http/httpClient';

type MyResponse = { items: string[] };
const data = await get<MyResponse>('/api/items');
```

### Базовый пример: POST
```ts
import {post} from '@/service/http/httpClient';

type CreateDto = { name: string };
type Created = { id: string; name: string };

const dto: CreateDto = { name: 'Test' };
const res = await post<Created, CreateDto>('/api/items', dto);
```

### Ответ без тела (например, 202/204)
```ts
// Если сервер вернул 202/204 без тела, клиент вернёт undefined
const accepted = await post<undefined, { taskId: string }>(
  '/api/tasks/trigger',
  { taskId: '123' }
);
// accepted === undefined
```

### Кастомный baseUrl (например, в SSR)
```ts
import {get} from '@/service/http/httpClient';

const origin = 'https://example.com';
const data = await get<any>('/api/health', { baseUrl: origin });
```

### Кастомные заголовки
```ts
import {get} from '@/service/http/httpClient';

const data = await get<any>('/api/secure', {
  headers: {
    Authorization: 'Bearer <token>'
  }
});
```

### Обработка ошибок
```ts
import {get, ApiError} from '@/service/http/httpClient';

try {
  await get('/api/maybe-fails');
} catch (e) {
  const err = e as ApiError; // { status, message, details? }
  // показать уведомление пользователю / логировать
}
```

### Рекомендации
- Использовать `get/post` только внутри API-слоя (например, `ApiService`).
- Компоненты вызывают доменные методы из `ApiService`, а не `fetch`/URL напрямую.
- Держи сигнатуры простыми: входные DTO и возвращаемые типы строго типизированы.


