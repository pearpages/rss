import { useState, useEffect } from 'react';
import { useArticles } from '../../hooks/useArticles';

function NewCounter() {
  const { articles: fetched } = useArticles();
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const updateScrolledCount = () => {
      // Get all article elements
      const articleElements = document.querySelectorAll('.article-card');

      let count = 0;
      articleElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isInViewportOrAbove = rect.top <= window.innerHeight;

        if (isInViewportOrAbove) {
          count++;
        }
      });

      setScrolled(count);
    };

    // Update on scroll
    const handleScroll = () => {
      updateScrolledCount();
    };

    // Reset and update on window resize
    const handleResize = () => {
      updateScrolledCount();
    };

    // Update initially and when articles change
    updateScrolledCount();

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [fetched.length]); // Re-run when articles change

  return (
    <div>
      {scrolled}/{fetched.length}
    </div>
  );
}
export { NewCounter };
