import { NextRequest, NextResponse } from 'next/server';

// Define interfaces matching our FastAPI backend
interface SkillInfo {
  name: string;
  level?: string;
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

interface JobDetail extends JobBasic {
  description?: string;
  qualifications?: string[];
  skills_required?: SkillInfo[];
  benefits?: string[];
  why_women_friendly?: string[];
  additional_info?: Record<string, any>;
}

// Get the backend API URL from environment, fallback to localhost for development
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://empowher-backend.onrender.com';

export async function GET(
  request: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    // Get the URL parameter and decode it
    const encodedUrl = params.url;
    
    // Make sure we have a URL
    if (!encodedUrl) {
      return NextResponse.json(
        { error: 'Missing job URL parameter' },
        { status: 400 }
      );
    }
    
    // Decode and format the URL for the backend
    // Replace triple underscores with :// if needed for our encoding scheme
    let jobUrl = decodeURIComponent(encodedUrl);
    
    // Forward the request to the backend API
    const response = await fetch(`${BACKEND_API_URL}/api/job/${jobUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from backend:', errorText);
      
      return NextResponse.json(
        { error: 'Failed to fetch job details', details: errorText },
        { status: response.status }
      );
    }
    
    // Parse the response data
    const jobDetail: JobDetail = await response.json();
    
    // Return the response
    return NextResponse.json(jobDetail);
  } catch (error) {
    console.error('Error processing job details request:', error);
    
    // Return an error response
    return NextResponse.json(
      { 
        error: 'An error occurred while processing your request',
        title: 'Job Details Unavailable',
        company: 'Unknown',
        application_url: '#'
      },
      { status: 500 }
    );
  }
} 