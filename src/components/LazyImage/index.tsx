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

  return (
    <div
      ref={imgRef}
      className={`lazy-image ${
        isLoaded ? "lazy-image--loaded" : ""
      } ${className}`}
    >
      {hasError && (
        <div className="lazy-image__placeholder lazy-image__placeholder--error">
          ❌
        </div>
      )}
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
