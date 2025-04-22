import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://empowher-node-backend.onrender.com/api';

/**
 * Get all jobs with optional filtering
 */
export const getJobs = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/job`, {
      params,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error getting jobs:', error);
    throw error;
  }
};

/**
 * Get a single job by ID
 */
export const getJob = async (jobId: string) => {
  try {
    const response = await axios.get(`${API_URL}/job/${jobId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error getting job details:', error);
    throw error;
  }
};

/**
 * Create a new job
 */
export const createJob = async (jobData: any) => {
  try {
    const response = await axios.post(`${API_URL}/job`, jobData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

/**
 * Update an existing job
 */
export const updateJob = async (jobId: string, jobData: any) => {
  try {
    const response = await axios.put(`${API_URL}/job/${jobId}`, jobData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

/**
 * Delete a job
 */
export const deleteJob = async (jobId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/job/${jobId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

/**
 * Apply for a job
 */
export const applyForJob = async (jobId: string, applicationData: any) => {
  try {
    const response = await axios.post(`${API_URL}/job/${jobId}/apply`, applicationData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
};

/**
 * Save a job to user's saved jobs
 */
export const saveJob = async (jobData: any, userId: string) => {
  try {
    const response = await axios.post(`${API_URL}/jobs/save`, jobData, {
      params: { user_id: userId },
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

/**
 * Get the saved jobs for a user
 */
export const getSavedJobs = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/jobs/saved/${userId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error getting saved jobs:', error);
    throw error;
  }
};

/**
 * Remove a job from saved jobs
 */
export const removeSavedJob = async (userId: string, jobId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/jobs/saved/${userId}/${jobId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error removing saved job:', error);
    throw error;
  }
};

/**
 * Update application status
 */
export const updateApplicationStatus = async (jobId: string, userId: string, status: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/job/${jobId}/application/${userId}`, 
      { status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
}; 