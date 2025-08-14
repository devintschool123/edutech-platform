// src/components/Navbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCourseStore } from '../stores/courseStore';
import './Navbar.css';

const Navbar = () => {
  const courses = useCourseStore((state) => state.courses);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // --- DEBUGGING STEP ---
  // Let's see exactly what the 'user' object looks like when this component renders.
  console.log("User object in Navbar:", user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">EduTech</Link>
      <ul className="nav-links">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/courses" className="nav-link">Courses ({courses.length})</Link></li>

        {/* Use a more robust check here */}
        {user && user.username ? (
          // If user exists AND has a username property
          <>
            <li className="nav-welcome">Welcome, {user.username}</li>
            <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
          </>
        ) : user ? (
          // If user exists but maybe doesn't have a username yet (e.g., during login flicker)
          <>
             <li className="nav-welcome">Welcome!</li>
             <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
          </>
        ) : (
          // If user is null (logged out)
          <>
            <li><Link to="/login" className="nav-link">Login</Link></li>
            <li><Link to="/register" className="nav-link">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
