import { NextResponse } from 'next/server';
import { createHealthResponse, checkBackendStatus } from '@/app/config';

/**
 * Health check endpoint for the frontend
 * GET /api/health
 */
export async function GET() {
  try {
    // Check backend status
    const backendStatus = await checkBackendStatus();
    
    // Create response with backend status
    const response = createHealthResponse();
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in health check endpoint:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Error checking health',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Support HEAD requests for health checks
 * HEAD /api/health
 */
export async function HEAD() {
  // For lightweight health checks
  return new Response(null, { 
    status: 200,
    headers: {
      'x-health': 'ok',
      'x-timestamp': new Date().toISOString()
    }
  });
} 