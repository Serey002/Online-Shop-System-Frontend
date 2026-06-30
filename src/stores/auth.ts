// stores/auth.ts
import { defineStore } from 'pinia';
import api from '@/services/api';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null);
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const isAuthenticated = ref<boolean>(!!token.value);

  const login = async (credentials: any) => {
    const response = await api.post('/login', credentials); 
    token.value = response.data.access_token; 
    localStorage.setItem('auth_token', token.value!);
    isAuthenticated.value = true;
    user.value = response.data.user;
  };

  const register = async (userData: any) => {
    const response = await api.post('/register', userData);
    if (response.data.access_token) {
      token.value = response.data.access_token;
      localStorage.setItem('auth_token', token.value!);
      isAuthenticated.value = true;
      user.value = response.data.user;
    }
    return response.data;
  };

  const fetchUser = async () => {
    if (!token.value) return;
    try {
      const response = await api.get('/user');
      user.value = response.data;
      isAuthenticated.value = true; // Keeps session safe on refresh
    } catch (e) {
      console.error('Failed to fetch user:', e);
      // Clear invalid token
      logout();
      throw e; // Re-throw so caller knows it failed
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('auth_token');
  };

  return { user, token, isAuthenticated, login, register, logout, fetchUser };
});