import type { RSSFeed, RSSItem } from '../types/rss';
import type { RSSStrategy } from './strategies';
import { developmentRSSStrategy, productionRSSStrategy } from './strategies';
import { Logger } from './Logger';

/**
 * RSS Service using Strategy Pattern
 * Automatically switches between development (mock) and production (real API) strategies
 * based on the environment
 */
class RSSService {
  private strategy: RSSStrategy;

  constructor() {
    this.strategy = this.createStrategy();
  }

  private createStrategy(): RSSStrategy {
    const isDevelopment = import.meta.env.VITE_DEV === 'true';
    
    if (isDevelopment) {
      Logger.info('🎭 Initializing RSS Service in Development mode (using mocks)');
      return developmentRSSStrategy;
    } else {
      Logger.info('🚀 Initializing RSS Service in Production mode (using real API)');
      return productionRSSStrategy;
    }
  }

  async fetchMultipleFeeds(feeds: RSSFeed[]): Promise<RSSItem[]> {
    return this.strategy.fetchMultipleFeeds(feeds);
  }

}

export const rssService = new RSSService();
