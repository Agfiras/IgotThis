import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './NewPrompt.css';

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
    <div className="new-prompt-container">
      <div className="new-prompt-card">
        <h2 className="new-prompt-title">Create New Prompt</h2>
        <form onSubmit={handleSubmit} className="new-prompt-form">
          <input
            type="text"
            className="new-prompt-input"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="new-prompt-input"
            placeholder="Prompt body"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={8}
            required
          />
          <input
            type="text"
            className="new-prompt-input"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              className="new-prompt-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Prompt'}
            </button>
            <button
              type="button"
              className="new-prompt-btn new-prompt-cancel-btn"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
        {success && <div className="new-prompt-success">Prompt created!</div>}
        {error && <div className="new-prompt-error">{error}</div>}
      </div>
    </div>
  );
}

export default NewPrompt;