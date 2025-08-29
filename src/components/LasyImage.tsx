import { useEffect, useRef, useState } from "react";

// Lazy Image Component with Intersection Observer
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className: string;
  onError: () => void;
}> = ({ src, alt, className, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters the viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    onError();
  };

  if (hasError) {
    return (
      <div className="article-image-placeholder">
        📰
      </div>
    );
  }

  return (
    <div ref={imgRef} className={className} style={{ 
      backgroundColor: isLoaded ? 'transparent' : '#f1f5f9',
      position: 'relative',
      minHeight: '200px'
    }}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      )}
      {!isLoaded && isInView && !hasError && (
        <div className="image-loading-placeholder">
          <div className="image-spinner"></div>
        </div>
      )}
    </div>
  );
};

export { LazyImage };