import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route that requires authentication.
 * Unauthenticated users are redirected to /login with:
 *  - returnTo: the original path they tried to access
 *  - message: a friendly explanation
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        color: 'var(--color-on-surface-variant)',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-primary-container)', animation: 'spin 1s linear infinite' }}>
          progress_activity
        </span>
        <p className="text-body-md">Verifying session…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          returnTo: location.pathname,
          message: 'Please log in to book a session with Pixel Memories.',
        }}
        replace
      />
    );
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
