import type { RSSFeed, RSSItem } from '../types/rss';

class RSSService {
  // Sample data for demo purposes when live feeds fail
  private getSampleData(): RSSItem[] {
    return [
      {
        title: "🎉 Welcome to RSS News Aggregator",
        link: "https://rss.pages.ninja",
        description: "This is a beautiful, mobile-first RSS news aggregator built with React and TypeScript. When live RSS feeds are available, you'll see real news here. This demo shows how the interface looks with multiple articles from different sources.",
        pubDate: new Date().toISOString(),
        author: "RSS Aggregator Team",
        source: "demo",
        sourceName: "Demo Content"
      },
      {
        title: "React 18 Concurrent Features Explained",
        link: "https://react.dev/blog",
        description: "React 18 introduced several groundbreaking features including concurrent rendering, automatic batching, and new hooks like useId and useDeferredValue that make building user interfaces more efficient and responsive.",
        pubDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        author: "React Team",
        source: "demo",
        sourceName: "React News"
      },
      {
        title: "TypeScript 5.0: New Features and Improvements",
        link: "https://typescriptlang.org/announcements",
        description: "TypeScript 5.0 brings decorator support, better type inference, improved performance, and new features that make JavaScript development more productive and type-safe.",
        pubDate: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        author: "TypeScript Team",
        source: "demo",
        sourceName: "TypeScript Blog"
      },
      {
        title: "Building Mobile-First Progressive Web Apps",
        link: "https://web.dev/progressive-web-apps",
        description: "Learn how to create responsive web applications that provide excellent user experience across all device sizes, starting with mobile-first design principles and progressive enhancement.",
        pubDate: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        author: "Google Web Team",
        source: "demo",
        sourceName: "Web Development"
      },
      {
        title: "Modern CSS Grid and Flexbox Techniques",
        link: "https://css-tricks.com/snippets/css/complete-guide-grid",
        description: "Explore the latest CSS layout techniques including CSS Grid, Flexbox, and container queries that are revolutionizing responsive web design in 2025.",
        pubDate: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        author: "CSS-Tricks Team",
        source: "demo",
        sourceName: "CSS News"
      },
      {
        title: "Vite vs Create React App: Performance Comparison",
        link: "https://vitejs.dev/guide/why.html",
        description: "Discover why Vite offers superior development experience with lightning-fast hot module replacement, optimized builds, and better developer experience compared to traditional bundlers.",
        pubDate: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
        author: "Vite Team",
        source: "demo",
        sourceName: "Build Tools"
      },
      {
        title: "Accessibility Best Practices for 2025",
        link: "https://www.a11yproject.com",
        description: "Essential accessibility guidelines and techniques to ensure your web applications are usable by everyone, including users with disabilities. Learn about ARIA, semantic HTML, and testing strategies.",
        pubDate: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
        author: "A11Y Project",
        source: "demo",
        sourceName: "Accessibility"
      },
      {
        title: "GitHub Actions CI/CD Pipeline Setup",
        link: "https://docs.github.com/en/actions",
        description: "Step-by-step guide to setting up automated deployment pipelines with GitHub Actions, including testing, building, and deploying to GitHub Pages with custom domains.",
        pubDate: new Date(Date.now() - 25200000).toISOString(), // 7 hours ago
        author: "GitHub Team",
        source: "demo",
        sourceName: "DevOps"
      }
    ];
  }

  async fetchFeed(feed: RSSFeed): Promise<RSSItem[]> {
    try {
      // Use RSS2JSON service which is more reliable
      const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
      
      console.log(`Fetching ${feed.name} via RSS2JSON...`);
      
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
          author?: string 
        }, index: number) => ({
          title: item.title || `Article ${index + 1}`,
          link: item.link || '',
          description: this.stripHtml(item.description || ''),
          pubDate: item.pubDate || new Date().toISOString(),
          author: item.author || '',
          source: feed.url,
          sourceName: feed.name
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
}

export const rssService = new RSSService();
