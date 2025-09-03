/**
 * Utility functions for generating consistent colors for sources
 */

// Predefined color palette with good contrast and readability
const COLOR_PALETTE = [
  '#667eea', // Purple-blue (original)
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#eab308', // Yellow
];

/**
 * Generate a consistent color for a given source name
 * Uses direct mapping for known sources to ensure uniqueness, falls back to hash for unknown sources
 */
export function getSourceColor(sourceName: string): string {
  // Direct mapping for known RSS sources to ensure uniqueness
  const sourceColorMap: Record<string, string> = {
    'BBC News': '#667eea', // Purple-blue
    'Hacker News': '#10b981', // Emerald
    'The Guardian': '#f59e0b', // Amber
    'Dev.to': '#ef4444', // Red
    'NASA News': '#8b5cf6', // Violet
    'Al Jazeera': '#06b6d4', // Cyan
    'La Vanguardia': '#f97316', // Orange
    RAC1: '#84cc16', // Lime
    'Mundo Deportivo': '#ec4899', // Pink
  };

  // Check if we have a direct mapping for this source
  if (sourceColorMap[sourceName]) {
    return sourceColorMap[sourceName];
  }

  // Fallback to hash function for unknown sources
  let hash = 0;
  const str = sourceName.toLowerCase();

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) + hash + char;
  }

  hash = hash ^ (hash >>> 16);
  hash = hash * 0x85ebca6b;
  hash = hash ^ (hash >>> 13);
  hash = hash * 0xc2b2ae35;
  hash = hash ^ (hash >>> 16);

  const colorIndex = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[colorIndex];
}

/**
 * Get a lighter version of the color for hover states
 */
export function getLighterColor(color: string): string {
  // Convert hex to RGB, increase brightness, and convert back
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Increase brightness by 20%
  const newR = Math.min(255, Math.round(r * 1.2));
  const newG = Math.min(255, Math.round(g * 1.2));
  const newB = Math.min(255, Math.round(b * 1.2));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Determine if a color is light or dark for text contrast
 */
export function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
