import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './components/AuthContext';
import LoginPage from './components/LoginPage';
import PromptList from './components/PromptList';
import PromptDetail from './components/PromptDetail';
import NewPrompt from './components/NewPrompt';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function Header() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="flex items-center justify-between px-4 py-3 shadow bg-white dark:bg-gray-800">
      <Link to="/" className="text-xl font-bold">Prompt Library</Link>
      <div className="flex items-center gap-2">
        {token && (
          <>
            <Link
              to="/new"
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              New Prompt
            </Link>
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
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
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);
  return (
    <button
      className="ml-2 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Header />
          <main className="max-w-5xl mx-auto p-4">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
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
