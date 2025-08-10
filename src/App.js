import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import main stylesheet
import './index.css';

// Import Layouts and Components
import Header from './components/layout/Header';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import Pages
import HomePage from './pages/HomePage';
import LoginPage from './components/auth/LoginPage';
import NoticeList from './components/notices/NoticeList';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import CategoryPage from './pages/CategoryPage'; // <-- The new page for departments/clubs
// In App.js, inside your admin-only routes
import CreateNoticePage from './pages/CreateNoticePage'; // <-- Import the new page


// Layout component that includes the header for authenticated routes
const AuthenticatedLayout = ({ children }) => (
  <>
    <Header />
    <main>
      {children}
    </main>
  </>
);

// Main App Component that contains routing logic
const AppContent = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Show a loading indicator while checking auth status
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route for login */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
      
      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/notices" element={<NoticeList />} />
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* New dynamic routes for departments and clubs */}
                <Route path="/departments/:name" element={<CategoryPage />} />
                <Route path="/clubs/:name" element={<CategoryPage />} />

                {/* Admin-only route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* New route for creating notices */}
                <Route
                  path="/admin/create-notice"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <CreateNoticePage />
                    </ProtectedRoute>
                  }
                  
                />

                {/* Catch-all for authenticated users, redirects to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

// The main App component that wraps everything with providers
// The <Router> (or <BrowserRouter>) should be in your index.js file wrapping this App component.
const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
