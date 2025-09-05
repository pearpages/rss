import type { RSSFeed, RSSItem } from '../../types/rss';
import type { RSSStrategy } from './RSSStrategy';
import { MockRSSService } from '../../mocks';
import { Logger } from '../Logger';

const fetchFeed = async (feed: RSSFeed) => {
  Logger.info(`Development mode: Using mock data for ${feed.name}`);

  try {
    if (MockRSSService.hasMockFor(feed.url)) {
      const mockResponse = await MockRSSService.getMockResponse(feed.url);
      return MockRSSService.convertMockToRSSItems(mockResponse, feed.name);
    } else {
      Logger.warning(
        `No mock available for ${feed.name}, returning empty array`
      );
      return [];
    }
  } catch (error) {
    Logger.error(`Failed to fetch mock data for ${feed.name}:`, error);
    return [];
  }
};

/**
 * Development strategy that uses mock data
 */
export const developmentRSSStrategy: RSSStrategy = {
  fetchMultipleFeeds: async (feeds) => {
    Logger.info('Development mode: Fetching multiple feeds using mock data...');

    const promises = feeds.map((feed) => fetchFeed(feed));
    const results = await Promise.allSettled(promises);

    const allItems: RSSItem[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      } else {
        Logger.error(
          `Failed to fetch mock feed ${feeds[index].name}:`,
          result.reason
        );
      }
    });

    // Sort by publication date (newest first)
    const sortedItems = allItems.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    Logger.success(`Loaded ${sortedItems.length} total mock articles`);
    return sortedItems;
  },
};
