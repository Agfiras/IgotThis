import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PromptList.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

  // Reset list on mount to avoid duplicates after navigation
  useEffect(() => {
    setPrompts([]);
    setPage(1);
    setHasMore(true);
    setError('');
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
          setPrompts(prev => {
            const ids = new Set(prev.map(p => p._id));
            return [...prev, ...data.filter(p => !ids.has(p._id))];
          });
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
    <div className="prompt-list">
      <div className="tag-bar">
        <button
          className={`tag-btn${!selectedTag ? ' tag-btn-active' : ''}`}
          onClick={() => setSelectedTag('')}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            className={`tag-btn${selectedTag === tag ? ' tag-btn-active' : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="prompt-grid">
        {prompts.map(prompt => (
          <Link
            to={`/prompt/${prompt._id}`}
            key={prompt._id}
            className="prompt-card"
          >
            <h2 className="prompt-title">{prompt.title}</h2>
            <div className="prompt-tags">
              {prompt.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <p className="prompt-body">{prompt.body.length > 180 ? prompt.body.slice(0, 180) + '...' : prompt.body}</p>
          </Link>
        ))}
      </div>
      {loading && <div className="prompt-loading">Loading...</div>}
      {error && <div className="prompt-error">{error}</div>}
      {!hasMore && <div className="prompt-end">No more prompts.</div>}
    </div>
  );
}

export default PromptList;
