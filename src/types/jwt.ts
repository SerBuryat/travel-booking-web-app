export interface JWTPayload {
  userId: number; // tclients.id
  role: string; // tclients_auth.role
  authId: number; // tclients_auth.id
  providerId?: number; // tproviders.id
}

export interface RefreshTokenPayload {
  userId: number;
  authId: number;
  tokenId: string;
}
