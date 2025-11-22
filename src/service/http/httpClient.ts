// ========================
// PostHog integration for error tracking
// ========================
/**
 * Отправляет ошибку в PostHog, если включено логирование для текущего окружения
 */
function sendErrorToPostHog(error: Error | ApiError, context?: Record<string, unknown>): void {
  // Проверяем, нужно ли отправлять логи в PostHog
  if (typeof window === 'undefined') return; // Только на клиенте
  
  const nodeEnv = process.env.NODE_ENV;
  const logsFor = process.env.NEXT_PUBLIC_POST_HOG_LOGS_FOR;

  if (!nodeEnv || !logsFor) return;

  const allowedEnvs = logsFor.split(',').map(env => env.trim().toLowerCase());
  if (!allowedEnvs.includes(nodeEnv.toLowerCase())) return;

  // Динамически импортируем posthog только если нужно
  import('posthog-js').then((posthogModule) => {
    const posthog = posthogModule.default;
    
    // Создаем Error объект из ApiError если нужно
    const errorObj = error instanceof Error 
      ? error 
      : new Error((error as ApiError).message || 'API Error');

    // Добавляем контекст ошибки
    const errorContext = {
      $exception_type: 'http_client_error',
      ...(error as ApiError).status && { http_status: (error as ApiError).status },
      ...(error as ApiError).error && { error_code: (error as ApiError).error },
      ...context,
    };

    posthog.captureException(errorObj, errorContext);
  }).catch(() => {
    // Игнорируем ошибки импорта PostHog (если не инициализирован)
  });
}

// ========================
// Configurable constants (easy to move to env later)
// ========================
/**
 * Default base URL used to resolve relative API paths.
 * Keep empty to use relative paths by default; can be set in SSR.
 */
export const DEFAULT_BASE_URL = '';
/**
 * Default credentials policy for fetch requests to our backend.
 * 'same-origin' keeps cookies/session for same-site APIs.
 */
export const DEFAULT_CREDENTIALS: RequestCredentials = 'same-origin';
/**
 * Default headers applied to all requests. Can be overridden per call.
 */
export const DEFAULT_HEADERS: Readonly<Record<string, string>> = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

// ========================
// Types
// ========================
export type ApiError = {
  status: number;
  error: string;
  message: string;
};

export type RequestOptions<TBody = unknown> = {
  headers?: Record<string, string>;
  body?: TBody;
  baseUrl?: string;
};

// ========================
// Internals
// ========================
/**
 * Builds an absolute URL if baseUrl is provided and path is relative.
 * Leaves absolute paths (http/https) unchanged.
 */
function buildUrl(path: string, baseUrl?: string): string {
  if (!baseUrl) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

/**
 * Merges default headers with user-provided headers. User values win.
 */
function mergeHeaders(user?: Record<string, string>): HeadersInit {
  const headers = new Headers(DEFAULT_HEADERS);
  if (user) {
    for (const [k, v] of Object.entries(user)) headers.set(k, v);
  }
  return headers;
}

/**
 * Attempts to parse JSON response when content-type is application/json.
 * Returns undefined for non-JSON or empty bodies.
 */
async function readJsonIfAny(response: Response): Promise<unknown | undefined> {
  const contentType = response.headers.get('content-type') || '';
  const hasJson = contentType.includes('application/json');
  if (!hasJson) return undefined;
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

/**
 * Low-level request helper used by get/post. Handles headers, base URL,
 * credentials and JSON parsing. Throws ApiError on non-2xx or network errors.
 */
async function request<TResponse = unknown, TBody = unknown>(
  path: string,
  method: 'GET' | 'POST',
  opts: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const url = buildUrl(path, opts.baseUrl || DEFAULT_BASE_URL);
  const init: RequestInit = {
    method,
    headers: mergeHeaders(opts.headers),
    credentials: DEFAULT_CREDENTIALS,
  };
  if (method === 'POST' && opts.body !== undefined) {
    (init as any).body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body);
  }

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (e: any) {
    const errorMsg = e?.message || 'Network error';
    const context = `${method} ${url}`;
    const apiError: ApiError = {status: 0, error: 'NETWORK_ERROR', message: `${errorMsg} (${context})`};
    
    // Отправляем ошибку в PostHog
    sendErrorToPostHog(apiError, {
      request_method: method,
      request_url: url,
      error_type: 'network_error',
    });
    
    throw apiError;
  }

  const data = await readJsonIfAny(response);
  if (!response.ok) {
    const errorFromServer = (data as any)?.error || 'UNKNOWN_ERROR';
    const message = (data as any)?.message || (data as any)?.error || `HTTP ${response.status}`;
    const apiError: ApiError = {status: response.status, error: errorFromServer, message};
    
    // Отправляем ошибку в PostHog
    sendErrorToPostHog(apiError, {
      request_method: method,
      request_url: url,
      http_status: response.status,
      error_type: 'http_error',
      server_error: errorFromServer,
    });
    
    throw apiError;
  }
  return data as TResponse;
}

// ========================
// Public API
// ========================
/**
 * Performs GET request.
 * @throws {ApiError} On non-2xx responses or network errors
 */
export function get<TResponse = unknown>(path: string, opts: Omit<RequestOptions, 'body'> = {}) {
  return request<TResponse>(path, 'GET', opts);
}

/**
 * Performs POST request.
 * @throws {ApiError} On non-2xx responses or network errors
 */
export function post<TResponse = unknown, TBody = unknown>(
  path: string,
  body?: TBody,
  opts: Omit<RequestOptions<TBody>, 'body'> = {}
) {
  return request<TResponse, TBody>(path, 'POST', { ...opts, body });
}
