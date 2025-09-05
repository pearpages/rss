import type { RSSItem } from '../types/rss';

// Define the structure of our mock responses
export interface MockRSSResponse {
  status: string;
  feed: {
    url: string;
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
  };
  items: MockRSSItem[];
}

export interface MockRSSItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail?: string;
  description: string;
  content: string;
  enclosure?: {
    thumbnail?: string;
  };
  categories: string[];
}

// Map RSS URLs to their mock response files
const MOCK_RESPONSES: Record<string, string> = {
  'https://feeds.bbci.co.uk/news/rss.xml': 'bbc-news.json',
  'https://www.theguardian.com/international/rss': 'the-guardian.json',
  'https://www.mundodeportivo.com/feed/rss/home': 'mundo-deportivo.json',
  'https://www.aljazeera.com/xml/rss/all.xml': 'al-jazeera.json',
  'https://www.lavanguardia.com/rss/home.xml': 'la-vanguardia.json',
  'https://www.rac1.cat/rss/home.xml': 'rac1.json',
};

export class MockRSSService {
  /**
   * Check if we have a mock response for the given RSS URL
   */
  static hasMockFor(rssUrl: string): boolean {
    return rssUrl in MOCK_RESPONSES;
  }

  /**
   * Get mock response for a given RSS URL
   */
  static async getMockResponse(rssUrl: string): Promise<MockRSSResponse> {
    const mockFile = MOCK_RESPONSES[rssUrl];
    if (!mockFile) {
      throw new Error(`No mock response available for: ${rssUrl}`);
    }

    try {
      // Dynamically import the JSON file
      const mockData = await import(/* @vite-ignore */ `./responses/${mockFile}`);
      console.log(`🎭 Using mock data for ${rssUrl}`);
      return mockData.default as MockRSSResponse;
    } catch (error) {
      console.error(`Failed to load mock response for ${rssUrl}:`, error);
      throw error;
    }
  }

  /**
   * Get list of all URLs that have mock responses
   */
  static getAvailableMocks(): string[] {
    return Object.keys(MOCK_RESPONSES);
  }

  /**
   * Convert mock response to RSSItems format
   */
  static convertMockToRSSItems(mockResponse: MockRSSResponse, feedName: string): RSSItem[] {
    if (!mockResponse?.items) {
      return [];
    }

    return mockResponse.items.map((item: MockRSSItem, index: number) => ({
      title: item.title || `Article ${index + 1}`,
      link: item.link || '',
      description: item.description || item.content || '',
      pubDate: item.pubDate || new Date().toISOString(),
      author: item.author || '',
      source: mockResponse.feed?.url || '',
      sourceName: feedName,
      image: item.thumbnail || item.enclosure?.thumbnail,
    }));
  }
}
