import { useState } from 'react';
import './index.css';

interface MenuProps {
  onFilterSources?: (sources: string[]) => void;
  onViewSaved?: () => void;
  availableSources?: string[];
  selectedSources?: string[];
  showSavedOnly?: boolean;
  ignoredArticlesCount?: number;
}

export const Menu = ({ 
  onFilterSources, 
  onViewSaved, 
  availableSources = [], 
  selectedSources = [],
  showSavedOnly = false,
  ignoredArticlesCount = 0
}: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSourceToggle = (sourceName: string) => {
    if (!onFilterSources) return;
    
    const newSelectedSources = selectedSources.includes(sourceName)
      ? selectedSources.filter(s => s !== sourceName)
      : [...selectedSources, sourceName];
    
    onFilterSources(newSelectedSources);
  };

  const handleViewSaved = () => {
    onViewSaved?.();
    closeMenu();
  };

  return (
    <>
      <button 
        className="menu-trigger"
        onClick={toggleMenu}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        ☰
      </button>

      {isOpen && (
        <>
          <div className="menu-overlay" onClick={closeMenu} />
          <div className="menu-panel">
            <div className="menu-header">
              <h3>Menu</h3>
              <button 
                className="menu-close"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="menu-content">
              <div className="menu-section">
                <button 
                  className={`menu-item ${showSavedOnly ? 'active' : ''}`}
                  onClick={handleViewSaved}
                >
                  <span className="menu-icon">⭐</span>
                  {showSavedOnly ? 'Back to All Articles' : 'Saved Articles'}
                </button>
              </div>

              {availableSources.length > 0 && (
                <div className="menu-section">
                  <h4 className="menu-section-title">Filter Sources</h4>
                  {availableSources.map((source) => (
                    <label key={source} className="menu-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(source)}
                        onChange={() => handleSourceToggle(source)}
                        className="menu-checkbox"
                      />
                      <span className="menu-checkbox-label">{source}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="menu-section">
                <div className="menu-stats">
                  <div className="menu-stat-item">
                    <span className="menu-stat-icon">👁️‍🗨️</span>
                    <span className="menu-stat-text">
                      {ignoredArticlesCount} article{ignoredArticlesCount !== 1 ? 's' : ''} read/ignored
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
