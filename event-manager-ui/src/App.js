import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useNotification } from './hooks/useNotification';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Student Components
import StudentDashboard from './components/student/Dashboard';
import BrowseEvents from './components/student/BrowseEvents';
import EventDetails from './components/student/EventDetails';
import MyRegistrations from './components/student/MyRegistrations';
import Profile from './components/student/Profile';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import CreateEvent from './components/admin/CreateEvent';
import ManageEvents from './components/admin/ManageEvents';
import ManageUsers from './components/admin/ManageUsers';
import EventRegistrations from './components/admin/ViewRegistrations';

import './styles/variables.css';
import './styles/responsive.css';
import './App.css';

function AppLayout({ children, isAdmin, currentPage, onLogout, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Navbar
        user={user}
        onLogout={onLogout}
        isAdmin={isAdmin}
      />
      <div className="app-container">
        <Sidebar
          isAdmin={isAdmin}
          active={currentPage}
          isMobile={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const { notifications, removeNotification } = useNotification();
  const [currentPage, setCurrentPage] = useState('');

  const handleLogout = () => {
    logout();
  };

  return (
    <BrowserRouter>
      <ToastContainer
        notifications={notifications}
        onClose={removeNotification}
      />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout
                user={user}
                isAdmin={false}
                currentPage="/dashboard"
                onLogout={handleLogout}
              >
                <StudentDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <AppLayout
                user={user}
                isAdmin={false}
                currentPage="/events"
                onLogout={handleLogout}
              >
                <BrowseEvents />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:eventId"
          element={
            <ProtectedRoute>
              <AppLayout
                user={user}
                isAdmin={false}
                currentPage="/events"
                onLogout={handleLogout}
              >
                <EventDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-registrations"
          element={
            <ProtectedRoute>
              <AppLayout
                user={user}
                isAdmin={false}
                currentPage="/my-registrations"
                onLogout={handleLogout}
              >
                <MyRegistrations />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout
                user={user}
                isAdmin={false}
                currentPage="/profile"
                onLogout={handleLogout}
              >
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AppLayout
                user={user}
                isAdmin={true}
                currentPage="/admin/dashboard"
                onLogout={handleLogout}
              >
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/create"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AppLayout
                user={user}
                isAdmin={true}
                currentPage="/admin/events"
                onLogout={handleLogout}
              >
                <CreateEvent />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AppLayout
                user={user}
                isAdmin={true}
                currentPage="/admin/events"
                onLogout={handleLogout}
              >
                <ManageEvents />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/:eventId/registrations"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AppLayout
                user={user}
                isAdmin={true}
                currentPage="/admin/registrations"
                onLogout={handleLogout}
              >
                <EventRegistrations />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AppLayout
                user={user}
                isAdmin={true}
                currentPage="/admin/users"
                onLogout={handleLogout}
              >
                <ManageUsers />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Default and Error Routes */}
        <Route path="/" element={<Navigate to={isAuthenticated ? (user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard') : '/login'} />} />
        <Route path="/unauthorized" element={<Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
