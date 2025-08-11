import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './lib/jwt';
import { ClientService } from './service/ClientService';

// todo - пока не работает, т.к. middleware умеет запускать, только edge functions, чтобы это ни значило
//  Middleware нам нужен для быстрой и дешевой защиты маршрутов без загрузки страниц и без хитов в БД
//  в middleware оставляем только легковесные проверки по JWT и роуты/роли
// Маршруты, которые не требуют аутентификации
const publicRoutes = [
  '/'
];

// Маршруты, которые требуют определенных ролей
const roleRoutes = {
  '/admin': ['admin'],
  '/provider': ['provider', 'admin'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Пропускаем публичные маршруты
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Пропускаем статические файлы
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  // Получаем токен из cookies
  const token = request.cookies.get('auth_token')?.value;

  // Если нет токена, перенаправляем на страницу входа
  if (!token) {
    const loginUrl = new URL('/telegram-auth', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Валидируем JWT токен
    const payload = verifyJWT(token);
    if (!payload) {
      // Неверный токен - перенаправляем на вход
      const loginUrl = new URL('/telegram-auth', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth_token');
      response.cookies.delete('refresh_token');
      return response;
    }

    // Проверяем существование пользователя в БД
    const clientService = new ClientService();
    const user = await clientService.findByIdWithActiveAuth(payload.userId, payload.authId);

    if (!user || user.tclients_auth.length === 0) {
      // Пользователь не найден или неактивен
      const loginUrl = new URL('/telegram-auth', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth_token');
      response.cookies.delete('refresh_token');
      return response;
    }

    // Проверяем роли для защищенных маршрутов
    const userRole = user.tclients_auth[0].role || 'user';
    
    for (const [route, requiredRoles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route)) {
        if (!requiredRoles.includes(userRole)) {
          // Недостаточно прав - перенаправляем на главную
          const homeUrl = new URL('/', request.url);
          return NextResponse.redirect(homeUrl);
        }
        break;
      }
    }

    // Добавляем информацию о пользователе в заголовки для использования в API
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId.toString());
    requestHeaders.set('x-user-role', userRole);
    requestHeaders.set('x-auth-id', payload.authId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    console.error('Middleware error:', error);
    
    // Ошибка аутентификации - перенаправляем на вход
    const loginUrl = new URL('/telegram-auth', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth_token');
    response.cookies.delete('refresh_token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 