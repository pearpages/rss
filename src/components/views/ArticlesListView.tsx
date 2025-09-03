import { formatDistanceToNow } from 'date-fns';
import type { RSSItem } from '../../types/rss';
import { LazyImage } from '../LazyImage';
import { getSourceColor, isLightColor } from '../../utils/colorUtils';

interface ArticlesListViewProps {
  articles: RSSItem[];
  onArticleClick: (article: RSSItem) => void;
  isArticleSaved: (link: string) => boolean;
  toggleSaveArticle: (link: string) => void;
  isArticleIgnored: (link: string) => boolean;
  toggleIgnoreArticle: (link: string) => void;
}

export function ArticlesListView({
  articles,
  onArticleClick,
  isArticleSaved,
  toggleSaveArticle,
  isArticleIgnored,
  toggleIgnoreArticle,
}: ArticlesListViewProps) {
  return (
    <div className="articles-list">
      {articles.map((article, index) => {
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
                  <button
                    className="article-title-button"
                    onClick={() => onArticleClick(article)}
                    title="Read in reader mode"
                  >
                    {article.title}
                  </button>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link-icon"
                    title="Open original article"
                  >
                    🔗
                  </a>
                </h2>

                <div className="article-meta">
                  <span
                    className="source-tag"
                    style={{
                      backgroundColor: sourceColor,
                      color: isLightColor(sourceColor) ? '#1e293b' : 'white',
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
                    <span className="article-author">by {article.author}</span>
                  )}
                  <button
                    className={`save-button ${isArticleSaved(article.link) ? 'saved' : ''}`}
                    onClick={() => toggleSaveArticle(article.link)}
                    title={
                      isArticleSaved(article.link)
                        ? 'Remove from saved'
                        : 'Save article'
                    }
                  >
                    {isArticleSaved(article.link) ? '⭐' : '☆'}
                  </button>
                  <button
                    className={`ignore-button ${isArticleIgnored(article.link) ? 'ignored' : ''}`}
                    onClick={() => toggleIgnoreArticle(article.link)}
                    title={
                      isArticleIgnored(article.link)
                        ? 'Show article'
                        : 'Hide article (mark as read)'
                    }
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
  );
}
