// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import LoginPage from './pages/LoginPage'; // <-- Import
import RegisterPage from './pages/RegisterPage'; // <-- Import

// Import our page components
import HomePage from './pages/HomePage.tsx';
import CoursesPage from './pages/CoursesPage.tsx';

import CourseDetailPage from './pages/CourseDetailPage';

import LessonDetailPage from './pages/LessonDetailPage';

import CreateCoursePage from './pages/CreateCoursePage';

// Define the routes for the application
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App component is now the main layout shell
    children: [
      {
        index: true, // This makes HomePage the default child route for "/"
        element: <HomePage />,
      },
      {
    path: 'courses/:id', // <-- ADD THIS DYNAMIC ROUTE
    element: <CourseDetailPage />,
  },
  {
        path: 'lessons/:id', // <-- ADD THIS NEW ROUTE
        element: <LessonDetailPage />,
    },
      {
        path: 'courses',
        element: <CoursesPage />,
      },
       {
    path: 'create-course', // <-- ADD THIS ROUTE
    element: <CreateCoursePage />,
  },
      {
    path: 'login', // <-- Add Login Route
    element: <LoginPage />,
  },
  {
    path: 'register', // <-- Add Register Route
    element: <RegisterPage />,
  },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
