import { sample } from './sample';
import type { RSSFeed, RSSItem } from '../types/rss';

class RSSService {
  // Sample data for demo purposes when live feeds fail
  private getSampleData(): RSSItem[] {
    return sample;
  }

  async fetchFeed(feed: RSSFeed): Promise<RSSItem[]> {
    try {
      // Use proxy in development, direct API in production
      const isDevelopment = import.meta.env.DEV;
      const baseUrl = isDevelopment 
        ? '/api/rss2json/v1/api.json' 
        : 'https://api.rss2json.com/v1/api.json';
      
      const rss2jsonUrl = `${baseUrl}?rss_url=${encodeURIComponent(feed.url)}`;
      
      console.log(`Fetching ${feed.name} via RSS2JSON (${isDevelopment ? 'proxy' : 'direct'})...`);
      
      const response = await fetch(rss2jsonUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        console.log(`✅ Successfully loaded ${data.items.length} items from ${feed.name}`);
        return data.items.map((item: { 
          title?: string; 
          link?: string; 
          description?: string; 
          pubDate?: string; 
          author?: string;
          thumbnail?: string;
          enclosure?: { link?: string };
        }, index: number) => ({
          title: item.title || `Article ${index + 1}`,
          link: item.link || '',
          description: this.stripHtml(item.description || ''),
          pubDate: item.pubDate || new Date().toISOString(),
          author: item.author || '',
          source: feed.url,
          sourceName: feed.name,
          image: this.extractImage(item)
        }));
      }
      
      throw new Error(`RSS2JSON returned status: ${data.status}`);
    } catch (error) {
      console.warn(`❌ Failed to fetch ${feed.name}:`, error);
      return [];
    }
  }

  async fetchMultipleFeeds(feeds: RSSFeed[]): Promise<RSSItem[]> {
    console.log('🔄 Fetching RSS feeds...');
    
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

    // If no real articles were loaded, show sample data
    if (allItems.length === 0) {
      console.log('📰 No live feeds available, showing sample data');
      return this.getSampleData();
    }

    // Sort by publication date (newest first)
    const sortedItems = allItems.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
    
    console.log(`📊 Loaded ${sortedItems.length} total articles`);
    return sortedItems;
  }

  private stripHtml(html: string): string {
    if (!html) return '';
    
    // Create a temporary div to strip HTML tags
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    
    // Limit description length for better mobile display
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  }

  private extractImage(item: {
    thumbnail?: string;
    enclosure?: { link?: string };
    description?: string;
  }): string | undefined {
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
  }
}

export const rssService = new RSSService();
