/**
 * Cookie Service for managing user preferences
 * Handles saving and retrieving user settings like source filters, themes, etc.
 */

export interface UserPreferences {
  selectedSources: string[];
  theme?: 'light' | 'dark';
  lastUpdated: string;
}

class CookieService {
  private readonly PREFERENCES_KEY = 'rss_user_preferences';
  private readonly DEFAULT_EXPIRY_DAYS = 365;

  /**
   * Get all user preferences from cookies
   */
  getPreferences(): UserPreferences {
    const defaultPreferences: UserPreferences = {
      selectedSources: [],
      theme: 'light',
      lastUpdated: new Date().toISOString(),
    };

    try {
      const cookieValue = this.getCookie(this.PREFERENCES_KEY);
      if (!cookieValue) {
        return defaultPreferences;
      }

      const parsed = JSON.parse(decodeURIComponent(cookieValue));

      // Validate the structure and merge with defaults
      return {
        selectedSources: Array.isArray(parsed.selectedSources)
          ? parsed.selectedSources
          : [],
        theme: parsed.theme === 'dark' ? 'dark' : 'light',
        lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      };
    } catch (error) {
      console.warn('Failed to parse user preferences from cookies:', error);
      return defaultPreferences;
    }
  }

  /**
   * Save user preferences to cookies
   */
  savePreferences(preferences: Partial<UserPreferences>): void {
    try {
      const currentPreferences = this.getPreferences();
      const updatedPreferences: UserPreferences = {
        ...currentPreferences,
        ...preferences,
        lastUpdated: new Date().toISOString(),
      };

      const cookieValue = encodeURIComponent(
        JSON.stringify(updatedPreferences)
      );
      this.setCookie(
        this.PREFERENCES_KEY,
        cookieValue,
        this.DEFAULT_EXPIRY_DAYS
      );
    } catch (error) {
      console.error('Failed to save user preferences to cookies:', error);
    }
  }

  /**
   * Get selected sources from preferences
   */
  getSelectedSources(): string[] {
    return this.getPreferences().selectedSources;
  }

  /**
   * Save selected sources to preferences
   */
  saveSelectedSources(sources: string[]): void {
    this.savePreferences({ selectedSources: sources });
  }

  /**
   * Get saved articles from localStorage
   */
  getSavedArticles(): string[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const saved = localStorage.getItem('rss_saved_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  /**
   * Add an article to saved list in localStorage
   */
  saveArticle(articleLink: string): void {
    const savedArticles = this.getSavedArticles();
    if (!savedArticles.includes(articleLink)) {
      const updated = [...savedArticles, articleLink];
      try {
        localStorage.setItem('rss_saved_articles', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save article:', error);
      }
    }
  }

  /**
   * Remove an article from saved list in localStorage
   */
  unsaveArticle(articleLink: string): void {
    const savedArticles = this.getSavedArticles();
    const updated = savedArticles.filter((link) => link !== articleLink);
    try {
      localStorage.setItem('rss_saved_articles', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to unsave article:', error);
    }
  }

  /**
   * Check if an article is saved
   */
  isArticleSaved(articleLink: string): boolean {
    return this.getSavedArticles().includes(articleLink);
  }

  /**
   * Get ignored articles from localStorage
   */
  getIgnoredArticles(): string[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const ignored = localStorage.getItem('rss_ignored_articles');
      return ignored ? JSON.parse(ignored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Add an article to ignored list in localStorage
   */
  ignoreArticle(articleLink: string): void {
    const ignoredArticles = this.getIgnoredArticles();
    if (!ignoredArticles.includes(articleLink)) {
      const updated = [...ignoredArticles, articleLink];
      try {
        localStorage.setItem('rss_ignored_articles', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to ignore article:', error);
      }
    }
  }

  /**
   * Remove an article from ignored list in localStorage
   */
  unignoreArticle(articleLink: string): void {
    const ignoredArticles = this.getIgnoredArticles();
    const updated = ignoredArticles.filter((link) => link !== articleLink);
    try {
      localStorage.setItem('rss_ignored_articles', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to unignore article:', error);
    }
  }

  /**
   * Check if an article is ignored
   */
  isArticleIgnored(articleLink: string): boolean {
    return this.getIgnoredArticles().includes(articleLink);
  }

  /**
   * Clean up ignored articles that are no longer in the current feed
   * This prevents the ignored list from growing indefinitely with old articles
   */
  cleanupIgnoredArticles(currentArticleLinks: string[]): void {
    const ignoredArticles = this.getIgnoredArticles();
    const validIgnoredArticles = ignoredArticles.filter((link) =>
      currentArticleLinks.includes(link)
    );

    // Only update if there are articles to remove
    if (validIgnoredArticles.length !== ignoredArticles.length) {
      try {
        localStorage.setItem(
          'rss_ignored_articles',
          JSON.stringify(validIgnoredArticles)
        );
        console.log(
          `Cleaned up ${ignoredArticles.length - validIgnoredArticles.length} old ignored articles`
        );
      } catch (error) {
        console.error('Failed to cleanup ignored articles:', error);
      }
    }
  }

  /**
   * Get theme preference
   */
  getTheme(): 'light' | 'dark' {
    return this.getPreferences().theme || 'light';
  }

  /**
   * Save theme preference
   */
  saveTheme(theme: 'light' | 'dark'): void {
    this.savePreferences({ theme });
  }

  /**
   * Clear all user preferences
   */
  clearPreferences(): void {
    this.deleteCookie(this.PREFERENCES_KEY);
  }

  /**
   * Private helper method to get a cookie value
   */
  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null; // Server-side rendering support
    }

    const nameEQ = name + '=';
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  /**
   * Private helper method to set a cookie
   */
  private setCookie(name: string, value: string, days: number): void {
    if (typeof document === 'undefined') {
      return; // Server-side rendering support
    }

    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }

    // Set cookie with secure flags for production
    const isSecure = window.location.protocol === 'https:';
    const secureFlag = isSecure ? '; Secure' : '';
    const sameSiteFlag = '; SameSite=Lax';

    document.cookie = `${name}=${value}${expires}; path=/${secureFlag}${sameSiteFlag}`;
  }

  /**
   * Private helper method to delete a cookie
   */
  private deleteCookie(name: string): void {
    this.setCookie(name, '', -1);
  }

  /**
   * Check if cookies are enabled in the browser
   */
  areCookiesEnabled(): boolean {
    if (typeof document === 'undefined') {
      return false;
    }

    try {
      const testKey = 'cookieTest';
      this.setCookie(testKey, 'test', 1);
      const isEnabled = this.getCookie(testKey) === 'test';
      this.deleteCookie(testKey);
      return isEnabled;
    } catch {
      return false;
    }
  }
}

// Export a singleton instance
export const cookieService = new CookieService();

// Named exports for convenience
export const {
  getPreferences,
  savePreferences,
  getSelectedSources,
  saveSelectedSources,
  getSavedArticles,
  saveArticle,
  unsaveArticle,
  isArticleSaved,
  getIgnoredArticles,
  ignoreArticle,
  unignoreArticle,
  isArticleIgnored,
  cleanupIgnoredArticles,
  getTheme,
  saveTheme,
  clearPreferences,
  areCookiesEnabled,
} = cookieService;
