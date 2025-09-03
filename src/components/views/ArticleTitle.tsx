import type { RSSItem } from '../../types/rss';

const ArticleTitle = ({
  article,
  onArticleClick,
}: {
  article: RSSItem;
  onArticleClick: (article: RSSItem) => void;
}) => {
  return (
    <button
      className="article-title-button"
      onClick={() => onArticleClick(article)}
      title="Read in reader mode"
    >
      {article.title}
    </button>
  );
};

export { ArticleTitle };
