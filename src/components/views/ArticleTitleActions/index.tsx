import type { RSSItem } from '../../../types/rss';
import './index.css';

const ArticleTitleActions = ({
  openModal,
  article,
}: {
  article: RSSItem;
  openModal: () => void;
}) => {
  const hasNativeShare =
    typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <>
      {hasNativeShare && (
        <button
          className="action-button"
          onClick={async () => {
            try {
              await navigator.share({
                title: article.title,
                url: article.link,
              });
            } catch (error) {
              console.error('Failed to share:', error);
            }
          }}
          title="Share article"
        >
          📤
        </button>
      )}
      <button
        className="action-button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(article.link);
            // Simple feedback - could be enhanced with a toast notification
            const button = document.activeElement as HTMLElement;
            if (button) {
              const originalTitle = button.title;
              button.title = 'Link copied!';
              setTimeout(() => {
                button.title = originalTitle;
              }, 2000);
            }
          } catch (error) {
            console.error('Failed to copy URL:', error);
          }
        }}
        title="Copy link"
      >
        🔗
      </button>
      <button
        className="action-button"
        onClick={openModal}
        title="Open article"
      >
        📰
      </button>
    </>
  );
};

export { ArticleTitleActions };
