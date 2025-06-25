import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Reset failed.');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Reset Password</h2>
          <div className="login-error">Invalid or missing token.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Reset Password</h2>
        {success ? (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            Password has been reset.<br />
            <button className="login-card-btn" style={{ marginTop: 18 }} onClick={() => navigate('/login')}>Back to Login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            {error && <div className="login-error">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword; 