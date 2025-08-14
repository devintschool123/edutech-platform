// frontend/src/components/CourseList.tsx

import type { Course } from '../types/course';
import CourseCard from './CourseCard';

interface CourseListProps {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

const CourseList = ({ courses, loading, error }: CourseListProps) => {
  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="course-list-container">
      <h1>Available Courses</h1>
      {courses.length > 0 ? (
        <div className="course-list">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p>No courses found. Try adding some in the Django admin!</p>
      )}
    </div>
  );
};

export default CourseList;
