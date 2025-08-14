// src/pages/CourseDetailPage.tsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import type { Course } from '../types/course';
import './CourseDetailPage.css'; // We'll create this next

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the course ID from the URL
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // Don't fetch if there's no ID

    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use our authenticated API client to fetch a single course by its ID
        const response = await apiClient.get(`/courses/${id}/`);
        setCourse(response.data);
      } catch (err) {
        setError('Failed to load course details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]); // Re-run the effect if the ID in the URL changes

  if (loading) {
    return <div className="loading-message">Loading course details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!course) {
    return <div>Course not found.</div>;
  }

  return (
    <div className="course-detail-container">
      <h1 className="course-title">{course.title}</h1>
      <p className="course-description">{course.description}</p>
      <hr className="divider" />
      <h2 className="lessons-heading">Lessons</h2>
      {course.lessons && course.lessons.length > 0 ? (
        <ul className="lesson-list">
  {course.lessons.map((lesson) => (
    <li key={lesson.id} className="lesson-item-wrapper">
      <Link to={`/lessons/${lesson.id}`} className="lesson-link">
        <div className="lesson-item">
          <span className="lesson-order">Lesson {lesson.order}:</span>
          <span className="lesson-title">{lesson.title}</span>
        </div>
      </Link>
    </li>
  ))}
</ul>
      ) : (
        <p>No lessons available for this course yet.</p>
      )}
    </div>
  );
};

export default CourseDetailPage;
