import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { getJWTFromRequest } from '@/lib/auth';
import { ClientService } from '@/service/ClientService';

export async function POST(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = getJWTFromRequest(request);
    
    if (!token) {
      return NextResponse.json({
        valid: false,
        error: 'No authentication token provided'
      });
    }

    // Validate JWT token
    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid authentication token'
      });
    }

    // Check if user exists and is active
    const clientService = new ClientService();
    const user = await clientService.findByIdWithActiveAuth(payload.userId, payload.authId);
    
    if (!user || user.tclients_auth.length === 0) {
      return NextResponse.json({
        valid: false,
        error: 'User not found or inactive'
      });
    }

    const auth = user.tclients_auth[0];
    
    // Return validation result
    return NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        role: auth.role,
        is_active: auth.is_active
      }
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({
      valid: false,
      error: 'Internal server error'
    });
  }
} 