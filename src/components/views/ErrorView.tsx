type ErrorType =
  | 'network'
  | 'no_articles'
  | 'no_filtered_articles'
  | 'no_saved_articles'
  | 'no_filtered_saved_articles'
  | 'general';

interface ErrorViewProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

const ERROR_MESSAGES: Record<ErrorType, string> = {
  network:
    'No articles found. Please check your internet connection and try again.',
  no_articles:
    'No articles found. Please check your internet connection and try again.',
  no_filtered_articles: 'No articles match your current source filters.',
  no_saved_articles:
    'No saved articles yet. Start saving articles you want to read later!',
  no_filtered_saved_articles:
    'No saved articles match your current source filters.',
  general: 'An error occurred while loading articles.',
};

function ErrorView({
  type,
  message,
  onRetry,
  showRetryButton = false,
}: ErrorViewProps) {
  const errorMessage = message || ERROR_MESSAGES[type];

  return (
    <div className="error">
      {errorMessage}
      {showRetryButton && onRetry && (
        <button
          className="retry-button"
          onClick={onRetry}
          style={{ marginLeft: '10px' }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export { ErrorView, type ErrorType };
