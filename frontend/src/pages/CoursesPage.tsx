// src/pages/CoursesPage.tsx

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../stores/courseStore';
import CourseCard from '../components/CourseCard';
import './CoursesPage.css';

const CoursesPage = () => {
  const { courses, loading, error, fetchCourses } = useCourseStore();

  useEffect(() => {
    // Call fetchCourses every time the component mounts to get the latest list
    fetchCourses();
  }, [fetchCourses]);

  if (loading) {
    return <div className="loading-message">Loading courses...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="courses-page">
      {/* Header section with title and the new button */}
      <div className="courses-header">
        <h1>All Courses</h1>
        <Link to="/create-course" className="create-course-button">
          Create New Course
        </Link>
      </div>

      {/* Grid to display all the course cards */}
      <div className="courses-grid">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
