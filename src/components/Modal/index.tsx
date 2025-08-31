import { useEffect, useRef, useState } from 'react';
import './index.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  src?: string;
  children?: React.ReactNode;
  showHeader?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  src,
  children,
  showHeader = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState<'network' | 'blocked' | 'unknown'>('unknown');
  const [isLoadingProxy, setIsLoadingProxy] = useState(false);
  const [proxiedContent, setProxiedContent] = useState<string | null>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle outside click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  // Reset loading states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsLoaded(false);
      setHasError(false);
      setErrorType('unknown');
      setIsLoadingProxy(false);
      setProxiedContent(null);
    }
  }, [isOpen, src]);

  const handleIframeLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    setErrorType('unknown');
  };

  const handleIframeError = () => {
    console.log('🚫 Iframe failed to load (X-Frame-Options blocked), will try alternative loading method');
    setHasError(true);
    setIsLoaded(false);
    setErrorType('blocked');
    
    // Show user we're trying an alternative immediately
    setIsLoadingProxy(true);
    
   
  };



  const getErrorMessage = () => {
    if (isLoadingProxy) {
      return {
        title: 'Loading Alternative View',
        message: 'The original site blocked embedding, trying to load content through a proxy...',
        icon: '🔄'
      };
    }
    
    switch (errorType) {
      case 'blocked':
        return {
          title: 'Content Blocked',
          message: 'This website doesn\'t allow embedding. We\'re automatically trying an alternative loading method.',
          icon: '🚫'
        };
      case 'network':
        return {
          title: 'Network Error',
          message: 'Failed to load the content. Please check your internet connection and try again.',
          icon: '🌐'
        };
      default:
        return {
          title: 'Loading Failed',
          message: 'Could not load the content. Try the alternative loading method or open in a new tab.',
          icon: '⚠️'
        };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div 
        className="modal__content" 
        ref={modalRef}
      >
        {/* Header - only show if explicitly requested or if there's a title */}
        {(showHeader || title) && (
          <div className="modal__header">
            {title && <h2 className="modal__title">{title}</h2>}
            <button 
              className="modal__close" 
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        {/* Floating close button for headerless modal */}
        {!showHeader && !title && (
          <button 
            className="modal__close-floating" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        {/* Body */}
        <div className="modal__body">
          {src ? (
            <div className="modal__iframe-container">
              {/* Loading indicator */}
              {(!isLoaded && !hasError) || isLoadingProxy ? (
                <div className="modal__loading">
                  <div className="modal__spinner"></div>
                  <p>
                    {isLoadingProxy 
                      ? '🔄 Site blocked embedding, trying alternative loading...' 
                      : 'Loading content...'
                    }
                  </p>
                </div>
              ) : null}

              {/* Error state */}
              {hasError && !isLoadingProxy && (
                <div className="modal__error">
                  <div className="modal__error-icon">{getErrorMessage().icon}</div>
                  <h3>{getErrorMessage().title}</h3>
                  <p>{getErrorMessage().message}</p>
                  <div className="modal__error-actions">
                    <button 
                      className="modal__retry-btn"
                      onClick={() => {
                        setHasError(false);
                        setIsLoaded(false);
                        setErrorType('unknown');
                        setProxiedContent(null);
                      }}
                    >
                      Retry Original
                    </button>
                    <button
                      className="modal__proxy-btn"
                      onClick={() => {}}
                      disabled={isLoadingProxy}
                    >
                      {isLoadingProxy ? 'Loading...' : 'Try Alternative Loading'}
                    </button>
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal__external-btn"
                    >
                      Open in New Tab
                    </a>
                  </div>
                </div>
              )}

              {/* Iframe */}
              <iframe
                ref={iframeRef}
                src={proxiedContent || src}
                className={`modal__iframe ${isLoaded ? 'modal__iframe--loaded' : ''}`}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={title || 'Modal content'}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
              />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};
