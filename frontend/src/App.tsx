// src/App.tsx

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuthStore } from './stores/authStore';
import { useEnrollmentStore } from './stores/enrollmentStore';

function App() {
  const user = useAuthStore((state) => state.user);
  const fetchEnrollments = useEnrollmentStore((state) => state.fetchEnrollments);

  // This is now the ONLY effect needed for this logic.
  // It will run when `user` changes (i.e., on login/logout).
  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user, fetchEnrollments]);

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
