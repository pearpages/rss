import type { RSSFeed } from '../types/rss';

export const DEFAULT_RSS_FEEDS: RSSFeed[] = [
  {
    name: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    category: 'News'
  },
  // {
  //   name: 'Hacker News',
  //   url: 'https://hnrss.org/frontpage', // from: https://news.ycombinator.com/news
  //   category: 'Technology'
  // },
  {
    name: 'The Guardian',
    url: 'https://www.theguardian.com/international/rss',
    category: 'News'
  },
  // {
  //   name: 'Dev.to',
  //   url: 'https://dev.to/api/articles?top=10', // Requires proxying because RSS2JSON doesn't want it
  //   category: 'Development'
  // },
  // {
  //   name: 'NASA News',
  //   url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss',
  //   category: 'Science'
  // },
  {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    category: 'News'
  },
  {
    name: 'La Vanguardia',
    url: 'https://www.lavanguardia.com/rss/home.xml',
    category: 'News'
  },
  {
    name: 'RAC1',
    url: 'https://www.rac1.cat/rss/home.xml',
    category: 'News'
  }
];
