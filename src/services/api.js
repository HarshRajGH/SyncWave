const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'syncwave_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  auth: {
    register: (name, email, password) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    getMe: () => request('/auth/me'),
    updateProfile: (data) =>
      request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  waves: {
    getAll: () => request('/waves'),
    getById: (id) => request(`/waves/${id}`),
    create: (waveData) =>
      request('/waves', {
        method: 'POST',
        body: JSON.stringify(waveData),
      }),
    join: (id) =>
      request(`/waves/${id}/join`, {
        method: 'POST',
      }),
    leave: (id) =>
      request(`/waves/${id}/leave`, {
        method: 'POST',
      }),
    toggleGoal: (waveId, goalId) =>
      request(`/waves/${waveId}/goals/${goalId}`, {
        method: 'PATCH',
      }),
    end: (waveId) =>
      request(`/waves/${waveId}/end`, {
        method: 'POST',
      }),
  },
  history: {
    getAll: () => request('/history'),
    clear: () =>
      request('/history', {
        method: 'DELETE',
      }),
  },
  messages: {
    getByWave: (waveId) => request(`/messages/${waveId}`),
    send: (waveId, text) =>
      request(`/messages/${waveId}`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
  },
};

export default api;
