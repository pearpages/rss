import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { rssService } from './services/rssService';
import { DEFAULT_RSS_FEEDS } from './config/feeds';
import type { RSSItem } from './types/rss';
import './styles/App.css';

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
