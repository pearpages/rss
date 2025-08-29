import { useState } from "react";
import { useIsInView } from "./useIsInView";
import "./index.css";

// Lazy Image Component with Intersection Observer
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className: string;
  onError: () => void;
}> = ({ src, alt, className, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { imgRef, isInView } = useIsInView();

  const handleImageError = () => {
    setHasError(true);
    onError();
  };

  if (hasError) {
    console.warn(`Image failed to load: ${src}`);
    return null;
  }

  return (
    <div
      ref={imgRef}
      className={`lazy-image ${
        isLoaded ? "lazy-image--loaded" : ""
      } ${
        isInView && !isLoaded && !hasError ? "lazy-image--loading" : ""
      } ${className}`}
    >
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image__img ${
            isLoaded ? "lazy-image__img--loaded" : ""
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
        />
      )}
      {!isLoaded && isInView && !hasError && (
        <div className="lazy-image__loading">
          <div className="lazy-image__spinner"></div>
        </div>
      )}
    </div>
  );
};

export { LazyImage };
