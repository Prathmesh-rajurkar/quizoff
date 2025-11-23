const API_BASE_URL = import.meta.env.VITE_API_URL ;

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Make API request
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email, password, username) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  },
};

// Quiz API
export const quizAPI = {
  create: async (title, questions) => {
    return apiRequest('/quiz/create', {
      method: 'POST',
      body: JSON.stringify({ title, questions }),
    });
  },

  getByCode: async (code) => {
    return apiRequest(`/quiz/${code}`);
  },

  getLibrary: async () => {
    return apiRequest('/quiz/library');
  },

  delete: async (id) => {
    return apiRequest(`/quiz/${id}`, {
      method: 'DELETE',
    });
  },

  getLeaderboard: async (code) => {
    return apiRequest(`/quiz/${code}/leaderboard`);
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return apiRequest('/user/profile');
  },

  getSessions: async () => {
    return apiRequest('/user/sessions');
  },
};

// WebSocket helper
export const createWebSocket = (code, userId, username) => {
  const wsUrl = import.meta.env.VITE_WS_URL || (window.location.protocol === 'https:' ? 'wss://localhost:5000' : 'ws://localhost:5000');
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: 'JOIN_QUIZ',
      payload: { code, userId, username }
    }));
  };

  return ws;
};

