// src/stores/courseStore.ts

import { create } from 'zustand';
import apiClient from '../api/axiosConfig'; // <-- IMPORT our new smart client
import type { Course } from '../types/course';

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  loading: true,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      // USE our new smart client for the request
      // The URL is now just '/courses/' because the base URL is in the config
      const response = await apiClient.get('/courses/');
      set({ courses: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch courses.", loading: false });
      console.error("Failed to fetch courses:", error);
    }
  },
}));
