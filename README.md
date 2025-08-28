# 📰 RSS News Aggregator

A beautiful, mobile-first RSS news aggregator built with React, TypeScript, and Vite. This application aggregates content from multiple RSS feeds and presents them in a clean, readable format optimized for mobile devices.

[![Deploy to GitHub Pages](https://github.com/pearpages/rss/actions/workflows/deploy.yml/badge.svg)](https://github.com/pearpages/rss/actions/workflows/deploy.yml)

🌐 **Live Demo**: [https://rss.pages.ninja](https://rss.pages.ninja)

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
- **RSS Parsing**: rss-parser library with CORS proxy support
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

RSS feeds are fetched through a CORS proxy (`allorigins.win`) since most RSS feeds don't support CORS headers. The proxy is configured in `src/services/rssService.ts`.

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

---

Built with ❤️ for better news consumption experience

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
