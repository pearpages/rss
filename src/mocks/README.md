# RSS Mocks

This directory contains mock responses for RSS feeds to help with development when hitting API rate limits.

## Structure

```
mocks/
├── MockRSSService.ts      # Main service for handling mocks
├── responses/             # JSON files containing mock responses
│   ├── bbc-news.json     # BBC News mock response
│   └── ...               # More mock responses
└── index.ts              # Exports
```

## How it works

1. **Development Mode**: When `import.meta.env.DEV` is true, the RSS service will automatically use mocks if available
2. **Rate Limit Fallback**: When hitting 429 errors, the service will try to use mocks before falling back to sample data
3. **URL Mapping**: Mock responses are mapped to RSS URLs in `MockRSSService.ts`

## Adding New Mocks

1. Get the actual API response from rss2json for your feed:
   ```
   https://api.rss2json.com/v1/api.json?rss_url=YOUR_RSS_URL_ENCODED
   ```

2. Save the response as a JSON file in `responses/` directory

3. Add the URL mapping to `MOCK_RESPONSES` in `MockRSSService.ts`:
   ```typescript
   const MOCK_RESPONSES: Record<string, string> = {
     'https://your-rss-url.com/feed.xml': 'your-mock-file.json',
   };
   ```

## Current Mocks

- **BBC News**: `https://feeds.bbci.co.uk/news/rss.xml` → `bbc-news.json`
- **The Guardian**: `https://www.theguardian.com/international/rss` → `the-guardian.json`
- **Mundo Deportivo**: `https://www.mundodeportivo.com/feed/rss/home` → `mundo-deportivo.json`
- **Al Jazeera**: `https://www.aljazeera.com/xml/rss/all.xml` → `al-jazeera.json`
- **La Vanguardia**: `https://www.lavanguardia.com/rss/home.xml` → `la-vanguardia.json`
- **RAC1**: `https://www.rac1.cat/rss/home.xml` → `rac1.json`

## Usage

The mocks are automatically used:
- In development mode for feeds that have mocks available
- As fallback when hitting rate limits (429 errors)
- No code changes needed - it's handled transparently by `RSSService`

## Benefits

- ✅ No more waiting for rate limits during development
- ✅ Consistent test data
- ✅ Faster development iteration
- ✅ Offline development capability
- ✅ Real API response structure preserved
