import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { ArticlesContext } from '../hooks/useArticles';
import { useFetchArticles } from '../services/useFetchArticles';

export function ArticlesProvider({ children }: { children: ReactNode }) {
  const { articles, loading, error, fetchArticles } = useFetchArticles();

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ArticlesContext.Provider value={{ articles, loading, error, fetchArticles }}>
      {children}
    </ArticlesContext.Provider>
  );
}
