import type { RSSFeed } from '../types/rss';

export const DEFAULT_RSS_FEEDS: RSSFeed[] = [
  {
    name: 'BBC News',
    url: 'http://feeds.bbci.co.uk/news/rss.xml',
    category: 'News'
  },
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'Technology'
  },
  {
    name: 'Hacker News',
    url: 'https://hnrss.org/frontpage',
    category: 'Technology'
  },
  {
    name: 'The Guardian',
    url: 'https://www.theguardian.com/international/rss',
    category: 'News'
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to/feed',
    category: 'Development'
  }
];
