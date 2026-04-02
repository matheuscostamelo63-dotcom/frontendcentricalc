import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Wraps any route that requires authentication.
 * If not logged in, redirects to /login with a redirect param so the user
 * comes back to the original destination after logging in.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show nothing while checking auth — prevents flash of redirect
    return null;
  }

  if (!session) {
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  return <>{children}</>;
}
