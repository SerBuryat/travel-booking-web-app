import { ITXClientDenyList } from '@prisma/client/runtime/library';
import { prisma } from '@/lib/prisma';
import { 
  ClientType, 
  ClientWithAuthType, 
  CreateClientType, 
  UpdateClientType,
  CreateClientAuthType,
  UpdateClientAuthType,
  ClientAuthType
} from '@/model/ClientType';
import { PrismaClient } from '@prisma/client';

export class ClientRepository {

  /**
   * Найти клиента по ID с аутентификацией (транзакционная версия)
   */
  async findByIdWithAuthTx(tx: Omit<PrismaClient, ITXClientDenyList>, id: number): Promise<ClientWithAuthType | null> {
    try {
      const client = await tx.tclients.findUnique({
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
  async findByIdWithActiveAuth(id: number, authId: string): Promise<ClientWithAuthType | null> {
    try {
      const client = await prisma.tclients.findUnique({
        where: { id },
        include: {
          tclients_auth: {
            where: {
              auth_id: authId,
              is_active: true,
            },
          },
        },
      });
      return client as ClientWithAuthType | null;
    } catch (error) {
      console.error('Error finding client by ID with active auth:', error);
      return null;
    }
  }

  /**
   * Найти клиента по auth_id (транзакционная версия)
   */
  async findByAuthIdTx(tx: Omit<PrismaClient, ITXClientDenyList>, authId: string): Promise<ClientWithAuthType | null> {
    try {
      const client = await tx.tclients.findFirst({
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
   * Создать нового клиента (транзакционная версия)
   */
  async createTx(tx: Omit<PrismaClient, ITXClientDenyList>, data: CreateClientType): Promise<ClientType | null> {
    try {
      const client = await tx.tclients.create({
        data: {
          name: data.name,
          email: data.email,
          additional_info: data.additional_info,
          tarea_id: data.tarea_id,
        },
      });
      return client as ClientType;
    } catch (error) {
      console.error('Error creating client:', error);
      return null;
    }
  }

  /**
   * Создать нового клиента
   */
  async create(data: CreateClientType): Promise<ClientType | null> {
    try {
      const client = await prisma.tclients.create({
        data: {
          name: data.name,
          email: data.email,
          additional_info: data.additional_info,
          tarea_id: data.tarea_id,
        },
      });
      return client as ClientType;
    } catch (error) {
      console.error('Error creating client:', error);
      return null;
    }
  }

  /**
   * Обновить клиента (транзакционная версия)
   */
  async updateTx(tx: Omit<PrismaClient, ITXClientDenyList>, id: number, data: UpdateClientType): Promise<ClientType | null> {
    try {
      const client = await tx.tclients.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          additional_info: data.additional_info,
          tarea_id: data.tarea_id,
        },
      });
      return client as ClientType;
    } catch (error) {
      console.error('Error updating client:', error);
      return null;
    }
  }

  /**
   * Создать аутентификацию клиента (транзакционная версия)
   */
  async createAuthTx(tx: Omit<PrismaClient, ITXClientDenyList>, data: CreateClientAuthType): Promise<ClientAuthType | null> {
    try {
      const auth = await tx.tclients_auth.create({
        data: {
          tclients_id: data.tclients_id,
          auth_type: data.auth_type,
          auth_id: data.auth_id,
          auth_context: data.auth_context,
          refresh_token: data.refresh_token,
          token_expires_at: data.token_expires_at,
          role: data.role || 'user',
        },
      });
      return auth as ClientAuthType;
    } catch (error) {
      console.error('Error creating client auth:', error);
      return null;
    }
  }

  /**
   * Обновить аутентификацию клиента (транзакционная версия)
   */
  async updateAuthTx(tx: Omit<PrismaClient, ITXClientDenyList>, id: number, data: UpdateClientAuthType): Promise<ClientAuthType | null> {
    try {
      const auth = await tx.tclients_auth.update({
        where: { id },
        data: {
          auth_type: data.auth_type,
          auth_id: data.auth_id,
          last_login: data.last_login,
          auth_context: data.auth_context,
          refresh_token: data.refresh_token,
          token_expires_at: data.token_expires_at,
          // пока сделаю так, чтобы при обновлении аутентификации она всегда активна
          is_active: true,
          role: data.role,
        },
      });
      return auth as ClientAuthType;
    } catch (error) {
      console.error('Error updating client auth:', error);
      return null;
    }
  }

  /**
   * Обновить refresh token
   */
  async updateRefreshToken(authId: string, refreshToken: string, expiresAt: Date): Promise<boolean> {
    try {
      await prisma.tclients_auth.updateMany({
        where: {
          auth_id: authId,
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
  async deactivateAuth(authId: string): Promise<boolean> {
    try {
      await prisma.tclients_auth.updateMany({
        where: {
          auth_id: authId,
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