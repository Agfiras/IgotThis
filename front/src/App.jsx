import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './components/AuthContext';
import LoginPage from './components/LoginPage';
import PromptList from './components/PromptList';
import PromptDetail from './components/PromptDetail';
import NewPrompt from './components/NewPrompt';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './AppLayout.css';

function Header() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="app-header">
      <Link to="/" className="app-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/logo.png" alt="Logo" style={{ height: '36px', width: '36px', objectFit: 'contain', marginRight: '6px' }} />
        LLMrest
      </Link>
      <div className="app-header-actions">
        {token && (
          <>
            <Link
              to="/new"
              className="app-header-btn"
            >
              New Prompt
            </Link>
            <button
              className="app-header-btn app-header-btn-secondary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

function DarkModeToggle() {
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [dark]);
  return (
    <button
      className="app-header-btn app-header-btn-secondary"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="app-main">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<PromptList />} />
                <Route path="/prompt/:id" element={<PromptDetail />} />
                <Route path="/new" element={<NewPrompt />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;