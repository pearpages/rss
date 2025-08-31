import { useState, useEffect, useMemo, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { rssService } from "./services/rssService";
import { DEFAULT_RSS_FEEDS } from "./config/feeds";
import type { RSSItem } from "./types/rss";
import "./styles/App.css";
import { LazyImage } from "./components/LazyImage";
import { Menu } from "./components/Menu";
import { useUserPreferences } from "./hooks/useUserPreferences";
import { getSourceColor, isLightColor } from "./utils/colorUtils";
import { getAppVersion } from "./utils/version";

function App() {
  const [articles, setArticles] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the preferences hook
  const {
    selectedSources,
    updateSelectedSources,
    savedArticles,
    isArticleSaved,
    toggleSaveArticle,
    ignoredArticles,
    isArticleIgnored,
    toggleIgnoreArticle,
    cleanupIgnoredArticles,
    cookiesEnabled
  } = useUserPreferences();
  
  // Get unique source names from feeds
  const availableSources = useMemo(() => {
    return DEFAULT_RSS_FEEDS.map(feed => feed.name);
  }, []);
  
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching RSS feeds...");
      const items = await rssService.fetchMultipleFeeds(DEFAULT_RSS_FEEDS);
      console.log(`Successfully loaded ${items.length} articles`);
      setArticles(items);

      // Clean up ignored articles to remove old ones that are no longer in the feed
      const currentArticleLinks = items.map(item => item.link);
      cleanupIgnoredArticles(currentArticleLinks);

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
  }, [cleanupIgnoredArticles]);

  // Initialize selected sources if none are set (first time users)
  useEffect(() => {
    if (selectedSources.length === 0) {
      updateSelectedSources(availableSources);
    }
  }, [availableSources, selectedSources.length, updateSelectedSources]);

  // Filter articles based on selected sources and saved articles
  const filteredArticles = useMemo(() => {
    let filtered = articles;
    
    // Filter by selected sources (if any are selected)
    if (selectedSources.length > 0) {
      filtered = filtered.filter(article => 
        selectedSources.includes(article.sourceName)
      );
    }
    
    // Filter by saved articles when showing saved only
    if (showSavedOnly) {
      filtered = filtered.filter(article => 
        savedArticles.includes(article.link)
      );
    }
    
    // Always filter out ignored articles (unless viewing saved articles)
    if (!showSavedOnly) {
      filtered = filtered.filter(article => 
        !ignoredArticles.includes(article.link)
      );
    }
    
    return filtered;
  }, [articles, selectedSources, showSavedOnly, savedArticles, ignoredArticles]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleRefresh = () => {
    fetchArticles();
  };

  const handleFilterSources = (sources: string[]) => {
    updateSelectedSources(sources);
  };

  const handleViewSaved = () => {
    setShowSavedOnly(!showSavedOnly);
  };

  const handleGoToFeeds = () => {
    setShowSavedOnly(false);
  };

  return (
    <div className="app">
      {/* Storage notification for users with limited storage */}
      {!cookiesEnabled && (
        <div className="cookie-notification">
          <p>
            🍪 This app uses cookies and browser storage to save your preferences. 
            Please enable cookies for the best experience.
          </p>
        </div>
      )}
      
      <header className="header">
        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "Loading..." : "🔄"}
        </button>
        {showSavedOnly ? (
          <h1 className="header-title" onClick={handleGoToFeeds}>
            <img src="/rss-classic-32.svg" alt="RSS" className="header-icon" /> News Aggregator <span className="version">beta v{getAppVersion()}</span>
            <span className="back-indicator">← Back to feeds</span>
          </h1>
        ) : (
          <h1 className="header-title"><img src="/rss-classic-32.svg" alt="RSS" className="header-icon" /> News Aggregator <span className="version">beta v{getAppVersion()}</span></h1>
        )}
        <Menu
          onFilterSources={handleFilterSources}
          onViewSaved={handleViewSaved}
          availableSources={availableSources}
          selectedSources={selectedSources}
          showSavedOnly={showSavedOnly}
          ignoredArticlesCount={ignoredArticles.length}
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

        {!loading && filteredArticles.length === 0 && articles.length > 0 && !showSavedOnly && (
          <div className="error">
            No articles match your current source filters.
          </div>
        )}
        
        {!loading && showSavedOnly && savedArticles.length === 0 && (
          <div className="error">
            No saved articles yet. Start saving articles you want to read later!
          </div>
        )}

        {!loading && showSavedOnly && filteredArticles.length === 0 && savedArticles.length > 0 && (
          <div className="error">
            No saved articles match your current source filters.
          </div>
        )}

        <div className="articles-list">
          {filteredArticles.map((article, index) => {
            const sourceColor = getSourceColor(article.sourceName);
            
            return (
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
                      <span 
                        className="source-tag"
                        style={{
                          backgroundColor: sourceColor,
                          color: isLightColor(sourceColor) ? '#1e293b' : 'white'
                        }}
                      >
                        {article.sourceName}
                      </span>
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
                      <button
                        className={`save-button ${isArticleSaved(article.link) ? 'saved' : ''}`}
                        onClick={() => toggleSaveArticle(article.link)}
                        title={isArticleSaved(article.link) ? 'Remove from saved' : 'Save article'}
                      >
                        {isArticleSaved(article.link) ? '⭐' : '☆'}
                      </button>
                      <button
                        className={`ignore-button ${isArticleIgnored(article.link) ? 'ignored' : ''}`}
                        onClick={() => toggleIgnoreArticle(article.link)}
                        title={isArticleIgnored(article.link) ? 'Show article' : 'Hide article (mark as read)'}
                      >
                        {isArticleIgnored(article.link) ? '👁️' : '🙈'}
                      </button>
                    </div>
                  </div>

                  {article.description && (
                    <p className="article-description">{article.description}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
