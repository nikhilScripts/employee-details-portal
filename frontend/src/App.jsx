import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeProfile from './pages/EmployeeProfile';
import EmployeeForm from './pages/EmployeeForm';

// Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/user" replace />;
  }

  return children;
}

// Main App Routes
function AppRoutes() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* User Dashboard */}
      <Route path="/user" element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      } />
      
      {/* Admin Dashboard */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      {/* Employee Management (accessible to both admin and users) */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/employees" element={
        <ProtectedRoute>
          <EmployeeList />
        </ProtectedRoute>
      } />
      <Route path="/employees/new" element={
        <ProtectedRoute requireAdmin>
          <EmployeeForm />
        </ProtectedRoute>
      } />
      <Route path="/employees/:id" element={
        <ProtectedRoute>
          <EmployeeProfile />
        </ProtectedRoute>
      } />
      <Route path="/employees/:id/edit" element={
        <ProtectedRoute requireAdmin>
          <EmployeeForm />
        </ProtectedRoute>
      } />
      
      {/* Default redirect based on role */}
      <Route path="*" element={
        isAuthenticated 
          ? <Navigate to={isAdmin ? "/admin" : "/user"} replace />
          : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;