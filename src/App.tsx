import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { rssService } from './services/rssService';
import { DEFAULT_RSS_FEEDS } from './config/feeds';
import type { RSSItem } from './types/rss';
import './styles/App.css';

// Lazy Image Component with Intersection Observer
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className: string;
  onError: () => void;
}> = ({ src, alt, className, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters the viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    onError();
  };

  if (hasError) {
    return (
      <div className="article-image-placeholder">
        📰
      </div>
    );
  }

  return (
    <div ref={imgRef} className={className} style={{ 
      backgroundColor: isLoaded ? 'transparent' : '#f1f5f9',
      position: 'relative',
      minHeight: '200px'
    }}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      )}
      {!isLoaded && isInView && !hasError && (
        <div className="image-loading-placeholder">
          <div className="image-spinner"></div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [articles, setArticles] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching RSS feeds...');
      const items = await rssService.fetchMultipleFeeds(DEFAULT_RSS_FEEDS);
      console.log(`Successfully loaded ${items.length} articles`);
      setArticles(items);
      
      if (items.length === 0) {
        setError('No articles could be loaded from RSS feeds. This might be a temporary issue with the feed sources.');
      }
    } catch (err) {
      setError('Failed to fetch RSS feeds. Please try again later.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleRefresh = () => {
    fetchArticles();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📰 RSS News Aggregator</h1>
        <p>Stay updated with the latest news from multiple sources</p>
      </header>

      <main className="news-container">
        <button 
          className="refresh-button" 
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            Loading latest news...
          </div>
        )}

        {!loading && articles.length === 0 && !error && (
          <div className="error">
            No articles found. Please check your internet connection and try again.
          </div>
        )}

        <div className="articles-list">
          {articles.map((article, index) => (
            <article key={`${article.link}-${index}`} className="article-card">
              {article.image ? (
                <LazyImage 
                  src={article.image} 
                  alt={article.title}
                  className="article-image"
                  onError={() => {
                    // Image failed to load, this will be handled by the component
                  }}
                />
              ) : (
                <div className="article-image-placeholder">
                  📰
                </div>
              )}
              
              <div className="article-content">
                <div className="article-header">
                  <h2 className="article-title">
                    <a 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {article.title}
                    </a>
                  </h2>
                  
                  <div className="article-meta">
                    <span className="source-tag">{article.sourceName}</span>
                    <span className="article-date">
                      {formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })}
                    </span>
                    {article.author && (
                      <span className="article-author">by {article.author}</span>
                    )}
                  </div>
                </div>
                
                {article.description && (
                  <p className="article-description">
                    {article.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
