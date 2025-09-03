import { useEffect, useMemo } from 'react';
import { useUserPreferences } from '../hooks/useUserPreferences';
import type { RSSItem } from '../types/rss';

function useCleanupIgnoredArticles(articles: RSSItem[]) {
  const { cleanupIgnoredArticles } = useUserPreferences();

  const currentArticleLinks = useMemo(
    () => articles.map((item) => item.link),
    [articles]
  );

  useEffect(() => {
    cleanupIgnoredArticles(currentArticleLinks);
  }, [currentArticleLinks]);
}

export { useCleanupIgnoredArticles };
