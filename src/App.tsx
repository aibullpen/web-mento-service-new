import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

import ApprovalPending from './pages/ApprovalPending';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, userStatus } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userStatus === 'pending' || userStatus === 'rejected') {
    return <Navigate to="/pending" />;
  }

  if (userStatus === 'approved') {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }

  // Fallback (shouldn't happen if logic is correct)
  return <div className="min-h-screen flex items-center justify-center">Checking authorization...</div>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/pending" element={<ApprovalPending />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
