import React, { useEffect, useRef, useState } from 'react';
import { readerService, type ReaderResult } from '../../services/readerService';
import './index.css';
import './reader.css';

interface ReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  url?: string;
  children?: React.ReactNode;
  showHeader?: boolean;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  children,
  showHeader = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [readerResult, setReaderResult] = useState<ReaderResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Post-process images to ensure proper sizing
  useEffect(() => {
    if (readerResult && modalRef.current) {
      const images = modalRef.current.querySelectorAll(
        '.modal__article-content img'
      );
      images.forEach((img) => {
        const imageElement = img as HTMLImageElement;
        imageElement.style.maxWidth = '100%';
        imageElement.style.maxHeight = '400px';
        imageElement.style.height = 'auto';
        imageElement.style.objectFit = 'contain';
        imageElement.style.display = 'block';
        imageElement.style.margin = '1rem auto';
      });
    }
  }, [readerResult]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Load article content when URL changes
  useEffect(() => {
    const loadArticleContent = async () => {
      if (!url) return;

      setIsLoading(true);
      setHasError(false);
      setReaderResult(null);

      try {
        const result = await readerService.extractArticle(url);
        console.log('📖 Reader result received:', {
          title: result.title,
          contentLength: result.content.length,
          success: result.success,
          hasError: !result.success,
        });
        setReaderResult(result);

        if (!result.success) {
          setHasError(true);
        }
      } catch (error) {
        console.error('Failed to load article:', error);
        setHasError(true);
        // Create a fallback result for display
        setReaderResult({
          title: 'Failed to Load Article',
          content: `
            <div style="text-align: center; padding: 2rem;">
              <h3>❌ Unable to Load Article</h3>
              <p>We couldn't extract the content from this article.</p>
              <p>This might be due to content protection or technical issues.</p>
              <br>
              <a href="${url}" target="_blank" rel="noopener noreferrer" 
                 style="display: inline-block; background: #007acc; color: white; padding: 0.75rem 1.5rem; 
                        text-decoration: none; border-radius: 0.5rem; margin: 0.5rem;">
                📖 Read Original Article
              </a>
            </div>
          `,
          excerpt: 'Article content could not be extracted',
          success: false,
          error: 'Content extraction failed',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (url && isOpen) {
      loadArticleContent();
    }
  }, [url, isOpen]);

  const retryLoad = () => {
    if (url && isOpen) {
      // Trigger the effect by updating state
      setIsLoading(true);
      setHasError(false);
      setReaderResult(null);

      // Reload will happen via useEffect
    }
  };

  if (!isOpen) return null;

  const shouldShowHeader = showHeader || title;

  return (
    <div className="modal">
      <div className="modal__content" ref={modalRef}>
        {shouldShowHeader && (
          <div className="modal__header">
            <h2 className="modal__title">
              {readerResult?.title || title || 'Article'}
            </h2>
            <button
              className="modal__close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}

        <div className="modal__body">
          {!shouldShowHeader && (
            <button
              className="modal__close-floating"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          )}

          {children ? (
            children
          ) : (
            <div className="modal__reader">
              {isLoading && (
                <div className="modal__loading">
                  <div className="modal__spinner"></div>
                  <div className="modal__loading-text">
                    <p>Extracting article content...</p>
                    <div className="modal__loading-subtitle">
                      Getting the best reading experience for you
                    </div>
                  </div>
                </div>
              )}

              {readerResult && !isLoading && (
                <article className="modal__article">
                  {readerResult.imageUrl && (
                    <div className="modal__article-image">
                      <img
                        src={readerResult.imageUrl}
                        alt={readerResult.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <header className="modal__article-header">
                    <h1 className="modal__article-title">
                      {readerResult.title}
                    </h1>

                    {(readerResult.author ||
                      readerResult.publishedDate ||
                      readerResult.siteName) && (
                      <div className="modal__article-meta">
                        {readerResult.author && (
                          <span className="modal__article-author">
                            By {readerResult.author}
                          </span>
                        )}
                        {readerResult.publishedDate && (
                          <span className="modal__article-date">
                            {new Date(
                              readerResult.publishedDate
                            ).toLocaleDateString()}
                          </span>
                        )}
                        {readerResult.siteName && (
                          <span className="modal__article-source">
                            {readerResult.siteName}
                          </span>
                        )}
                      </div>
                    )}
                  </header>

                  <div
                    className="modal__article-content"
                    dangerouslySetInnerHTML={{ __html: readerResult.content }}
                    style={{
                      overflow: 'hidden',
                    }}
                  />

                  <footer className="modal__article-footer">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal__original-link"
                    >
                      📖 Read Original Article
                    </a>

                    {hasError && (
                      <button className="modal__retry-btn" onClick={retryLoad}>
                        🔄 Retry Loading
                      </button>
                    )}
                  </footer>
                </article>
              )}

              {hasError && !readerResult && !isLoading && (
                <div className="modal__error">
                  <div className="modal__error-icon">❌</div>
                  <h3>Failed to Load Article</h3>
                  <p>We couldn't extract the content from this article.</p>
                  <div className="modal__error-actions">
                    <button className="modal__retry-btn" onClick={retryLoad}>
                      🔄 Retry
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal__external-btn"
                    >
                      📖 Open Original
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
