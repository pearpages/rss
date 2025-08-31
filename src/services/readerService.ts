/**
 * Reader Service - Extracts clean article content from URLs
 * Uses multiple APIs to extract readable content from news articles
 */

export interface ReaderResult {
  title: string;
  content: string;
  excerpt: string;
  author?: string;
  publishedDate?: string;
  siteName?: string;
  imageUrl?: string;
  success: boolean;
  error?: string;
}

interface ReaderAPI {
  name: string;
  url: (url: string) => string;
  headers: Record<string, string>;
  parser: (data: unknown, originalUrl: string) => ReaderResult;
  retryDelay?: number;
}

class ReaderService {
  private failedAPIs = new Set<string>();
  private lastRequestTime = 0;
  private readonly REQUEST_DELAY = 1000; // 1 second between requests

  private readonly APIs: ReaderAPI[] = [
    {
      name: 'AllOrigins CORS Proxy',
      url: (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      headers: {},
      parser: this.parseWithAllOrigins.bind(this),
      retryDelay: 30000 // 30 seconds before retry
    },
    {
      name: 'JSONProxy (Backup)',
      url: (url: string) => `https://jsonp.afeld.me/?url=${encodeURIComponent(url)}`,
      headers: {},
      parser: this.parseWithJSONProxy.bind(this),
      retryDelay: 60000 // 1 minute before retry
    },
    {
      name: 'CORS.sh (Alternative)',
      url: (url: string) => `https://cors.sh/${url}`,
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      parser: this.parseDirectHTML.bind(this),
      retryDelay: 45000 // 45 seconds before retry
    }
  ];

  async extractArticle(url: string): Promise<ReaderResult> {
    console.log(`📖 Extracting article content from: ${url}`);

    // Rate limiting - wait between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.REQUEST_DELAY) {
      const waitTime = this.REQUEST_DELAY - timeSinceLastRequest;
      console.log(`⏱️ Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();

    // Filter out recently failed APIs
    const availableAPIs = this.APIs.filter(api => !this.failedAPIs.has(api.name));
    const apisToTry = availableAPIs.length > 0 ? availableAPIs : this.APIs;

    // Try each available API
    for (const api of apisToTry) {
      try {
        console.log(`🔍 Trying ${api.name}...`);
        const result = await this.tryAPI(api, url);
        console.log(`✅ Successfully extracted with ${api.name}:`, {
          title: result.title,
          contentLength: result.content.length,
          success: result.success,
          error: result.error
        });
        
        // Remove from failed list on success
        this.failedAPIs.delete(api.name);
        
        if (result.success) {
          return result;
        }
      } catch (error) {
        console.warn(`❌ ${api.name} failed:`, error);
        
        // Mark API as failed temporarily
        this.failedAPIs.add(api.name);
        if (api.retryDelay) {
          setTimeout(() => {
            this.failedAPIs.delete(api.name);
            console.log(`🔄 ${api.name} retry timeout expired`);
          }, api.retryDelay);
        }
        
        continue;
      }
    }

    // If all APIs fail, return a fallback
    console.log('🔄 All APIs failed, returning fallback');
    return this.createFallbackResult(url);
  }

  private async tryAPI(api: ReaderAPI, url: string): Promise<ReaderResult> {
    console.log(`🌐 Fetching from: ${api.url(url)}`);
    
    const response = await fetch(api.url(url), {
      headers: {
        'Accept': 'application/json',
        ...api.headers
      }
    });

    console.log(`📡 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`📦 Data received:`, {
      hasContents: !!(data as Record<string, unknown>).contents,
      dataType: typeof data,
      keys: Object.keys(data as Record<string, unknown>)
    });
    
    return api.parser(data, url);
  }

  private parseWithAllOrigins(data: unknown, originalUrl: string): ReaderResult {
    const parsed = data as Record<string, unknown>;
    
    if (!parsed.contents) {
      throw new Error('No HTML content received from AllOrigins');
    }

    const html = parsed.contents as string;
    return this.extractFromHTML(html, originalUrl);
  }

  private parseWithJSONProxy(data: unknown, originalUrl: string): ReaderResult {
    // JSONProxy returns the HTML directly as a string
    const html = data as string;
    return this.extractFromHTML(html, originalUrl);
  }

  private parseDirectHTML(data: unknown, originalUrl: string): ReaderResult {
    // This parser handles direct HTML responses (like from CORS.sh)
    const html = data as string;
    return this.extractFromHTML(html, originalUrl);
  }

  private extractFromHTML(html: string, originalUrl: string): ReaderResult {
    const title = this.extractTitle(html);
    const content = this.extractMainContent(html);
    const author = this.extractAuthor(html);
    const publishedDate = this.extractPublishedDate(html);
    const siteName = this.extractSiteName(html, originalUrl);
    const imageUrl = this.extractMainImage(html, originalUrl);

    if (!title && !content) {
      throw new Error('Could not extract readable content');
    }

    return {
      title: title || 'Article',
      content: content || '',
      excerpt: this.createExcerpt(content),
      author,
      publishedDate,
      siteName,
      imageUrl,
      success: true
    };
  }

  private extractTitle(html: string): string {
    // Try various title extraction methods
    const titlePatterns = [
      /<title[^>]*>([^<]+)<\/title>/i,
      /<h1[^>]*>([^<]+)<\/h1>/i,
      /<meta property="og:title" content="([^"]+)"/i,
      /<meta name="title" content="([^"]+)"/i
    ];

    for (const pattern of titlePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return this.cleanText(match[1]);
      }
    }

    return '';
  }

  private extractAuthor(html: string): string | undefined {
    const authorPatterns = [
      /<meta name="author" content="([^"]+)"/i,
      /<meta property="article:author" content="([^"]+)"/i,
      /<span[^>]*class="[^"]*author[^"]*"[^>]*>([^<]+)</i,
      /<div[^>]*class="[^"]*byline[^"]*"[^>]*>.*?by\s+([^<]+)</i
    ];

    for (const pattern of authorPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return this.cleanText(match[1]);
      }
    }

    return undefined;
  }

  private extractPublishedDate(html: string): string | undefined {
    const datePatterns = [
      /<meta property="article:published_time" content="([^"]+)"/i,
      /<meta name="date" content="([^"]+)"/i,
      /<time[^>]*datetime="([^"]+)"/i,
      /<meta property="og:updated_time" content="([^"]+)"/i
    ];

    for (const pattern of datePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return undefined;
  }

  private extractSiteName(html: string, originalUrl: string): string | undefined {
    const siteNamePatterns = [
      /<meta property="og:site_name" content="([^"]+)"/i,
      /<meta name="application-name" content="([^"]+)"/i
    ];

    for (const pattern of siteNamePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return this.cleanText(match[1]);
      }
    }

    // Fallback to domain name
    try {
      return new URL(originalUrl).hostname.replace('www.', '');
    } catch {
      return undefined;
    }
  }

  private extractMainImage(html: string, originalUrl: string): string | undefined {
    const imagePatterns = [
      /<meta property="og:image" content="([^"]+)"/i,
      /<meta name="twitter:image" content="([^"]+)"/i,
      /<link rel="image_src" href="([^"]+)"/i
    ];

    for (const pattern of imagePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const imageUrl = match[1];
        // Make sure it's an absolute URL
        if (imageUrl.startsWith('http')) {
          return imageUrl;
        } else if (imageUrl.startsWith('/')) {
          try {
            const baseUrl = new URL(originalUrl);
            return `${baseUrl.protocol}//${baseUrl.host}${imageUrl}`;
          } catch {
            return undefined;
          }
        }
      }
    }

    return undefined;
  }

  private extractMainContent(html: string): string {
    // Try to find the main content area
    let content = '';
    
    // Try article tag first
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
      content = articleMatch[1];
    } else {
      // Try main tag
      const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
      if (mainMatch) {
        content = mainMatch[1];
      } else {
        // Try content div patterns
        const contentPatterns = [
          /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
          /<div[^>]*class="[^"]*article[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
          /<div[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
          /<div[^>]*id="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i
        ];
        
        for (const pattern of contentPatterns) {
          const match = html.match(pattern);
          if (match) {
            content = match[1];
            break;
          }
        }
        
        // Final fallback: extract all paragraphs
        if (!content) {
          const paragraphs = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
          if (paragraphs && paragraphs.length > 3) {
            content = paragraphs.slice(0, 15).join('\n');
          }
        }
      }
    }

    return content ? this.cleanHtmlPreserveFormatting(content) : '';
  }

  private cleanHtmlPreserveFormatting(html: string): string {
    return html
      // Remove scripts and styles completely
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      // Remove comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove unwanted elements but keep their content
      .replace(/<(nav|header|footer|aside|form)[^>]*>[\s\S]*?<\/\1>/gi, '')
      // Remove ads and social media
      .replace(/<div[^>]*class="[^"]*ad[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<div[^>]*class="[^"]*social[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      // Clean up attributes but preserve structure
      .replace(/<([^>]+)\s+class="[^"]*"([^>]*)>/gi, '<$1$2>')
      .replace(/<([^>]+)\s+id="[^"]*"([^>]*)>/gi, '<$1$2>')
      .replace(/<([^>]+)\s+style="[^"]*"([^>]*)>/gi, '<$1$2>')
      // Remove empty attributes
      .replace(/\s+>/g, '>')
      // Clean up whitespace
      .replace(/\n\s*\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private cleanText(text: string): string {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private createExcerpt(content: string, maxLength: number = 200): string {
    if (!content) return '';
    
    const cleaned = content.replace(/\s+/g, ' ').trim();
    if (cleaned.length <= maxLength) return cleaned;
    
    return cleaned.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  }

  private createFallbackResult(url: string): ReaderResult {
    const domain = new URL(url).hostname.replace('www.', '');
    
    // Check if this is a known problematic site
    const problematicSites = [
      'cnn.com', 'bbc.com', 'nytimes.com', 'wsj.com', 
      'washingtonpost.com', 'ft.com', 'bloomberg.com'
    ];
    
    const isProblematicSite = problematicSites.some(site => domain.includes(site));
    const reason = isProblematicSite 
      ? 'This news site uses advanced content protection'
      : 'Content extraction temporarily unavailable';
    
    return {
      title: 'Reader Mode Unavailable',
      content: `
        <div style="text-align: center; padding: 2rem; max-width: 500px; margin: 0 auto;">
          <h3>� ${reason}</h3>
          <p><strong>${domain}</strong> cannot be displayed in reader mode.</p>
          ${isProblematicSite ? 
            '<p><small>Major news sites often block content extraction to protect their business model.</small></p>' :
            '<p><small>This might be temporary due to rate limiting or technical issues.</small></p>'
          }
          <div style="margin: 2rem 0;">
            <a href="${url}" target="_blank" rel="noopener noreferrer" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 0.75rem 1.5rem; text-decoration: none; 
                      border-radius: 0.5rem; margin: 0.5rem; font-weight: 500;">
              📖 Read Full Article
            </a>
          </div>
          <small style="color: #666; line-height: 1.4;">
            Opening the original article supports the publisher and gives you the complete experience.
          </small>
        </div>
      `,
      excerpt: `Article from ${domain} - content protection active`,
      success: false,
      error: reason
    };
  }
}

export const readerService = new ReaderService();
