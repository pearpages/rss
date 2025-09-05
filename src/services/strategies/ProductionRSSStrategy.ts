import type { RSSFeed, RSSItem } from '../../types/rss';
import type { RSSStrategy } from './RSSStrategy';
import { MockRSSService } from '../../mocks';
import { sample } from '../sample';
import { Logger } from '../Logger';

const baseUrl = 'https://api.rss2json.com/v1/api.json';

const MAX_RETRIES = 3;

const delay = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getFallbackData = async (feed: RSSFeed): Promise<RSSItem[]> => {
  if (MockRSSService.hasMockFor(feed.url)) {
    Logger.info(`🎭 Using mock data as fallback for ${feed.name}`);
    try {
      const mockResponse = await MockRSSService.getMockResponse(feed.url);
      return MockRSSService.convertMockToRSSItems(mockResponse, feed.name);
    } catch (error) {
      Logger.error(`Failed to load mock fallback for ${feed.name}:`, error);
    }
  }

  Logger.info(`📰 Using sample data for ${feed.name}`);
  return sample.slice(0, 5);
};

const stripHtml = (html: string): string => {
  if (!html) return '';

  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || '';

  return text.length > 200 ? text.substring(0, 200) + '...' : text;
};

const extractImage = (item: {
  thumbnail?: string;
  enclosure?: { link?: string };
  description?: string;
}): string | undefined => {
  // Try thumbnail first, then enclosure, then extract from description
  if (item.thumbnail) return item.thumbnail;
  if (item.enclosure?.link) return item.enclosure.link;

  const description = item.description || '';
  if (!description) return undefined;

  // Try to extract image from HTML content in description
  const imgRegex = /<img[^>]+src\s*=\s*['"]+([^'"]*)['"]+[^>]*>/i;
  const match = description.match(imgRegex);

  if (match && match[1]) {
    // Make sure it's a valid image URL
    const imageUrl = match[1];
    if (imageUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i)) {
      return imageUrl;
    }
  }

  return undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rssItemsAdapter = (items: any[], feed: RSSFeed): RSSItem[] =>
  items.map(
    (
      item: {
        title?: string;
        link?: string;
        description?: string;
        pubDate?: string;
        author?: string;
        thumbnail?: string;
        enclosure?: { link?: string };
        categories?: string[];
      },
      index: number
    ) => ({
      title: item.title || `Article ${index + 1}`,
      link: item.link || '',
      description: stripHtml(item.description || ''),
      pubDate: item.pubDate || new Date().toISOString(),
      author: item.author || '',
      source: feed.url,
      sourceName: feed.name,
      image: extractImage(item),
      categories: item.categories || [],
    })
  );

interface RateLimitError extends Error {
  isRateLimit: boolean;
}

const fetchRSSData = async (feed: RSSFeed): Promise<RSSItem[]> => {
  const rss2jsonUrl = `${baseUrl}?rss_url=${encodeURIComponent(feed.url)}`;

  const response = await fetch(rss2jsonUrl);

  if (response.status === 429) {
    const error = new Error('Rate limited') as RateLimitError;
    error.isRateLimit = true;
    throw error;
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.status === 'ok' && data.items && data.items.length > 0) {
    Logger.info(
      `✅ Successfully loaded ${data.items.length} items from ${feed.name}`
    );
    return rssItemsAdapter(data.items, feed);
  }

  throw new Error(`RSS2JSON returned status: ${data.status}`);
};

const retryWithBackoff = async <T>(
  fetchFeedMethod: () => Promise<T>,
  feedName: string,
  fallbackFn: () => Promise<T>
): Promise<T> => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      Logger.info(`Fetching ${feedName} (attempt ${attempt}/${MAX_RETRIES})`);

      const result = await fetchFeedMethod();
      return result;
    } catch (error: unknown) {
      const isRateLimit = (error as RateLimitError).isRateLimit;

      if (isRateLimit) {
        Logger.warning(
          `🚫 Rate limited for ${feedName} (attempt ${attempt}/${MAX_RETRIES}).`
        );
      } else {
        Logger.warning(
          `❌ Failed to fetch ${feedName} (attempt ${attempt}/${MAX_RETRIES}):`,
          error
        );
      }

      if (attempt < MAX_RETRIES) {
        // Wait before retrying (exponential backoff: 1s, 2s, 4s)
        const waitTime = Math.pow(2, attempt - 1) * 1000;
        Logger.info(`⏱️ Waiting ${waitTime}ms before retry...`);
        await delay(waitTime);
        continue;
      }

      // All retries exhausted, try fallbacks
      Logger.error(`💥 All ${MAX_RETRIES} attempts failed for ${feedName}`);
      return fallbackFn();
    }
  }

  // This should never be reached, but TypeScript requires it
  return fallbackFn();
};

const fetchFeed = async (feed: RSSFeed): Promise<RSSItem[]> => {
  return retryWithBackoff(
    () => fetchRSSData(feed),
    feed.name,
    () => getFallbackData(feed)
  );
};

/**
 * Production strategy that fetches real RSS data with fallbacks
 */
class ProductionRSSStrategy implements RSSStrategy {
  async fetchMultipleFeeds(feeds: RSSFeed[]): Promise<RSSItem[]> {
    Logger.info('🔄 Fetching RSS feeds...');

    const promises = feeds.map((feed) => fetchFeed(feed));
    const results = await Promise.allSettled(promises);

    const allItems: RSSItem[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      } else {
        Logger.error(
          `Failed to fetch feed ${feeds[index].name}:`,
          result.reason
        );
      }
    });

    // If no real articles were loaded, show sample data
    if (allItems.length === 0) {
      Logger.info('📰 No live feeds available, showing sample data');
      return sample;
    }

    // Sort by publication date (newest first)
    const sortedItems = allItems.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    Logger.info(`📊 Loaded ${sortedItems.length} total articles`);
    return sortedItems;
  }
}

export const productionRSSStrategy = new ProductionRSSStrategy();
