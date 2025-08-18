// src/stores/enrollmentStore.ts

import { create } from 'zustand';
import apiClient from '../api/axiosConfig';

interface Enrollment {
  id: number;
  course: number; // The ID of the course the user is enrolled in
}

interface EnrollmentState {
  enrollments: Enrollment[];
  fetchEnrollments: () => Promise<void>;
  isEnrolled: (courseId: number) => boolean;
  addEnrollment: (enrollment: Enrollment) => void;
}

export const useEnrollmentStore = create<EnrollmentState>((set, get) => ({
  enrollments: [],
  
  fetchEnrollments: async () => {
    try {
      const response = await apiClient.get<Enrollment[]>('/my-enrollments/');
      set({ enrollments: response.data });
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      set({ enrollments: [] });
    }
  },

  // A helper function to easily check if the user is enrolled in a specific course
  isEnrolled: (courseId: number) => {
    const { enrollments } = get();
    return enrollments.some(e => e.course === courseId);
  },

  // A function to manually add an enrollment to the state after a successful API call
  addEnrollment: (enrollment: Enrollment) => {
    set(state => ({
        enrollments: [...state.enrollments, enrollment]
    }));
  }
}));
