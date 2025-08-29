import { useState, useEffect, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { rssService } from "./services/rssService";
import { DEFAULT_RSS_FEEDS } from "./config/feeds";
import type { RSSItem } from "./types/rss";
import "./styles/App.css";
import { LazyImage } from "./components/LazyImage";
import { Menu } from "./components/Menu";

function App() {
  const [articles, setArticles] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    // Get unique source names from feeds
  const availableSources = useMemo(() => {
    return DEFAULT_RSS_FEEDS.map(feed => feed.name);
  }, []);
  const [selectedSources, setSelectedSources] = useState<string[]>(availableSources);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Filter articles based on selected sources
  const filteredArticles = useMemo(() => {
    let filtered = articles;
    
    // Filter by selected sources (if any are selected)
    if (selectedSources.length > 0) {
      filtered = filtered.filter(article => 
        selectedSources.includes(article.sourceName)
      );
    }
    
    // TODO: Filter by saved articles when we implement saved functionality
    if (showSavedOnly) {
      // For now, just return empty array as we haven't implemented saved articles yet
      filtered = [];
    }
    
    return filtered;
  }, [articles, selectedSources, showSavedOnly]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching RSS feeds...");
      const items = await rssService.fetchMultipleFeeds(DEFAULT_RSS_FEEDS);
      console.log(`Successfully loaded ${items.length} articles`);
      setArticles(items);

      if (items.length === 0) {
        setError(
          "No articles could be loaded from RSS feeds. This might be a temporary issue with the feed sources."
        );
      }
    } catch (err) {
      setError("Failed to fetch RSS feeds. Please try again later.");
      console.error("Error fetching articles:", err);
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

  const handleFilterSources = (sources: string[]) => {
    setSelectedSources(sources);
  };

  const handleViewSaved = () => {
    setShowSavedOnly(!showSavedOnly);
  };

  return (
    <div className="app">
      <header className="header">
        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "Loading..." : "🔄"}
        </button>
        <h1>📰 RSS News Aggregator</h1>
        <Menu
          onFilterSources={handleFilterSources}
          onViewSaved={handleViewSaved}
          availableSources={availableSources}
          selectedSources={selectedSources}
        />
      </header>

      <main className="news-container">

        {error && <div className="error">{error}</div>}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            Loading latest news...
          </div>
        )}

        {!loading && articles.length === 0 && !error && (
          <div className="error">
            No articles found. Please check your internet connection and try
            again.
          </div>
        )}

        {!loading && filteredArticles.length === 0 && articles.length > 0 && (
          <div className="error">
            No articles match your current filters.
          </div>
        )}

        <div className="articles-list">
          {filteredArticles.map((article, index) => (
            <article key={`${article.link}-${index}`} className="article-card">
              {article.image && (
                <LazyImage
                  src={article.image}
                  alt={article.title}
                  className="article-image"
                  onError={() => {
                    // Image failed to load, this will be handled by the component
                  }}
                />
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
                      {formatDistanceToNow(new Date(article.pubDate), {
                        addSuffix: true,
                      })}
                    </span>
                    {article.author && (
                      <span className="article-author">
                        by {article.author}
                      </span>
                    )}
                  </div>
                </div>

                {article.description && (
                  <p className="article-description">{article.description}</p>
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
