import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { ClientService } from '@/service/ClientService';

export interface ServerUser {
  id: number;
  name: string;
  role: string;
  telegram_id?: number;
  username?: string;
}

/**
 * Получает данные пользователя на сервере
 * Используется в серверных компонентах
 */
export async function getServerUser(): Promise<ServerUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }

    // Валидируем JWT токен
    const payload = verifyJWT(token);
    if (!payload) {
      return null;
    }

    // Получаем данные пользователя из БД
    const clientService = new ClientService();
    const user = await clientService.findByIdWithActiveAuth(payload.userId, payload.authId);
    
    if (!user || user.tclients_auth.length === 0) {
      return null;
    }

    const auth = user.tclients_auth.find(auth => auth.auth_id === payload.authId);
    if (!auth) {
      return null;
    }

    // Извлекаем telegram_id и username из auth_context
    const authContext = auth.auth_context as any;
    const telegram_id = authContext?.id;
    const username = authContext?.username;

    return {
      id: user.id,
      name: user.name,
      role: auth.role,
      telegram_id: telegram_id,
      username: username
    };
  } catch (error) {
    console.error('Server auth error:', error);
    return null;
  }
}

/**
 * Проверяет, авторизован ли пользователь на сервере
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const user = await getServerUser();
  return user !== null;
}
