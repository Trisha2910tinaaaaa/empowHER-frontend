import { NextRequest, NextResponse } from 'next/server';

// Define interfaces matching our FastAPI backend
interface SearchQuery {
  query: string;
  location?: string;
  job_type?: string;
  company?: string;
  max_results?: number;
  women_friendly_only?: boolean;
}

interface JobBasic {
  title: string;
  company: string;
  location?: string;
  job_type?: string;
  posting_date?: string;
  salary_range?: string;
  application_url: string;
  is_women_friendly?: boolean;
  skills?: string[];
}

interface SearchResponse {
  results: JobBasic[];
  total_results: number;
  query_time_ms: number;
  women_friendly_count: number;
}

// Get the backend API URL from environment, fallback to localhost for development
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://empowher-backend.onrender.com';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const searchParams: SearchQuery = await request.json();
    
    // Log the search query for debugging
    console.log('Search query:', searchParams);
    
    // Forward the request to the backend API
    const response = await fetch(`${BACKEND_API_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams),
    });
    
    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from backend:', errorText);
      
      return NextResponse.json(
        { error: 'Failed to fetch job results', details: errorText },
        { status: response.status }
      );
    }
    
    // Parse the response data
    const data: SearchResponse = await response.json();
    
    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing search request:', error);
    
    // Return an error response
    return NextResponse.json(
      { 
        error: 'An error occurred while processing your request',
        results: [],
        total_results: 0,
        query_time_ms: 0,
        women_friendly_count: 0
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // For any GET requests, return a message explaining this is a POST endpoint
  return NextResponse.json(
    { 
      error: 'This endpoint only accepts POST requests with a search query',
      example: {
        query: "Software Engineer jobs", 
        location: "Remote",
        max_results: 5
      }
    },
    { status: 405 }
  );
} 