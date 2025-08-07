// Типы для клиентов
export interface ClientType {
  id: number;
  tarea_id: number | null;
  name: string;
  email: string | null;
  additional_info: any | null;
  created_at: Date;
}

// Тип для аутентификации клиента
export interface ClientAuthType {
  id: number;
  tclients_id: number;
  auth_type: string | null;
  auth_id: string | null;
  last_login: Date | null;
  auth_context: any | null;
  refresh_token: string | null;
  token_expires_at: Date | null;
  is_active: boolean;
  role: string;
}

// Тип для клиента с аутентификацией
export interface ClientWithAuthType extends ClientType {
  tclients_auth: ClientAuthType[];
}

// Тип для результата аутентификации
export interface AuthResult {
  isAuthenticated: boolean;
  user?: ClientWithAuthType;
  error?: string;
}

// Тип для создания клиента
export interface CreateClientType {
  name: string;
  email?: string;
  additional_info?: any;
  tarea_id?: number;
}

// Тип для обновления клиента
export interface UpdateClientType {
  name?: string;
  email?: string;
  additional_info?: any;
  tarea_id?: number;
}

// Тип для создания аутентификации клиента
export interface CreateClientAuthType {
  tclients_id: number;
  auth_type: string;
  auth_id: string;
  auth_context?: any;
  refresh_token?: string;
  token_expires_at?: Date;
  role?: string;
}

// Тип для обновления аутентификации клиента
export interface UpdateClientAuthType {
  auth_type?: string;
  auth_id?: string;
  last_login?: Date;
  auth_context?: any;
  refresh_token?: string;
  token_expires_at?: Date;
  is_active?: boolean;
  role?: string;
} 