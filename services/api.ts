import axios from 'axios';

/**
 * Core API Configuration
 * Manages communication between the React frontend and the Express backend.
 */
const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized access or expired sessions
    if (error.response?.status === 401) {
      // Logic for redirecting to login can be handled here or in the component tree
    }
    return Promise.reject(error);
  }
);
