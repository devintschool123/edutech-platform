// src/pages/DashboardPage.tsx

import { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import CourseCard from '../components/CourseCard';
import { useAuthStore } from '../stores/authStore';
import './DashboardPage.css';

// We need to know the shape of the data we're getting
interface Course {
  id: number;
  title: string;
  description: string;
}

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        // Call our new, protected, user-specific endpoint
        const response = await apiClient.get<Course[]>('/my-courses/');
        setCourses(response.data);
      } catch (err) {
        console.error('Failed to fetch user courses:', err);
        setError('Could not load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []); // This effect runs once when the component mounts

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username || 'User'}!</h1>
        <p>Here are the courses you have created. You can manage them from here.</p>
      </div>

      {loading && <div className="loading-message">Loading your courses...</div>}
      {error && <div className="error-message">{error}</div>}
      
      {!loading && !error && (
        <>
          {courses.length > 0 ? (
            <div className="courses-grid">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="no-courses-message">
              <h2>You haven't created any courses yet.</h2>
              <p>Why not create your first one?</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
