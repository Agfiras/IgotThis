import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PromptDetail.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function PromptDetail() {
  const { id } = useParams();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/prompts/${id}`)
      .then(res => res.json())
      .then(data => {
        setPrompt(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load prompt');
        setLoading(false);
      });
  }, [id]);

  const handleCopy = () => {
    if (prompt?.body) {
      navigator.clipboard.writeText(prompt.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (loading) return <div className="prompt-detail-loading">Loading...</div>;
  if (error || !prompt) return <div className="prompt-detail-error">{error || 'Prompt not found'}</div>;

  return (
    <div className="prompt-detail-container">
      <div className="prompt-detail-card">
        <Link to="/" className="prompt-detail-back">← Back to all prompts</Link>
        <h1 className="prompt-detail-title">{prompt.title}</h1>
        <div className="prompt-detail-tags">
          {prompt.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <pre className="prompt-detail-body">{prompt.body}</pre>
        <button
          onClick={handleCopy}
          className="prompt-detail-copy"
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
    </div>
  );
}

export default PromptDetail;