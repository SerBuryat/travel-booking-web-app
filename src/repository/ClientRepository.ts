import {prisma} from '@/lib/db/prisma';
import {ClientWithAuthType} from '@/model/ClientType';

export class ClientRepository {

  /**
   * Найти клиента по ID с аутентификацией
   */
  async findByIdWithAuth(id: number): Promise<ClientWithAuthType | null> {
    try {
      const client = await prisma.tclients.findUnique({
        where: { id },
        include: {
          tclients_auth: true,
        },
      });
      return client as ClientWithAuthType | null;
    } catch (error) {
      console.error('Error finding client by ID with auth:', error);
      return null;
    }
  }

  /**
   * Найти клиента по ID с активной аутентификацией
   */
  async findByIdWithActiveAuth(id: number, authId: number): Promise<ClientWithAuthType | null> {
    try {
      const client = await prisma.tclients.findUnique({
        where: { id },
        include: {
          tclients_auth: {
            where: {
              id: authId,
              is_active: true,
            },
          },
          tproviders: {
            select: {
              id: true
            }
          }
        },
      });

      if (!client) return null;

      // Добавляем providerId если клиент является провайдером
      const providerId = client.tproviders.length > 0 ? client.tproviders[0].id : undefined;
      
      return {
        ...client,
        providerId
      } as ClientWithAuthType;
    } catch (error) {
      console.error('Error finding client by ID with active auth:', error);
      return null;
    }
  }

  // todo - тут поиск по ИМЕННО auth_id, не путать с tclients_auth.id
  //  потом при рефакторинге переделается, а то уже раз запутался
  async findByAuthId(authId: string): Promise<ClientWithAuthType | null> {
    try {
      const client = await prisma.tclients.findFirst({
        where: {
          tclients_auth: {
            some: {
              auth_id: authId,
            },
          },
        },
        include: {
          tclients_auth: {
            where: {
              auth_id: authId,
            },
          },
        },
      });
      return client as ClientWithAuthType | null;
    } catch (error) {
      console.error('Error finding client by auth_id:', error);
      return null;
    }
  }

  /**
   * Обновить refresh token
   */
  async updateRefreshToken(authId: number, refreshToken: string, expiresAt: Date): Promise<boolean> {
    try {
      await prisma.tclients_auth.update({
        where: {
          id: authId,
        },
        data: {
          refresh_token: refreshToken,
          token_expires_at: expiresAt,
          last_login: new Date(),
        },
      });
      return true;
    } catch (error) {
      console.error('Error updating refresh token:', error);
      return false;
    }
  }

  /**
   * Деактивировать аутентификацию клиента
   */
  async deactivateAuth(authId: number): Promise<boolean> {
    try {
      await prisma.tclients_auth.updateMany({
        where: {
          id: authId,
        },
        data: {
          is_active: false,
          refresh_token: null,
          token_expires_at: null,
        },
      });
      return true;
    } catch (error) {
      console.error('Error deactivating client auth:', error);
      return false;
    }
  }
} 