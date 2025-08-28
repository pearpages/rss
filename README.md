# 📰 RSS News Aggregator

A beautiful, mobile-first RSS news aggregator built with React, TypeScript, and Vite. This application aggregates content from multiple RSS feeds and presents them in a clean, readable format optimized for mobile devices.

[![Deploy to GitHub Pages](https://github.com/pearpages/rss/actions/workflows/deploy.yml/badge.svg)](https://github.com/pearpages/rss/actions/workflows/deploy.yml)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.x-purple?logo=vite)
![Mobile First](https://img.shields.io/badge/Mobile-First-green)
![License](https://img.shields.io/badge/License-Personal_Use-orange)

🌐 **Live Demo**: [https://rss.pages.ninja](https://rss.pages.ninja)

## 📸 Screenshots

### Mobile Experience
*Clean, card-based design optimized for mobile reading*

### Desktop Experience  
*Responsive layout that scales beautifully to larger screens*

> 📱 **Best viewed on mobile devices** - This app is designed with mobile-first principles for the optimal news reading experience on your phone.

## 📑 Table of Contents

- [📰 RSS News Aggregator](#-rss-news-aggregator)
  - [📸 Screenshots](#-screenshots)
    - [Mobile Experience](#mobile-experience)
    - [Desktop Experience](#desktop-experience)
  - [📑 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠️ Technology Stack](#️-technology-stack)
  - [🏗️ Project Structure](#️-project-structure)
  - [⚡ Quick Start](#-quick-start)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [📜 Available Scripts](#-available-scripts)
  - [🌐 Deployment](#-deployment)
    - [Automatic Deployment](#automatic-deployment)
    - [Manual Deployment](#manual-deployment)
    - [Custom Domain Setup](#custom-domain-setup)
  - [📰 RSS Sources](#-rss-sources)
    - [Adding New RSS Sources](#adding-new-rss-sources)
  - [🔧 Configuration](#-configuration)
    - [CORS Handling](#cors-handling)
    - [Mobile Optimization](#mobile-optimization)
  - [🚫 Privacy \& Legal](#-privacy--legal)
  - [🤝 Contributing](#-contributing)
    - [Development Guidelines](#development-guidelines)
  - [📄 License](#-license)
  - [🐛 Troubleshooting](#-troubleshooting)
    - [Common Issues](#common-issues)
  - [📞 Support](#-support)
  - [🚀 Performance Features](#-performance-features)
  - [🎯 Future Enhancements](#-future-enhancements)
  - [📱 Browser Support](#-browser-support)

## ✨ Features

- 📱 **Mobile-First Design**: Optimized reading experience for mobile devices
- 🔄 **RSS Aggregation**: Fetch and display content from multiple RSS sources
- ⚡ **Fast Loading**: Built with Vite for optimal performance and hot reload
- 🎨 **Beautiful UI**: Clean, modern interface with smooth animations
- 📰 **Multiple News Sources**: Aggregates from BBC, TechCrunch, Hacker News, The Guardian, and Dev.to
- 🚀 **Auto-Deploy**: Automatic deployment to custom domain via GitHub Actions
- 🕒 **Smart Timestamps**: Human-readable relative time display
- 🏷️ **Source Attribution**: Color-coded tags for easy source identification
- 🔒 **Privacy Focused**: No tracking, includes robots.txt for search engine exclusion

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Custom CSS with mobile-first responsive design
- **RSS Parsing**: Browser-native DOMParser with CORS proxy support
- **Date Handling**: date-fns for timestamp formatting
- **Deployment**: GitHub Actions → GitHub Pages → Custom Domain
- **Node.js**: 22.12.0 (see `.nvmrc`)

## 🏗️ Project Structure

```
rss/
├── .github/workflows/     # GitHub Actions deployment
├── public/
│   ├── CNAME             # Custom domain configuration
│   └── robots.txt        # Search engine exclusion
├── src/
│   ├── config/
│   │   └── feeds.ts      # RSS feed sources configuration
│   ├── services/
│   │   └── rssService.ts # RSS parsing and fetching logic
│   ├── styles/
│   │   └── App.css       # Mobile-first responsive styles
│   ├── types/
│   │   └── rss.ts        # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # React entry point
├── .nvmrc                # Node.js version specification
├── vite.config.ts        # Vite configuration for custom domain
└── package.json          # Dependencies and scripts
```

## ⚡ Quick Start

```bash
# Clone and setup
git clone https://github.com/pearpages/rss.git
cd rss
npm install

# Start development
npm run dev

# Open http://localhost:5173
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22.12.0+ (managed via `.nvmrc`)
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pearpages/rss.git
   cd rss
   ```

2. **Install Node.js version** (if using mise):
   ```bash
   mise install
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**: Navigate to `http://localhost:5173`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code analysis |
| `npm run deploy` | Build the application |

## 🌐 Deployment

This project is configured for automatic deployment to GitHub Pages with a custom domain.

### Automatic Deployment

The application automatically deploys to [rss.pages.ninja](https://rss.pages.ninja) when code is pushed to the `main` branch via GitHub Actions.

### Manual Deployment

```bash
npm run build    # Build the application
# Files are built to ./dist and deployed automatically
```

### Custom Domain Setup

1. **DNS Configuration**:
   - Add a `CNAME` record pointing `rss.pages.ninja` to `pearpages.github.io`
   
2. **GitHub Pages Configuration**:
   - Repository Settings → Pages
   - Custom domain: `rss.pages.ninja`
   - Enforce HTTPS: ✅

## 📰 RSS Sources

The application aggregates content from these sources:

| Source | Category | Feed URL |
|--------|----------|----------|
| BBC News | News | `http://feeds.bbci.co.uk/news/rss.xml` |
| TechCrunch | Technology | `https://techcrunch.com/feed/` |
| Hacker News | Technology | `https://hnrss.org/frontpage` |
| The Guardian | News | `https://www.theguardian.com/international/rss` |
| Dev.to | Development | `https://dev.to/feed` |

### Adding New RSS Sources

Edit `src/config/feeds.ts` to add new RSS feeds:

```typescript
export const DEFAULT_RSS_FEEDS: RSSFeed[] = [
  // ... existing feeds
  {
    name: 'Your News Source',
    url: 'https://example.com/rss.xml',
    category: 'News'
  }
];
```

## 🔧 Configuration

### CORS Handling

RSS feeds are fetched through a CORS proxy (`allorigins.win`) since most RSS feeds don't support CORS headers. The proxy is configured in `src/services/rssService.ts` and uses browser-native DOMParser for XML parsing.

### Mobile Optimization

The application uses:
- Responsive CSS Grid and Flexbox layouts
- Touch-friendly interactive elements
- Optimized typography for mobile reading
- Progressive enhancement for larger screens

## 🚫 Privacy & Legal

- **No Indexing**: Includes `robots.txt` and meta tags to prevent search engine crawling
- **Content Attribution**: All articles link back to original sources
- **Personal Use**: Designed for personal news consumption
- **Respect ToS**: Please respect original content providers' terms of service

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain mobile-first responsive design
- Test RSS parsing with various feed formats
- Ensure accessibility standards compliance

## 📄 License

This project is for personal use only. Please respect the original content providers' terms of service.

## 🐛 Troubleshooting

### Common Issues

1. **RSS feeds not loading**:
   - Check internet connection
   - Verify RSS feed URLs are accessible
   - CORS proxy service may be temporarily down

2. **Build failures**:
   - Ensure Node.js version matches `.nvmrc`
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

3. **Custom domain not working**:
   - Verify DNS CNAME record configuration
   - Check GitHub Pages settings for custom domain
   - Allow time for DNS propagation (up to 24 hours)

## 📞 Support

For issues and feature requests, please [open an issue](https://github.com/pearpages/rss/issues) on GitHub.

## 🚀 Performance Features

- **Lazy Loading**: Articles load progressively for better performance
- **CORS Proxy**: Handles RSS feeds that don't support CORS headers
- **Error Handling**: Graceful fallbacks when feeds are unavailable
- **Responsive Images**: Optimized asset loading for mobile devices
- **Fast Refresh**: Hot module replacement during development

## 🎯 Future Enhancements

- [ ] Dark mode toggle
- [ ] Custom RSS feed management
- [ ] Article search and filtering
- [ ] Offline reading with service workers
- [ ] Push notifications for new articles
- [ ] Export articles to PDF/EPUB

## 📱 Browser Support

- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Desktop**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Modern browsers** with ES2020 support

---

Built with ❤️ for better news consumption experience
