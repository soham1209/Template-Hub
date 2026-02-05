import { create } from 'zustand';
import { api } from '../lib/api'; // We'll update api.js next

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  // Login Action
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Call your backend endpoint
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      // Save to LocalStorage so refresh keeps them logged in
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      set({ user: data, token: data.token, isLoading: false });
      return true; // Success
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false; // Failed
    }
  },

  // Signup Action
  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Signup failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      set({ user: data, token: data.token, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  // Logout Action
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;