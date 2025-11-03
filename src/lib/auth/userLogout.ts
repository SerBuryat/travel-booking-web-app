'use server'

import {clearAuthCookies, getRefreshTokenFromRequest, verifyRefreshToken} from "@/lib/auth/authUtils";
import {prisma} from "@/lib/db/prisma";

export async function userLogout() : Promise<void> {
  const refreshToken = await getRefreshTokenFromRequest();

  if (!refreshToken) {
    return clearAuthCookies();
  }

  // Validate refresh token to get user info for logging
  const decoded = await verifyRefreshToken(refreshToken);

  if (decoded) {
    await prisma.tclients_auth.updateMany({
      where: {
        id: decoded.authId,
      },
      data: {
        is_active: false,
        refresh_token: null,
        token_expires_at: null,
        role: 'user'
      },
    });
  }

  await clearAuthCookies();
}