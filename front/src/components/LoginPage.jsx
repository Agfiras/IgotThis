import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

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

  const handleMagicLink = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMagicSent(true);
      } else {
        setError(data.error || 'Failed to send magic link');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleSocial = (provider) => {
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-700"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {mode === 'register' && (
          <input
            type="password"
            className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-700"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        )}
        {mode === 'login' && (
          <input
            type="password"
            className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-700"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        )}
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <button
          className="text-sm text-blue-600 dark:text-blue-300 hover:underline"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
      <div className="mt-4 text-center">
        <button
          className="text-sm text-blue-600 dark:text-blue-300 hover:underline"
          onClick={handleMagicLink}
          disabled={loading || !email}
        >
          {magicSent ? 'Magic link sent!' : 'Send magic link'}
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <button
          className="w-full py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => handleSocial('github')}
        >
          Continue with GitHub
        </button>
        <button
          className="w-full py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => handleSocial('google')}
        >
          Continue with Google
        </button>
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
}

export default LoginPage; 