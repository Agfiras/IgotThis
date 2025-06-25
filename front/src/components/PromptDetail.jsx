import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error || !prompt) return <div className="text-center text-red-500 py-8">{error || 'Prompt not found'}</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="text-blue-600 dark:text-blue-300 hover:underline">← Back to all prompts</Link>
      <h1 className="text-2xl font-bold mt-4 mb-2">{prompt.title}</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        {prompt.tags.map(tag => (
          <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">{tag}</span>
        ))}
      </div>
      <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4 text-sm overflow-x-auto">{prompt.body}</pre>
      <button
        onClick={handleCopy}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </button>
    </div>
  );
}

export default PromptDetail; 