const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://empowher-node-backend.onrender.com/api";

export interface SearchQuery {
  query: string;
  location?: string;
  job_type?: string;
  company?: string;
  max_results?: number;
  women_friendly_only?: boolean;
}

export interface JobBasic {
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

export interface SearchResponse {
  results: JobBasic[];
  total_results: number;
  query_time_ms: number;
  women_friendly_count: number;
}

export const searchJobs = async (params: SearchQuery): Promise<SearchResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
};

export const getJobDetails = async (jobUrl: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/job-details?job_url=${encodeURIComponent(jobUrl)}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};

export const chatWithAI = async (message: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error chatting with AI:', error);
    throw error;
  }
};
