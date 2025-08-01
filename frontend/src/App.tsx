import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserDashboard from './pages/user/Dashboard';
import UserBookingFlow from './pages/user/BookingFlow';
import UserBookingHistory from './pages/user/BookingHistory';
import UserReleasedRooms from './pages/user/ReleasedRooms';
import UserBookingDetails from './pages/user/BookingDetails';
import AdminDashboard from './pages/admin/Dashboard';
import AdminFacilityManager from './pages/admin/FacilityManager';
import AdminBlockingTool from './pages/admin/BlockingTool';
import AdminUserCreditManager from './pages/admin/UserCreditManager';
import AdminBookingMonitor from './pages/admin/BookingMonitor';
import ProtectedRoute from './components/ProtectedRoute';
export function App() {
  const [user, setUser] = useState(null);
  // Simulated login function
  const handleLogin = userData => {
    setUser(userData);
  };
  // Simulated logout function
  const handleLogout = () => {
    setUser(null);
  };
  return <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {/* User Routes */}
          <Route path="/user/dashboard" element={<ProtectedRoute user={user} userRole="user">
                <UserDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>} />
          <Route path="/user/booking" element={<ProtectedRoute user={user} userRole="user">
                <UserBookingFlow user={user} onLogout={handleLogout} />
              </ProtectedRoute>} />
          <Route path="/user/history" element={<ProtectedRoute user={user} userRole="user">
                <UserBookingHistory user={user} onLogout={handleLogout} />
              </ProtectedRoute>} />
          <Route path="/user/released-rooms" element={<ProtectedRoute user={user} userRole="user">
                <UserReleasedRooms user={user} onLogout={handleLogout} />
              </ProtectedRoute>} />
          <Route path="/user/booking-details/:bookingId" element={<ProtectedRoute user={user} userRole="user">
                <UserBookingDetails user={user} onLogout={handleLogout} />
              </ProtectedRoute>} />
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute user={user} userRole="admin">
                <AdminDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>} />
          <Route path="/admin/facilities" element={<ProtectedRoute user={user} userRole="admin">
                <AdminFacilityManager user={user} onLogout={handleLogout} />
              </ProtectedRoute>} />
          <Route path="/admin/blocking" element={<ProtectedRoute user={user} userRole="admin">
                <AdminBlockingTool user={user} onLogout={handleLogout} />
              </ProtectedRoute>} />
          <Route path="/admin/credits" element={<ProtectedRoute user={user} userRole="admin">
                <AdminUserCreditManager user={user} onLogout={handleLogout} />
              </ProtectedRoute>} />
          <Route path="/admin/monitor" element={<ProtectedRoute user={user} userRole="admin">
                <AdminBookingMonitor user={user} onLogout={handleLogout} />
              </ProtectedRoute>} />
          {/* Default routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>;
}