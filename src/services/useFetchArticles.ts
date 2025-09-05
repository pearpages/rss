import { useState, useCallback, useRef } from 'react';
import { rssService } from './rssService';
import { Logger } from './Logger';
import { DEFAULT_RSS_FEEDS } from '../config/feeds';
import type { RSSItem } from '../types/rss';

function useFetchArticles() {
  const [articles, setArticles] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);

  const fetchArticles = useCallback(async () => {
    if (isLoadingRef.current) {
      Logger.info('🚫 Fetch already in progress, skipping...');
      return;
    }

    Logger.info('fetchArticles called, starting fetch...');
    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      Logger.info('Fetching RSS feeds...');
      const items = await rssService.fetchMultipleFeeds(DEFAULT_RSS_FEEDS);
      Logger.success(`Successfully loaded ${items.length} articles`);
      setArticles(items);

      if (items.length === 0) {
        setError(
          'No articles could be loaded from RSS feeds. This might be a temporary issue with the feed sources.'
        );
      }
    } catch (err) {
      Logger.error('Error in fetchArticles:', err);
      setError('Failed to fetch RSS feeds. Please try again later.');
      Logger.error('Error fetching articles:', err);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, []);

  return { articles, loading, error, fetchArticles };
}

export { useFetchArticles };
