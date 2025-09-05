export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author?: string;
  source: string;
  sourceName: string;
  image?: string;
  categories?: string[];
}

export interface RSSFeed {
  url: string;
  name: string;
  category?: string;
}

export interface ParsedFeed {
  title: string;
  description: string;
  items: RSSItem[];
}
