// src/pages/AddLessonPage.tsx

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import './Forms.css'; // We'll reuse our form styles

const AddLessonPage = () => {
  // The 'id' from the URL is the ID of the COURSE we're adding a lesson to
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [order, setOrder] = useState(1); // Default to 1
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send the new lesson data to the /lessons/ endpoint
      await apiClient.post('/lessons/', {
        title,
        content,
        order,
        course: courseId, // Link this lesson to its parent course
      });
      // On success, go back to the course detail page
      navigate(`/courses/${courseId}`);
    } catch (err) {
      setError('Failed to create the lesson. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Lesson</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Lesson Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="order">Lesson Order</label>
          <input
            type="number"
            id="order"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Lesson Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
          />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Adding...' : 'Add Lesson'}
        </button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
};

export default AddLessonPage;
