import { formatDistanceToNow } from 'date-fns';
import type { RSSItem } from '../../types/rss';
import { ArticleLayout } from '../ArticleLayout';
import { getSourceColor, isLightColor } from '../../utils/colorUtils';
import { ArticleTitle } from './ArticleTitle';
import { ArticleImage } from './ArticleImage';
import { ArticleTitleActions } from './ArticleTitleActions';

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
          <ArticleLayout
            key={`${article.link}-${index}`}
            article={article}
            index={index}
          >
            {{
              image: <ArticleImage article={article} />,

              title: <ArticleTitle article={article} />,

              titleActions: (
                <ArticleTitleActions
                  article={article}
                  openModal={() => onArticleClick(article)}
                />
              ),

              meta: (
                <>
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
                </>
              ),

              actions: (
                <>
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
                </>
              ),

              description: article.description && (
                <p className="article-description">{article.description}</p>
              ),
            }}
          </ArticleLayout>
        );
      })}
    </div>
  );
}
