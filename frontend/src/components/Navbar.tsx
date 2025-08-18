// src/components/Navbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCourseStore } from '../stores/courseStore';
import './Navbar.css';

const Navbar = () => {
  // You can keep the course count functionality
  const courses = useCourseStore((state) => state.courses); 
  // Your store uses 'logout', so we will use that
  const { user, logout } = useAuthStore(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Using the 'logout' function from your auth store
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">EduTech</Link>
      <ul className="nav-links">
        {/* These links are always visible */}
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/courses" className="nav-link">Courses ({courses.length})</Link></li>
        
        {/* --- SIMPLIFIED CONDITIONAL LOGIC --- */}
        {user ? (
          // If a user is logged in, show these links:
          <>
            <li><Link to="/dashboard" className="nav-link">My Dashboard</Link></li>
            <li className="nav-welcome">Welcome, {user.username}</li>
            <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
          </>
        ) : (
          // If no user is logged in, show these links:
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
