import { NextRequest, NextResponse } from 'next/server';
import { generateJWT, generateRefreshToken } from '@/lib/jwt';
import { setJWTCookie, setRefreshTokenCookie, getClientIP, logLoginAttempt } from '@/lib/auth';
import { ClientService } from '@/service/ClientService';
import { TelegramUser } from '@/types/telegram';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegramUser } = body;

    if (!telegramUser || !telegramUser.id) {
      return NextResponse.json(
        { error: 'Missing or invalid Telegram user data' },
        { status: 400 }
      );
    }

    // Validate that telegramUser has the correct structure
    const user: TelegramUser = {
      id: telegramUser.id,
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name,
      username: telegramUser.username,
      language_code: telegramUser.language_code,
      allows_write_to_pm: telegramUser.allows_write_to_pm,
      photo_url: telegramUser.photo_url
    };

    // Generate JWT tokens first
    const authId = `telegram_${user.id}`;
    const jwtToken = generateJWT(user.id, 'user', authId); // Default role
    const refreshToken = generateRefreshToken(user.id, authId);
    
    // Calculate token expiration
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 1); // 1 hour

    // Create or update user in database with transaction
    const clientService = new ClientService();
    const clientWithAuth = await clientService.createOrUpdateWithTelegramAuthInTransaction(
      user, 
      authId, 
      refreshToken, 
      tokenExpiresAt
    );
    
    if (!clientWithAuth || !clientWithAuth.tclients_auth.length) {
      console.error('Failed to create or update client with Telegram auth in transaction');
      return NextResponse.json(
        { error: 'Failed to authenticate user' },
        { status: 500 }
      );
    }

    const auth = clientWithAuth.tclients_auth[0];
    
    // Log successful login
    const clientIP = getClientIP(request);
    logLoginAttempt(clientWithAuth.id, true, clientIP);

    // Create response with tokens in cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: clientWithAuth.id,
        name: clientWithAuth.name,
        role: auth.role,
        telegram_id: user.id,
        username: user.username
      }
    });

    // Set tokens in httpOnly cookies
    setJWTCookie(jwtToken, response);
    setRefreshTokenCookie(refreshToken, response);
    
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 