import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const PrivateRoute = ({ children, roles = null }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !AuthService.hasAnyRole(roles)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
