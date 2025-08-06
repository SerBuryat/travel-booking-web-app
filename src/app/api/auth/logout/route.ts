import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken } from '@/lib/jwt';
import { 
  getRefreshTokenFromRequest, 
  clearAuthCookies, 
  getClientIP, 
  logLoginAttempt 
} from '@/lib/auth';
import { ClientService } from '@/service/ClientService';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = getRefreshTokenFromRequest(request);
    
    if (!refreshToken) {
      // Even if no token, clear cookies and return success
      const response = NextResponse.json({ success: true });
      return clearAuthCookies(response);
    }

    // Validate refresh token to get user info for logging
    const decoded = verifyRefreshToken(refreshToken);
    
    if (decoded) {
      // Deactivate auth in database
      const clientService = new ClientService();
      await clientService.deactivateAuth(decoded.authId);
      
      // Log logout
      const clientIP = getClientIP(request);
      logLoginAttempt(decoded.userId, false, clientIP);
    }

    // Clear cookies regardless of token validity
    const response = NextResponse.json({ success: true });
    return clearAuthCookies(response);

  } catch (error) {
    console.error('Logout error:', error);
    
    // Even on error, clear cookies for security
    const response = NextResponse.json({ success: true });
    return clearAuthCookies(response);
  }
} 