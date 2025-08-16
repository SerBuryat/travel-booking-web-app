import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { 
  getJWTFromRequest, 
  getClientIP, 
  logLoginAttempt 
} from '@/lib/auth';
import { ClientService } from '@/service/ClientService';

export interface UserAuth {
  userId: number;
  authId: string;
  role: string;
  providerId?: number
}

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

    const auth = user.tclients_auth.find(auth => auth.auth_id === payload.authId);
    if (!auth) {
      return NextResponse.json(
        { error: 'User auth not found' },
        { status: 401 }
      );
    }
    
    // Log successful authentication check
    const clientIP = getClientIP(request);
    logLoginAttempt(user.id, true, clientIP);

    
    // Return user profile
    return NextResponse.json({
      success: true,
      user: {
        userId: user.id,
        authId: auth.auth_id,
        role: auth.role,
        providerId: user.providerId
      } as UserAuth
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 