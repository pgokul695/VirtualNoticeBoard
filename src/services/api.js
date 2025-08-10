// API Base URL - Using relative URLs for development with proxy
// In production, this will be handled by environment variables
const API_BASE = process.env.NODE_ENV === 'production' 
  ? (process.env.REACT_APP_API_BASE_URL || 'https://code-for-campus-production.up.railway.app')
  : ''; // Empty string for development to use relative URLs with proxy

console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE || 'Using relative URLs with proxy');

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = new Error(data.detail || `HTTP error! status: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

// API service functions
export const apiService = {
  // Get headers with authorization
  getHeaders: (token) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:3002',
      'Access-Control-Allow-Credentials': 'true',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['Firebase-ID-Token'] = token;
    }
    
    console.log('Request headers:', headers);
    return headers;
  },

  // User endpoints
  getCurrentUser: async (token) => {
    try {
      console.log('Fetching current user with token:', token ? 'Token present' : 'No token');
      const url = `${API_BASE}/api/v1/users/me`;
      console.log('GET', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiService.getHeaders(token),
        credentials: 'include', // Include cookies for session handling
        mode: 'cors' // Explicitly set CORS mode
      });
      
      console.log('Response status:', response.status);
      
      // Handle 404 - User doesn't exist yet
      if (response.status === 404) {
        console.log('User not found in backend, registration required');
        return null;
      }
      
      const data = await handleResponse(response);
      console.log('User data received:', data);
      return data;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  },
  
  // Register a new user
  registerUser: async ({ token, email, name }) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          ...apiService.getHeaders(token),
          'Firebase-ID-Token': token
        },
        body: JSON.stringify({ email, name })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to register user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      console.log('Sending user data to backend:', userData);
      
      // Extract the token from userData if it exists
      const { token, ...userDataWithoutToken } = userData;
      
      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(userDataWithoutToken)
      });
      
      console.log('Backend response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Backend error details:', errorData);
        throw new Error(errorData.detail || `Failed to create user: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  updateCurrentUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/users/me`, {
        method: 'PUT',
        headers: apiService.getHeaders(),
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to update current user:', error);
      throw error;
    }
  },

  // Notice endpoints
  getNotices: async (params = {}) => {
    try {
      // Set default pagination if not provided
      if (!params.page) params.page = 1;
      if (!params.per_page) params.per_page = 20;
      
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE}/api/v1/notices/${queryString ? '?' + queryString : ''}`;
      
      console.log('Fetching notices from:', url); // Debug log
      
      const response = await fetch(url, {
        headers: apiService.getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Return the notices array from the paginated response
      return data.notices || [];
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      // Return mock data for demo
      return [
        {
          id: 1,
          title: "Welcome to New Academic Year 2025",
          content: "We welcome all students to the new academic year. Classes will begin from August 15th. Please complete your registration process.",
          category: "main",
          subcategory: null,
          priority: "high",
          created_at: "2025-08-09T10:00:00Z",
          views: 245,
          author: "Main Office"
        },
        {
          id: 2,
          title: "IEEE Workshop on Machine Learning",
          content: "Join us for an exciting workshop on Machine Learning fundamentals. Date: August 20th, Time: 2:00 PM, Venue: Seminar Hall A",
          category: "club",
          subcategory: "IEEE",
          priority: "medium",
          created_at: "2025-08-08T14:30:00Z",
          views: 89,
          author: "IEEE Club"
        },
        {
          id: 3,
          title: "CSE Department Lab Schedule Update",
          content: "Updated lab schedules for all CSE courses are now available. Please check the department notice board for detailed timings.",
          category: "department",
          subcategory: "CSE",
          priority: "medium",
          created_at: "2025-08-07T11:15:00Z",
          views: 156,
          author: "CSE Department"
        }
      ];
    }
  },

  createNotice: async (noticeData) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/notices/`, {
        method: 'POST',
        headers: apiService.getHeaders(),
        body: JSON.stringify(noticeData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create notice:', error);
      throw error;
    }
  },

  getNotice: async (noticeId) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/notices/${noticeId}`, {
        headers: apiService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch notice:', error);
      throw error;
    }
  },

  updateNotice: async (noticeId, noticeData) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/notices/${noticeId}`, {
        method: 'PUT',
        headers: apiService.getHeaders(),
        body: JSON.stringify(noticeData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to update notice:', error);
      throw error;
    }
  },

  deleteNotice: async (noticeId) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/notices/${noticeId}`, {
        method: 'DELETE',
        headers: apiService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to delete notice:', error);
      throw error;
    }
  },

  getSubcategories: async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/notices/categories/subcategories`, {
        headers: apiService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
      // Return mock subcategories for demo
      return {
        departments: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'MBA', 'MCA'],
        clubs: ['IEEE', 'Coding Club', 'Debate Society', 'Music Club', 'Drama Club', 'Photography Club', 'Sports Club']
      };
    }
  }
};
