// src/pages/LessonDetailPage.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import './LessonDetailPage.css'; // We'll create this next

interface Lesson {
  id: number;
  title: string;
  content: string;
  order: number;
}

const LessonDetailPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the lesson ID from the URL
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLesson = async () => {
      setLoading(true);
      try {
        // Use our authenticated API client to fetch the lesson by ID
        const response = await apiClient.get<Lesson>(`/lessons/${id}/`);
        setLesson(response.data);
      } catch (err) {
        setError('Failed to load the lesson. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  if (loading) {
    return <div className="loading-message">Loading lesson...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!lesson) {
    return <div>Lesson not found.</div>;
  }

  return (
    <div className="lesson-container">
      <h1 className="lesson-page-title">{lesson.title}</h1>
      {/* We use a div with whiteSpace to respect newlines in the content */}
      <div className="lesson-content">
        {lesson.content}
      </div>
    </div>
  );
};

export default LessonDetailPage;
