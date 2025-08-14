// frontend/src/components/CourseCard.tsx
import { Link } from 'react-router-dom';
import type { Course } from '../types/course';
import './CourseCard.css';
import '../App.css';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Link to={`/courses/${course.id}`} className="course-card-link">
      <div className="course-card">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
      </div>
    </Link>
  );
};

export default CourseCard;
