// src/stores/authStore.ts

import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types/user';

interface DecodedToken {
  user_id: number;
  username: string;
  exp: number;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  initialize: () => void; // The new action to check for a stored token
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,

  initialize: () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        // Check if the token from storage is still valid
        if (decoded.exp * 1000 > Date.now()) {
          const user: User = { id: decoded.user_id, username: decoded.username };
          set({ accessToken: token, user: user });
        } else {
          // If token is expired, remove it
          localStorage.removeItem('accessToken');
        }
      } catch (error) {
        console.error("Error decoding token on init:", error);
        localStorage.removeItem('accessToken');
      }
    }
  },

  login: async (username, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });
      const { access } = response.data;
      const decoded: DecodedToken = jwtDecode(access);
      const user: User = { id: decoded.user_id, username: decoded.username };

      localStorage.setItem('accessToken', access);
      set({ accessToken: access, user: user });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ accessToken: null, user: null });
  },
}));
