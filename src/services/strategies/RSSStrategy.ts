import type { RSSFeed, RSSItem } from '../../types/rss';

/**
 * Strategy interface for RSS fetching implementations
 */
export interface RSSStrategy {
  fetchMultipleFeeds(feeds: RSSFeed[]): Promise<RSSItem[]>;
}
