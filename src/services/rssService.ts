import Parser from 'rss-parser';
import type { RSSFeed, RSSItem } from '../types/rss';

class RSSService {
  private parser: Parser;

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['author', 'creator', 'dc:creator']
      }
    });
  }

  async fetchFeed(feed: RSSFeed): Promise<RSSItem[]> {
    try {
      // Use a CORS proxy for RSS feeds since they don't support CORS
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      const parsedFeed = await this.parser.parseString(data.contents);
      
      return parsedFeed.items.map(item => ({
        title: item.title || 'No title',
        link: item.link || '',
        description: this.stripHtml(item.contentSnippet || item.description || ''),
        pubDate: item.pubDate || new Date().toISOString(),
        author: item.author || item.creator || item['dc:creator'] || '',
        source: feed.url,
        sourceName: feed.name
      }));
    } catch (error) {
      console.error(`Error fetching feed ${feed.name}:`, error);
      return [];
    }
  }

  async fetchMultipleFeeds(feeds: RSSFeed[]): Promise<RSSItem[]> {
    const promises = feeds.map(feed => this.fetchFeed(feed));
    const results = await Promise.allSettled(promises);
    
    const allItems: RSSItem[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      } else {
        console.error(`Failed to fetch feed ${feeds[index].name}:`, result.reason);
      }
    });

    // Sort by publication date (newest first)
    return allItems.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
  }

  private stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}

export const rssService = new RSSService();
