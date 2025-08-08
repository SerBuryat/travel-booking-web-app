import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { ClientService } from '@/service/ClientService';
import {ClientWithAuthType} from "@/model/ClientType";

/**
 * Получает данные пользователя на сервере
 * Используется в серверных компонентах
 */
export async function getServerUser(): Promise<ClientWithAuthType> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    throw new Error('[getServerUser] Token not found');
  }

  // Валидируем JWT токен
  const payload = verifyJWT(token);
  if (!payload) {
    throw new Error('[getServerUser] Invalid token');
  }

  // Получаем данные пользователя из БД
  const clientService = new ClientService();
  const user = await clientService.findByIdWithActiveAuth(payload.userId, payload.authId);

  if (!user || user.tclients_auth.length === 0) {
    throw new Error('[getServerUser] User not found');
  }

  const auth = user.tclients_auth.find(auth => auth.auth_id === payload.authId);
  if (!auth) {
    throw new Error('[getServerUser] Auth not found');
  }

  return user;
}
