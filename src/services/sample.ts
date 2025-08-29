import type { RSSItem } from "../types/rss";

const sample: RSSItem[] = [
  {
    title: "🎉 Welcome to RSS News Aggregator",
    link: "https://rss.pages.ninja",
    description:
      "This is a beautiful, mobile-first RSS news aggregator built with React and TypeScript. When live RSS feeds are available, you'll see real news here. This demo shows how the interface looks with multiple articles from different sources.",
    pubDate: new Date().toISOString(),
    author: "RSS Aggregator Team",
    source: "demo",
    sourceName: "Demo Content",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop&crop=entropy",
  },
  {
    title: "React 18 Concurrent Features Explained",
    link: "https://react.dev/blog",
    description:
      "React 18 introduced several groundbreaking features including concurrent rendering, automatic batching, and new hooks like useId and useDeferredValue that make building user interfaces more efficient and responsive.",
    pubDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    author: "React Team",
    source: "demo",
    sourceName: "React News",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop&crop=entropy",
  },
  {
    title: "TypeScript 5.0: New Features and Improvements",
    link: "https://typescriptlang.org/announcements",
    description:
      "TypeScript 5.0 brings decorator support, better type inference, improved performance, and new features that make JavaScript development more productive and type-safe.",
    pubDate: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    author: "TypeScript Team",
    source: "demo",
    sourceName: "TypeScript Blog",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop&crop=entropy",
  },
  {
    title: "Building Mobile-First Progressive Web Apps",
    link: "https://web.dev/progressive-web-apps",
    description:
      "Learn how to create responsive web applications that provide excellent user experience across all device sizes, starting with mobile-first design principles and progressive enhancement.",
    pubDate: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    author: "Google Web Team",
    source: "demo",
    sourceName: "Web Development",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop&crop=entropy",
  },
  {
    title: "Modern CSS Grid and Flexbox Techniques",
    link: "https://css-tricks.com/snippets/css/complete-guide-grid",
    description:
      "Explore the latest CSS layout techniques including CSS Grid, Flexbox, and container queries that are revolutionizing responsive web design in 2025.",
    pubDate: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    author: "CSS-Tricks Team",
    source: "demo",
    sourceName: "CSS News",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=entropy",
  },
  {
    title: "Vite vs Create React App: Performance Comparison",
    link: "https://vitejs.dev/guide/why.html",
    description:
      "Discover why Vite offers superior development experience with lightning-fast hot module replacement, optimized builds, and better developer experience compared to traditional bundlers.",
    pubDate: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
    author: "Vite Team",
    source: "demo",
    sourceName: "Build Tools",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&crop=entropy",
  },
  {
    title: "Accessibility Best Practices for 2025",
    link: "https://www.a11yproject.com",
    description:
      "Essential accessibility guidelines and techniques to ensure your web applications are usable by everyone, including users with disabilities. Learn about ARIA, semantic HTML, and testing strategies.",
    pubDate: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    author: "A11Y Project",
    source: "demo",
    sourceName: "Accessibility",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop&crop=entropy",
  },
  {
    title: "GitHub Actions CI/CD Pipeline Setup",
    link: "https://docs.github.com/en/actions",
    description:
      "Step-by-step guide to setting up automated deployment pipelines with GitHub Actions, including testing, building, and deploying to GitHub Pages with custom domains.",
    pubDate: new Date(Date.now() - 25200000).toISOString(), // 7 hours ago
    author: "GitHub Team",
    source: "demo",
    sourceName: "DevOps",
    image:
      "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop&crop=entropy",
  },
];

export { sample };
