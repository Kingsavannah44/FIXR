import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fixr_token');
    if (token) {
      api.get('/users/me')
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('fixr_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = ({ token, user }) => {
    localStorage.setItem('fixr_token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('fixr_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
