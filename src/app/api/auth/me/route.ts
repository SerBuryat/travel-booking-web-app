import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { 
  getJWTFromRequest, 
  getClientIP, 
  logLoginAttempt 
} from '@/lib/auth';
import { ClientService } from '@/service/ClientService';

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = getJWTFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Validate JWT token
    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get user data from database
    const clientService = new ClientService();
    const user = await clientService.findByIdWithActiveAuth(payload.userId, payload.authId);
    
    if (!user || user.tclients_auth.length === 0) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    const auth = user.tclients_auth[0];
    
    // Log successful authentication check
    const clientIP = getClientIP(request);
    logLoginAttempt(user.id, true, clientIP);

    // Return user profile
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: auth.role,
        created_at: user.created_at,
        additional_info: user.additional_info,
        last_login: auth.last_login,
        is_active: auth.is_active
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 