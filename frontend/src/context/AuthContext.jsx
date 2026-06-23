const API_BASE = import.meta.env.VITE_API_URL || '';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('pm_token'));
  const [loading, setLoading] = useState(true);

  // Verify token on mount / tab focus
  const verifyToken = useCallback(async (t) => {
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setUser(data.user);
        } else {
          throw new Error("Invalid response");
        }
      } else {
        // Token invalid or expired
        localStorage.removeItem('pm_token');
        setToken(null);
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyToken(token);
  }, [token, verifyToken]);

  const login = async (email, password, remember = false) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Cannot connect to server. Ensure the backend is running.");
      }

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please try again.');
      }

      const { token: newToken, user: newUser } = data;
      localStorage.setItem('pm_token', newToken);
      setToken(newToken);
      setUser(newUser);
      return newUser;
    } catch (err) {
      throw err;
    }
  };

  const register = async ({ name, email, phone, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Cannot connect to server. Ensure the backend is running.");
      }

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      const { token: newToken, user: newUser } = data;
      localStorage.setItem('pm_token', newToken);
      setToken(newToken);
      setUser(newUser);
      return newUser;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('pm_token');
    setToken(null);
    setUser(null);
  };

  // Authenticated fetch helper
  const authFetch = useCallback(async (url, options = {}) => {
    const t = localStorage.getItem('pm_token');
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(!(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
    });
    return res;
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
