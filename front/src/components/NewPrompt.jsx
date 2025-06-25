import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function NewPrompt() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          body,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 1000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create prompt');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Prompt</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-700"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-700"
          placeholder="Prompt body"
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={6}
          required
        />
        <input
          type="text"
          className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-700"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Prompt'}
        </button>
      </form>
      {success && <div className="text-green-600 text-center mt-4">Prompt created!</div>}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
}

export default NewPrompt; 