import { useContext } from 'react';
import { createContext } from 'react';
import { Logger } from '../services/Logger';
import type { RSSItem } from '../types/rss';

interface ArticlesContextType {
  articles: RSSItem[];
  loading: boolean;
  error: string | null;
  fetchArticles: () => Promise<void>;
}

export const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export function useArticles() {
  const context = useContext(ArticlesContext);
  if (!context) {
    Logger.error('useArticles hook called outside of ArticlesProvider context');
    throw new Error('useArticles must be used within ArticlesProvider');
  }
  Logger.info('useArticles hook accessed successfully');
  return context;
}
