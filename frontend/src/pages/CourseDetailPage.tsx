// src/pages/CourseDetailPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuthStore } from '../stores/authStore';
import { useEnrollmentStore } from '../stores/enrollmentStore';
import './CourseDetailPage.css';

// Type Definitions
interface Lesson {
  id: number;
  title: string;
  content: string;
  order: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  owner: string;
  lessons: Lesson[];
}

const CourseDetailPage = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isEnrolled, addEnrollment } = useEnrollmentStore();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<Course>(`/courses/${courseId}/`);
        setCourse(response.data);
      } catch (err) {
        setError('Failed to load course details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, refreshKey]);

  // --- FULLY IMPLEMENTED DELETE FUNCTIONS ---

  const handleCourseDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    try {
      await apiClient.delete(`/courses/${courseId}/`);
      navigate('/courses');
    } catch (err) {
      console.error('Failed to delete course:', err);
      setError('You do not have permission to delete this course, or an error occurred.');
    }
  };
  
  const handleLessonDelete = async (lessonId: number) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) {
      return;
    }
    try {
      await apiClient.delete(`/lessons/${lessonId}/`);
      // Trigger a re-fetch of the course data to show the updated lesson list
      setRefreshKey(oldKey => oldKey + 1); 
    } catch (err) {
      console.error('Failed to delete lesson:', err);
      alert('Failed to delete the lesson. You may not have permission.');
    }
  };

  const handleEnroll = async () => {
    if (!courseId) return;
    setIsEnrolling(true);
    try {
      const response = await apiClient.post('/enrollments/', { course: courseId });
      addEnrollment(response.data);
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Enrollment failed. You may already be enrolled or another error occurred.');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) return <div className="loading-message">Loading course details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!course) return <div>Course not found.</div>;

  const isOwner = user?.username === course.owner;
  const alreadyEnrolled = isEnrolled(Number(courseId));
  const showEnrollButton = user && !isOwner && !alreadyEnrolled;

  return (
    <div className="course-detail-container">
      <div className="course-detail-header">
        <div className="course-info">
          <h1 className="course-title">{course.title}</h1>
          <p className="course-owner">Created by: <strong>{course.owner}</strong></p>
        </div>
        
        {isOwner && (
          <div className="course-actions">
            <Link to={`/courses/${courseId}/edit`} className="edit-button">Edit Course</Link>
            {/* This now correctly calls handleCourseDelete */}
            <button onClick={handleCourseDelete} className="delete-button">Delete Course</button>
          </div>
        )}
        
        {showEnrollButton && (
          <div className="course-actions">
            <button onClick={handleEnroll} className="enroll-button" disabled={isEnrolling}>
              {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          </div>
        )}

        {alreadyEnrolled && !isOwner && (
          <div className="course-actions">
            <span className="enrolled-message">✓ Enrolled</span>
          </div>
        )}
      </div>

      <p className="course-description">{course.description}</p>
      
      <hr className="divider" />
      
      <div className="lessons-header">
        <h2 className="lessons-heading">Lessons</h2>
        {isOwner && (
          <Link to={`/courses/${courseId}/add-lesson`} className="add-lesson-button">+ Add Lesson</Link>
        )}
      </div>
      
      {course.lessons && course.lessons.length > 0 ? (
        <ul className="lesson-list">
          {course.lessons.map((lesson) => (
            <li key={lesson.id} className="lesson-item-wrapper">
              <div className="lesson-item-content">
                <Link to={`/lessons/${lesson.id}`} className="lesson-link">
                  <div className="lesson-info">
                    <span className="lesson-order">Lesson {lesson.order}:</span>
                    <span className="lesson-title">{lesson.title}</span>
                  </div>
                </Link>
                {isOwner && (
                  <div className="lesson-actions">
                    <Link to={`/lessons/${lesson.id}/edit`} className="lesson-edit-button">Edit</Link>
                    {/* This now correctly calls handleLessonDelete */}
                    <button onClick={() => handleLessonDelete(lesson.id)} className="lesson-delete-button">Delete</button>
                  </div>
                )}
              </div>
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
