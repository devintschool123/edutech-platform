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
  // We remove initialize from here as it will no longer be an action called from a component
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // --- THIS IS THE SELF-INITIALIZATION LOGIC ---
  // It runs just once, when the store is first defined.
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        const user: User = { id: decoded.user_id, username: decoded.username };
        // Set the initial state directly
        return {
          accessToken: token,
          user: user,
          // The login/logout functions are defined below
          login: async () => false, // Placeholder, will be replaced
          logout: () => {},       // Placeholder, will be replaced
        };
      }
    } catch (error) {
      console.error("Error decoding token on initial load:", error);
      localStorage.removeItem('accessToken');
    }
  }
  // Default state if no valid token is found
  return {
    accessToken: null,
    user: null,
    login: async () => false,
    logout: () => {},
  };
});

// --- DEFINE ACTIONS SEPARATELY ---
// This pattern ensures the state is set up before actions are defined.

const login = async (username, password) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/', {
      username,
      password,
    });
    const { access } = response.data;
    const decoded: DecodedToken = jwtDecode(access);
    const user: User = { id: decoded.user_id, username: decoded.username };

    localStorage.setItem('accessToken', access);
    useAuthStore.setState({ accessToken: access, user: user });
    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

const logout = () => {
  localStorage.removeItem('accessToken');
  useAuthStore.setState({ accessToken: null, user: null });
};

// Set the actions on the store
useAuthStore.setState({ login, logout });
