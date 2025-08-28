import type { RSSFeed } from '../types/rss';

export const DEFAULT_RSS_FEEDS: RSSFeed[] = [
  {
    name: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    category: 'News'
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
  },
  {
    name: 'NASA News',
    url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss',
    category: 'Science'
  }
];
