// src/pages/EditCoursePage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuthStore } from '../stores/authStore';
import './Forms.css'; // We can reuse our form styles

const EditCoursePage = () => {
  const { id } = useParams<{ id: string }>(); // Get course ID from URL
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await apiClient.get(`/courses/${id}/`);
        const course = response.data;
        
        // Security check: If the logged-in user is not the owner, redirect them.
        if (user?.username !== course.owner) {
          navigate(`/courses/${id}`); // Redirect to the detail page
          return;
        }

        // Pre-fill the form with the fetched data
        setTitle(course.title);
        setDescription(course.description);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch course data for editing:', err);
        setError('Could not load course data.');
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use a PUT request to update the entire course object
      await apiClient.put(`/courses/${id}/`, {
        title,
        description,
      });
      // On success, navigate back to the course detail page
      navigate(`/courses/${id}`);
    } catch (err) {
      setError('Failed to update the course. Please try again.');
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
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Course Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Course Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={6}
          />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
};

export default EditCoursePage;
