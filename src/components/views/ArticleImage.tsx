import type { RSSItem } from '../../types/rss';
import { LazyImage } from '../LazyImage';

const ArticleImage = ({ article }: { article: RSSItem }) => {
  return (
    article.image && (
      <LazyImage
        src={article.image}
        alt={article.title}
        className="article-image"
        onError={() => {
          // Image failed to load, this will be handled by the component
        }}
      />
    )
  );
};

export { ArticleImage };
