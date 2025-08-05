import { NextRequest, NextResponse } from 'next/server';
import { validateRefreshToken, generateJWT, generateRefreshToken } from '@/lib/jwt';
import { 
  getRefreshTokenFromRequest, 
  setJWTCookie, 
  setRefreshTokenCookie, 
  getClientIP, 
  logLoginAttempt 
} from '@/lib/auth';
import { ClientService } from '@/service/ClientService';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = getRefreshTokenFromRequest(request);
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
    }

    // Validate refresh token
    const decoded = validateRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Check if user exists and is active
    const clientService = new ClientService();
    const user = await clientService.findByIdWithActiveAuth(decoded.userId, decoded.authId);
    
    if (!user || user.tclients_auth.length === 0) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    const auth = user.tclients_auth[0];
    
    // Generate new tokens
    const newJWT = generateJWT(user.id, auth.role, decoded.authId);
    const newRefreshToken = generateRefreshToken(user.id, decoded.authId);
    
    // Calculate new token expiration
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 1); // 1 hour
    
    // Update refresh token in database
    const refreshTokenUpdated = await clientService.updateRefreshToken(
      decoded.authId,
      newRefreshToken,
      tokenExpiresAt
    );
    
    if (!refreshTokenUpdated) {
      console.error('Failed to update refresh token');
      return NextResponse.json(
        { error: 'Failed to update authentication data' },
        { status: 500 }
      );
    }

    // Log token refresh
    const clientIP = getClientIP(request);
    logLoginAttempt(user.id, true, clientIP);

    // Create response with new tokens in cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: auth.role
      }
    });

    // Set new tokens in httpOnly cookies
    setJWTCookie(newJWT, response);
    setRefreshTokenCookie(newRefreshToken, response);
    
    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 