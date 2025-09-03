import { useState, useEffect, useMemo } from 'react';
import { DEFAULT_RSS_FEEDS } from './config/feeds';
import type { RSSItem } from './types/rss';
import './styles/App.css';
import { Menu } from './components/Menu';
import { ReaderModal } from './components/Modal/ReaderModal';
import { useUserPreferences } from './hooks/useUserPreferences';
import { getAppVersion } from './utils/version';
import { CookieNotification } from './components/CookieNotification';
import { useFetchArticles } from './services/useFetchArticles';
import { useCleanupIgnoredArticles } from './services/useCleanupArticles';
import { MainContentView } from './components/views';

const availableSources = DEFAULT_RSS_FEEDS.map((feed) => feed.name);

function App() {
  const { articles, loading, error, fetchArticles } = useFetchArticles();
  useCleanupIgnoredArticles(articles);

  // Reader modal state
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<RSSItem | null>(null);

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
  } = useUserPreferences();

  const [showSavedOnly, setShowSavedOnly] = useState(false);

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
      filtered = filtered.filter((article) =>
        selectedSources.includes(article.sourceName)
      );
    }

    // Filter by saved articles when showing saved only
    if (showSavedOnly) {
      filtered = filtered.filter((article) =>
        savedArticles.includes(article.link)
      );
    }

    // Always filter out ignored articles (unless viewing saved articles)
    if (!showSavedOnly) {
      filtered = filtered.filter(
        (article) => !ignoredArticles.includes(article.link)
      );
    }

    return filtered;
  }, [
    articles,
    selectedSources,
    showSavedOnly,
    savedArticles,
    ignoredArticles,
  ]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className="app">
      <CookieNotification />

      <header className="header">
        <button
          className="refresh-button"
          onClick={fetchArticles}
          disabled={loading}
        >
          {loading ? 'Loading...' : '🔄'}
        </button>
        {showSavedOnly ? (
          <h1 className="header-title" onClick={() => setShowSavedOnly(false)}>
            <img src="/rss-classic-32.svg" alt="RSS" className="header-icon" />{' '}
            News Aggregator{' '}
            <span className="version">beta v{getAppVersion()}</span>
            <span className="back-indicator">← Back to feeds</span>
          </h1>
        ) : (
          <h1 className="header-title">
            <img src="/rss-classic-32.svg" alt="RSS" className="header-icon" />{' '}
            News Aggregator{' '}
            <span className="version">beta v{getAppVersion()}</span>
          </h1>
        )}
        <Menu
          onFilterSources={updateSelectedSources}
          onViewSaved={() => setShowSavedOnly(!showSavedOnly)}
          availableSources={availableSources}
          selectedSources={selectedSources}
          showSavedOnly={showSavedOnly}
          ignoredArticlesCount={ignoredArticles.length}
        />
      </header>

      <main className="news-container">
        <MainContentView
          state={{
            loading,
            error,
            articles,
            filteredArticles,
            showSavedOnly,
            savedArticles,
          }}
          onArticleClick={(article) => {
            setSelectedArticle(article);
            setIsReaderModalOpen(true);
          }}
          onRetry={fetchArticles}
          isArticleSaved={isArticleSaved}
          toggleSaveArticle={toggleSaveArticle}
          isArticleIgnored={isArticleIgnored}
          toggleIgnoreArticle={toggleIgnoreArticle}
        />
      </main>

      <ReaderModal
        isOpen={isReaderModalOpen}
        onClose={() => {
          setIsReaderModalOpen(false);
          setSelectedArticle(null);
        }}
        title={selectedArticle?.title}
        url={selectedArticle?.link}
      />
    </div>
  );
}

export default App;
