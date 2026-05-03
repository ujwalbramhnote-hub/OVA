import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LiveResults from './pages/LiveResults';
import CandidateDashboard from './pages/CandidateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuditLog from './pages/AuditLog';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const normalizeRole = (role) => {
  switch (role) {
    case 'ROLE_ADMIN':
    case 'ADMIN':
      return 'ADMIN';
    case 'ROLE_CANDIDATE':
    case 'CANDIDATE':
      return 'CANDIDATE';
    case 'ROLE_USER':
    case 'ROLE_VOTER':
    case 'VOTER':
    default:
      return 'VOTER';
  }
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  switch (normalizeRole(user?.role)) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'CANDIDATE':
      return <Navigate to="/candidate/dashboard" replace />;
    case 'VOTER':
    default:
      return <Navigate to="/voter/dashboard" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<MainLayout />}>
              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'VOTER', 'CANDIDATE']} />}>
                <Route path="/dashboard" element={<DashboardRedirect />} />
                <Route path="/results" element={<LiveResults />} />
                <Route path="/audit-log" element={<AuditLog />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['VOTER']} />}>
                <Route path="/voter/dashboard" element={<Dashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
                <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
