import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/storage';

export default function ProtectedRoute({ children, role }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'} replace />;
  }
  return children;
}
