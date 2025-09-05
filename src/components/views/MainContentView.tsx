import type { RSSItem } from '../../types/rss';
import { ErrorView } from './ErrorView';
import { ArticlesListView } from './ArticlesListView';

function LoadingView({
  message = 'Loading latest news...',
}: {
  message?: string;
}) {
  return (
    <div className="loading">
      <div className="spinner"></div>
      {message}
    </div>
  );
}

export interface MainContentState {
  loading: boolean;
  error: string | null;
  articles: RSSItem[];
  filteredArticles: RSSItem[];
  showSavedOnly: boolean;
  savedArticles: string[];
}

export type ViewState =
  | 'loading'
  | 'error'
  | 'no_articles'
  | 'no_filtered_articles'
  | 'no_saved_articles'
  | 'no_filtered_saved_articles'
  | 'success';

interface MainContentViewProps {
  state: MainContentState;
  onArticleClick: (article: RSSItem) => void;
  onRetry: () => void;
  isArticleSaved: (link: string) => boolean;
  toggleSaveArticle: (link: string) => void;
  isArticleIgnored: (link: string) => boolean;
  toggleIgnoreArticle: (link: string) => void;
}

function getViewState(state: MainContentState): ViewState {
  const {
    loading,
    error,
    articles,
    filteredArticles,
    showSavedOnly,
    savedArticles,
  } = state;

  if (error) return 'error';

  if (loading) return 'loading';

  if (articles.length === 0) return 'no_articles';

  if (filteredArticles.length === 0) {
    if (showSavedOnly) {
      return savedArticles.length === 0
        ? 'no_saved_articles'
        : 'no_filtered_saved_articles';
    }
    return 'no_filtered_articles';
  }

  return 'success';
}

export function MainContentView({
  state,
  onArticleClick,
  onRetry,
  isArticleSaved,
  toggleSaveArticle,
  isArticleIgnored,
  toggleIgnoreArticle,
}: MainContentViewProps) {
  const viewState = getViewState(state);

  switch (viewState) {
    case 'loading':
      return <LoadingView />;

    case 'error':
      return (
        <ErrorView
          type={'general'}
          message={state.error!}
          onRetry={onRetry}
          showRetryButton={true}
        />
      );

    case 'no_articles':
      return (
        <ErrorView
          type="no_articles"
          onRetry={onRetry}
          showRetryButton={true}
        />
      );

    case 'no_saved_articles':
      return <ErrorView type="no_saved_articles" />;

    case 'no_filtered_saved_articles':
      return <ErrorView type="no_filtered_saved_articles" />;

    case 'no_filtered_articles':
      return <ErrorView type="no_filtered_articles" />;

    case 'success':
      return (
        <ArticlesListView
          articles={state.filteredArticles}
          onArticleClick={onArticleClick}
          isArticleSaved={isArticleSaved}
          toggleSaveArticle={toggleSaveArticle}
          isArticleIgnored={isArticleIgnored}
          toggleIgnoreArticle={toggleIgnoreArticle}
        />
      );

    default: // Exhaustive check - should never reach here
    {
      const _exhaustive: never = viewState;
      return _exhaustive;
    }
  }
}
