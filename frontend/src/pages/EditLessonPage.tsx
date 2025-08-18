// src/pages/EditLessonPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import './Forms.css';

// We need to know the shape of a lesson from the API
interface Lesson {
  id: number;
  title: string;
  content: string;
  order: number;
  course: number; // The ID of the parent course
}

const EditLessonPage = () => {
  // The 'id' from the URL is the ID of the LESSON we're editing
  const { id: lessonId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [order, setOrder] = useState(1);
  const [courseId, setCourseId] = useState<number | null>(null); // To navigate back
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await apiClient.get<Lesson>(`/lessons/${lessonId}/`);
        const lesson = response.data;
        
        // Pre-fill the form with the fetched data
        setTitle(lesson.title);
        setContent(lesson.content);
        setOrder(lesson.order);
        setCourseId(lesson.course); // Save the parent course ID
        
      } catch (err) {
        console.error('Failed to fetch lesson data for editing:', err);
        setError('Could not load lesson data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [lessonId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use a PUT request to update the lesson
      await apiClient.put(`/lessons/${lessonId}/`, {
        title,
        content,
        order,
        course: courseId, // The API requires the course ID on update
      });
      // On success, go back to the course detail page
      navigate(`/courses/${courseId}`);
    } catch (err) {
      setError('Failed to update the lesson. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading form...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="form-container">
      <h2>Edit Lesson</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Lesson Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="order">Lesson Order</label>
          <input type="number" id="order" value={order} onChange={(e) => setOrder(Number(e.target.value))} required min="1" />
        </div>
        <div className="form-group">
          <label htmlFor="content">Lesson Content</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows={10} />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
};

export default EditLessonPage;
