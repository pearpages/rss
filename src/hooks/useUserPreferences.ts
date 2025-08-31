import { useState, useEffect, useCallback } from 'react';
import { cookieService } from '../services/cookieService';
import type { UserPreferences } from '../services/cookieService';

/**
 * Custom hook for managing user preferences with cookies and localStorage
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => 
    cookieService.getPreferences()
  );
  
  const [savedArticles, setSavedArticles] = useState<string[]>(() =>
    cookieService.getSavedArticles()
  );

  const [ignoredArticles, setIgnoredArticles] = useState<string[]>(() =>
    cookieService.getIgnoredArticles()
  );

  // Reload preferences from storage
  const reloadPreferences = useCallback(() => {
    setPreferences(cookieService.getPreferences());
    setSavedArticles(cookieService.getSavedArticles());
    setIgnoredArticles(cookieService.getIgnoredArticles());
  }, []);

  // Update preferences and save to cookies
  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    cookieService.savePreferences(newPreferences);
    reloadPreferences();
  }, [reloadPreferences]);

  // Source filter management
  const selectedSources = preferences.selectedSources;
  
  const updateSelectedSources = useCallback((sources: string[]) => {
    updatePreferences({ selectedSources: sources });
  }, [updatePreferences]);

  const toggleSource = useCallback((sourceName: string) => {
    const newSelectedSources = selectedSources.includes(sourceName)
      ? selectedSources.filter(s => s !== sourceName)
      : [...selectedSources, sourceName];
    
    updateSelectedSources(newSelectedSources);
  }, [selectedSources, updateSelectedSources]);

  // Saved articles management (localStorage)
  const saveArticle = useCallback((articleLink: string) => {
    cookieService.saveArticle(articleLink);
    setSavedArticles(cookieService.getSavedArticles());
  }, []);

  const unsaveArticle = useCallback((articleLink: string) => {
    cookieService.unsaveArticle(articleLink);
    setSavedArticles(cookieService.getSavedArticles());
  }, []);

  const toggleSaveArticle = useCallback((articleLink: string) => {
    if (cookieService.isArticleSaved(articleLink)) {
      unsaveArticle(articleLink);
    } else {
      saveArticle(articleLink);
    }
  }, [saveArticle, unsaveArticle]);

  const isArticleSaved = useCallback((articleLink: string) => {
    return cookieService.isArticleSaved(articleLink);
  }, []);

  // Ignored articles management (localStorage)
  const ignoreArticle = useCallback((articleLink: string) => {
    cookieService.ignoreArticle(articleLink);
    setIgnoredArticles(cookieService.getIgnoredArticles());
  }, []);

  const unignoreArticle = useCallback((articleLink: string) => {
    cookieService.unignoreArticle(articleLink);
    setIgnoredArticles(cookieService.getIgnoredArticles());
  }, []);

  const toggleIgnoreArticle = useCallback((articleLink: string) => {
    if (cookieService.isArticleIgnored(articleLink)) {
      unignoreArticle(articleLink);
    } else {
      ignoreArticle(articleLink);
    }
  }, [ignoreArticle, unignoreArticle]);

  const isArticleIgnored = useCallback((articleLink: string) => {
    return cookieService.isArticleIgnored(articleLink);
  }, []);

  // Clean up ignored articles based on current articles
  const cleanupIgnoredArticles = useCallback((currentArticleLinks: string[]) => {
    cookieService.cleanupIgnoredArticles(currentArticleLinks);
    setIgnoredArticles(cookieService.getIgnoredArticles());
  }, []);

  // Theme management
  const theme = preferences.theme || 'light';

  const updateTheme = useCallback((newTheme: 'light' | 'dark') => {
    updatePreferences({ theme: newTheme });
  }, [updatePreferences]);

  const toggleTheme = useCallback(() => {
    updateTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, updateTheme]);

  // Clear all preferences
  const clearAllPreferences = useCallback(() => {
    cookieService.clearPreferences();
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('rss_saved_articles');
      localStorage.removeItem('rss_ignored_articles');
    }
    reloadPreferences();
  }, [reloadPreferences]);

  // Effect to sync with storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rss_saved_articles') {
        setSavedArticles(cookieService.getSavedArticles());
      } else if (e.key === 'rss_ignored_articles') {
        setIgnoredArticles(cookieService.getIgnoredArticles());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    // Full preferences object
    preferences,
    updatePreferences,
    
    // Source filtering
    selectedSources,
    updateSelectedSources,
    toggleSource,
    
    // Saved articles
    savedArticles,
    saveArticle,
    unsaveArticle,
    toggleSaveArticle,
    isArticleSaved,
    
    // Ignored articles
    ignoredArticles,
    ignoreArticle,
    unignoreArticle,
    toggleIgnoreArticle,
    isArticleIgnored,
    cleanupIgnoredArticles,
    
    // Theme
    theme,
    updateTheme,
    toggleTheme,
    
    // Utility functions
    clearAllPreferences,
    reloadPreferences,
    
    // Debug info
    cookiesEnabled: cookieService.areCookiesEnabled(),
  };
};

/**
 * Simplified hook for just source filtering
 */
export const useSourceFilter = () => {
  const { selectedSources, updateSelectedSources, toggleSource } = useUserPreferences();
  
  return {
    selectedSources,
    updateSelectedSources,
    toggleSource,
  };
};

/**
 * Simplified hook for just saved articles
 */
export const useSavedArticles = () => {
  const { 
    savedArticles, 
    saveArticle, 
    unsaveArticle, 
    toggleSaveArticle, 
    isArticleSaved 
  } = useUserPreferences();
  
  return {
    savedArticles,
    saveArticle,
    unsaveArticle,
    toggleSaveArticle,
    isArticleSaved,
  };
};

/**
 * Simplified hook for just ignored articles
 */
export const useIgnoredArticles = () => {
  const { 
    ignoredArticles, 
    ignoreArticle, 
    unignoreArticle, 
    toggleIgnoreArticle, 
    isArticleIgnored,
    cleanupIgnoredArticles
  } = useUserPreferences();
  
  return {
    ignoredArticles,
    ignoreArticle,
    unignoreArticle,
    toggleIgnoreArticle,
    isArticleIgnored,
    cleanupIgnoredArticles,
  };
};
