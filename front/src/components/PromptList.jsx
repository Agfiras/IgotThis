import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Note: To use 'line-clamp-3', enable the Tailwind line-clamp plugin in tailwind.config.js if not already.
// import 'tailwindcss/line-clamp';

function PromptList() {
  const [prompts, setPrompts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/tags`)
      .then(res => res.json())
      .then(setTags)
      .catch(() => setTags([]));
  }, []);

  useEffect(() => {
    setPrompts([]);
    setPage(1);
    setHasMore(true);
  }, [selectedTag]);

  useEffect(() => {
    if (!hasMore || loading) return;
    setLoading(true);
    let url = `${API_URL}/prompts?page=${page}&limit=10`;
    if (selectedTag) url += `&tag=${encodeURIComponent(selectedTag)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPrompts(prev => [...prev, ...data]);
          setHasMore(data.length === 10);
        } else {
          setError('Failed to load prompts');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load prompts');
        setLoading(false);
      });
  }, [page, selectedTag]);

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        hasMore && !loading
      ) {
        setPage(p => p + 1);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasMore, loading]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${!selectedTag ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setSelectedTag('')}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            className={`px-3 py-1 rounded ${selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {prompts.map(prompt => (
          <Link
            to={`/prompt/${prompt._id}`}
            key={prompt._id}
            className="block p-4 rounded shadow bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <h2 className="font-semibold text-lg mb-2 truncate">{prompt.title}</h2>
            <div className="flex flex-wrap gap-1 mb-2">
              {prompt.tags.map(tag => (
                <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">{tag}</span>
              ))}
            </div>
            <p className="text-sm line-clamp-3">{prompt.body}</p>
          </Link>
        ))}
      </div>
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-center text-red-500 py-4">{error}</div>}
      {!hasMore && <div className="text-center py-4 text-gray-400">No more prompts.</div>}
    </div>
  );
}

export default PromptList; 