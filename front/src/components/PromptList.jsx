import { useEffect, useState, useRef } from 'react';
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
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debounceRef = useRef();

  useEffect(() => {
    fetch(`${API_URL}/tags`)
      .then(res => res.json())
      .then(setTags)
      .catch(() => setTags([]));
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTag(prev => (prev.toLowerCase() === tag.toLowerCase() ? '' : tag));
    setPrompts([]);
    setPage(1);
    setHasMore(true);
    setError('');
  };

  // Debounced search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput.trim());
      setPrompts([]);
      setPage(1);
      setHasMore(true);
      setError('');
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchInput('');
    setPrompts([]);
    setPage(1);
    setHasMore(true);
    setError('');
  };

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
    if (selectedTag && selectedTag.trim() !== '') {
      url += `&tag=${encodeURIComponent(selectedTag.toLowerCase())}`;
    }
    if (search && search.trim() !== '') {
      url += `&search=${encodeURIComponent(search)}`;
    }
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
  }, [page, selectedTag, search]);

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
      <div className="prompt-search-bar search-bar-left">
        <input
          type="text"
          className="prompt-search-input"
          placeholder="Search by title or tag..."
          value={searchInput}
          onChange={handleSearchInput}
        />
        {search && (
          <button type="button" onClick={handleClearSearch} className="prompt-search-clear" aria-label="Clear search">
            ×
          </button>
        )}
        <button type="button" className="prompt-search-icon-btn" tabIndex={-1} aria-label="Search" disabled>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
            <line x1="14.4142" y1="14" x2="18" y2="17.5858" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="tag-bar">
        {tags.map(tag => (
          <button
            key={tag}
            className={`tag-btn${selectedTag.toLowerCase() === tag.toLowerCase() && selectedTag ? ' tag-btn-active' : ''}`}
            onClick={() => handleTagClick(tag)}
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
