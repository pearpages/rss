import type { RSSItem } from '../../types/rss';

const ArticleTitle = ({ article }: { article: RSSItem }) => {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="article-title-button"
      title="Open original article"
    >
      {article.title}
    </a>
  );
};

export { ArticleTitle };
