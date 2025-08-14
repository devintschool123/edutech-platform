// src/pages/RegisterPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Forms.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/user/register/', {
        username,
        password,
      });
      navigate('/login'); // Redirect to login page on successful registration
    } catch (err) {
      setError('Registration failed. Username may already exist.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
