import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://empowher-node-backend.onrender.com/api';
const POSTS_URL = `${API_URL}/posts`;
const COMMUNITY_URL = `${API_URL}/community`;

// Helper to get auth token
const getAuthHeaders = () => {
  let token;
  
  // Handle server-side vs client-side
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('auth_token');
  }
  
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    withCredentials: true
  };
};

/**
 * Check if backend is available
 * @returns Promise<boolean> true if backend is available, false otherwise
 */
async function isBackendAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_URL}/health`, {
      method: "HEAD", // Use HEAD for quick health check
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn("Backend health check failed:", error);
    return false;
  }
}

/**
 * Get all communities
 */
export const getCommunities = async () => {
  try {
    const response = await axios.get(`${COMMUNITY_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching communities:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data);
    }
    throw error;
  }
};

/**
 * Get single community by ID
 */
export const getCommunity = async (communityId: string) => {
  try {
    const response = await axios.get(`${COMMUNITY_URL}/${communityId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching community ${communityId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data);
    }
    throw error;
  }
};

/**
 * Create a new community
 */
export const createCommunity = async (communityData: any) => {
  try {
    const response = await axios.post(`${COMMUNITY_URL}`, communityData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating community:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data);
    }
    throw error;
  }
};

/**
 * Join a community
 */
export const joinCommunity = async (communityId: string, userId: string): Promise<any> => {
  try {
    // Validate inputs
    if (!communityId) throw new Error('Community ID is required');
    if (!userId) throw new Error('User ID is required');
    
    // Get auth token from client-side localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) {
      console.error('Authentication token not found');
      return { success: false, message: 'Authentication required' };
    }
    
    // Check if backend is available
    const isAvailable = await isBackendAvailable();
    if (!isAvailable) {
      console.warn('Backend unavailable, cannot join community');
      return { success: false, message: 'Server unavailable, please try again later' };
    }
    
    const response = await fetch(`${API_URL}/community/join/${communityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Join community error:', errorData);
      return { 
        success: false, 
        message: errorData.message || `Error ${response.status}: Failed to join community` 
      };
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error('Join community error:', error);
    return { 
      success: false, 
      message: error.message || 'An unexpected error occurred while joining the community'
    };
  }
};

/**
 * Leave a community
 */
export const leaveCommunity = async (communityId: string, userId: string | { id: string }): Promise<any> => {
  try {
    // Validate inputs
    if (!communityId) throw new Error('Community ID is required');
    if (!userId) throw new Error('User ID is required');
    
    // Get auth token - check localStorage for client-side
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    console.log('Token available for leave:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.error('Authentication token not found');
      return { success: false, message: 'Authentication required' };
    }
    
    // Ensure userId is a string
    let formattedUserId = typeof userId === 'string' ? userId : userId.id;
    console.log('Formatted user ID for leave:', formattedUserId);
    
    // Create request body with user ID
    const requestBody = { userId: formattedUserId };
    console.log('Request body for leave community:', requestBody);
    
    // Make the API call
    const response = await axios.put(
      `${COMMUNITY_URL}/${communityId}/leave`, 
      requestBody, 
      getAuthHeaders()
    );
    
    console.log('Leave community response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error leaving community ${communityId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data);
      console.error('API Error status:', error.response?.status);
      console.error('Request body that failed:', error.config?.data);
      console.error('Request URL that failed:', error.config?.url);
    }
    throw error;
  }
};

/**
 * Toggle community notifications
 */
export const toggleCommunityNotifications = async (communityId: string) => {
  try {
    const response = await axios.put(`${COMMUNITY_URL}/${communityId}/notifications`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error(`Error toggling notifications for community ${communityId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data);
    }
    throw error;
  }
};

/**
 * Get community posts
 */
export const getCommunityPosts = async (communityId: string) => {
  try {
    const response = await axios.get(`${COMMUNITY_URL}/${communityId}/posts`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for community ${communityId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data);
    }
    throw error;
  }
};

/**
 * Create a post in a community
 */
export const createCommunityPost = async (communityId: string, postData: any) => {
  try {
    console.log('API call: Creating post in community', communityId);
    console.log('Post data being sent:', postData);
    
    // Include the auth headers if available, but don't require them
    const response = await axios.post(`${COMMUNITY_URL}/${communityId}/posts`, postData, getAuthHeaders());
    
    console.log('Post creation successful:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error creating post in community ${communityId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data);
      console.error('API Error status:', error.response?.status);
      console.error('Request data that caused error:', error.config?.data);
    }
    throw error;
  }
};

/**
 * Like a post
 */
export const likePost = async (postId: string, userId?: string) => {
  try {
    console.log('API call: Liking post', postId, 'with user ID:', userId);
    
    // Create request body with user ID if provided
    const requestBody = userId ? { userId } : {};
    
    // Use the community endpoint path
    const response = await axios.post(`${COMMUNITY_URL}/posts/${postId}/like`, requestBody, getAuthHeaders());
    console.log('Like post response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error liking post ${postId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data);
      console.error('API Error status:', error.response?.status);
      console.error('API Error URL:', error.config?.url);
    }
    throw error;
  }
};

/**
 * Unlike a post
 */
export const unlikePost = async (postId: string, userId?: string) => {
  try {
    console.log('API call: Unliking post', postId, 'with user ID:', userId);
    
    // Create request options with user ID in body if provided
    const config = {
      ...getAuthHeaders(),
      data: userId ? { userId } : {}
    };
    
    // Use the community endpoint path
    const response = await axios.delete(`${COMMUNITY_URL}/posts/${postId}/like`, config);
    console.log('Unlike post response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error unliking post ${postId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data);
      console.error('API Error status:', error.response?.status);
      console.error('API Error URL:', error.config?.url);
    }
    throw error;
  }
};

/**
 * Add a comment to a post
 */
export const addComment = async (postId: string, content: string) => {
  try {
    const response = await axios.post(`${POSTS_URL}/${postId}/comments`, { content }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to post ${postId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data);
    }
    throw error;
  }
};

/**
 * Delete a comment from a post
 */
export const deleteComment = async (postId: string, commentId: string) => {
  try {
    const response = await axios.delete(`${POSTS_URL}/${postId}/comments/${commentId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment ${commentId} from post ${postId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data);
    }
    throw error;
  }
};

/**
 * Delete a post
 */
export const deletePost = async (postId: string) => {
  try {
    console.log('API call: Deleting post', postId);
    
    // Make the API call
    const response = await axios.delete(
      `${COMMUNITY_URL}/posts/${postId}`,
      getAuthHeaders()
    );
    
    console.log('Delete post response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data);
      console.error('API Error status:', error.response?.status);
      console.error('Request URL that failed:', error.config?.url);
    }
    throw error;
  }
}; 