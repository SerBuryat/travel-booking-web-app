import { NextRequest, NextResponse } from 'next/server';
import {testDatabaseConnection} from "@/lib/sshPrisma";

export async function GET(req: NextRequest) {
  try {
    console.log('🧪 Testing database connection...');
    
    // Test the connection by running a simple query
    const result = await testDatabaseConnection();
    
    console.log('✅ Database connection successful:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 