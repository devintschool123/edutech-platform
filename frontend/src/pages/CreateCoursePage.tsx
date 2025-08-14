// src/pages/CreateCoursePage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import './Forms.css'; // We can reuse our existing form styles

const CreateCoursePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send the new course data to our protected /courses/ endpoint
      await apiClient.post('/courses/', {
        title,
        description,
      });
      // On success, redirect the user to the main courses page
      navigate('/courses');
    } catch (err) {
      setError('Failed to create the course. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create a New Course</h2>
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
            rows={5}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px' }}
          />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Course'}
        </button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
};

export default CreateCoursePage;
