import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('jwt') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt', token);
      // Optionally decode user info from JWT here
      setUser({}); // Placeholder, you may decode JWT for user info
    } else {
      localStorage.removeItem('jwt');
      setUser(null);
    }
  }, [token]);

  const login = (jwt) => setToken(jwt);
  const logout = () => setToken('');

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider; 