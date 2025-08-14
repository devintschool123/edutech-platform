// src/App.tsx

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuthStore } from './stores/authStore';
import './App.css';

function App() {
  // Get the initialize action from our store
  const initialize = useAuthStore((state) => state.initialize);

  // Use the useEffect hook to run our initialize action ONCE when the app loads
  useEffect(() => {
    initialize();
  }, [initialize]);

  // The rest of the app renders as before
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
