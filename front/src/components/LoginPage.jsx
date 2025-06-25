import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './LoginPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Google OAuth token in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      login(token);
      navigate('/');
    }
  }, [location, login, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token);
        navigate('/');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="login-links">
          <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
        <button
          type="button"
          onClick={handleGoogle}
          className="google-btn"
          style={{ marginTop: 24 }}
        >
          <span style={{ marginRight: 8, fontSize: 20 }}>🔵</span>
          Sign in with Google
        </button>
        {error && <div className="login-error">{error}</div>}
      </div>
    </div>
  );
}

export default LoginPage;