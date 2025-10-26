// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:5001'),
  ENDPOINTS: {
    PROFILE: '/api/profile',
    FEEDBACK: '/api/feedback',
    FORUM: '/api/forum',
    TEST_SUBMISSION: '/api/test-submission',
    MOOD_GROOVE: '/api/mood-groove',
    BREATHING_EXERCISE: '/api/breathing-exercise',

    COMPREHENSIVE_ASSESSMENT: '/api/comprehensive-assessment',
  }
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string, params?: string) => {
  const baseUrl = API_CONFIG.BASE_URL;
  const fullEndpoint = params ? `${endpoint}/${params}` : endpoint;
  return `${baseUrl}${fullEndpoint}`;
};

// Common fetch wrapper with error handling
export const apiRequest = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};