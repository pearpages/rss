# Mo## Features

- 📱 **Mobile First**: Fullscreen on mobile, responsive on desktop
- 🎨 **Modern Design**: Beautiful gradients, smooth animations, and backdrop blur
- 🚀 **Easy to Close**: Floating close button or swipe gestures
- ⌨️ **Keyboard Support**: Close with Escape key
- 🖱️ **Click Outside**: Close by clicking outside the modal (desktop)
- 🔄 **Loading States**: Built-in loading spinner and error handling for iframes
- 🛡️ **Smart Proxy System**: Bypasses iframe restrictions using multiple fallback methods
- 📖 **Reader Mode**: Extracts clean article content when sites block iframes
- 🔄 **Multiple Fallbacks**: Tries direct iframe → Reader API → Proxy services → External link
- 🎯 **Accessibility**: Proper ARIA labels and focus management
- 🛡️ **Security**: Sandboxed iframes with security restrictions
- 🎛️ **Minimal UI**: Optional header, prioritizes contentt

A mobile-first, fullscreen modal component designed for displaying iframes and other content in your React application.

## Features

- 📱 **Mobile First**: Fullscreen on mobile, responsive on desktop
- 🎨 **Modern Design**: Beautiful gradients, smooth animations, and backdrop blur
- � **Easy to Close**: Floating close button or swipe gestures
- ⌨️ **Keyboard Support**: Close with Escape key
- 🖱️ **Click Outside**: Close by clicking outside the modal (desktop)
- 🔄 **Loading States**: Built-in loading spinner and error handling for iframes
- 🛡️ **Smart Error Handling**: Detects and explains iframe blocking (X-Frame-Options)
- 🎯 **Accessibility**: Proper ARIA labels and focus management
- 🛡️ **Security**: Sandboxed iframes with security restrictions
- 🎛️ **Minimal UI**: Optional header, prioritizes content

## Usage

### Basic Usage (Fullscreen, no header)

```tsx
import { useState } from 'react';
import { Modal } from './components/Modal';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Article</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        src="https://example.com/article"
      />
    </div>
  );
}
```

### Usage with Header (when you need a title)

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Article Title"
  src="https://example.com/article"
  showHeader={true}
/>
```

### Usage with Custom Content

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  showHeader={true}
  title="Settings"
>
  <div style={{ padding: '2rem' }}>
    <p>Your custom content goes here!</p>
  </div>
</Modal>
```

## Props

| Prop         | Type         | Default | Description                                      |
| ------------ | ------------ | ------- | ------------------------------------------------ |
| `isOpen`     | `boolean`    | -       | Controls whether the modal is visible            |
| `onClose`    | `() => void` | -       | Callback function called when modal should close |
| `title`      | `string?`    | -       | Optional title (forces header to show)           |
| `src`        | `string?`    | -       | URL for iframe content                           |
| `children`   | `ReactNode?` | -       | Custom content (used when `src` is not provided) |
| `showHeader` | `boolean?`   | `false` | Force show/hide header (title overrides this)    |

## Design Philosophy

### Mobile First

- **Fullscreen on mobile** for maximum content visibility
- **Floating close button** that's easy to tap
- **Minimal UI** that doesn't compete with content
- **No unnecessary padding** or borders on small screens

### Desktop Enhanced

- **Centered modal** with rounded corners and shadows
- **Larger close buttons** and better spacing
- **More decorative elements** when screen space allows

## Behavior

### Header Logic

- **No header by default** (`showHeader={false}`)
- **Header shows** if `title` is provided OR `showHeader={true}`
- **Floating close button** appears when no header is shown
- **Header close button** appears when header is shown

## Styling

The component uses BEM methodology for CSS classes:

- `.modal` - Main backdrop container
- `.modal__content` - Modal content container
- `.modal__header` - Header section with title and close button
- `.modal__title` - Title text
- `.modal__close` - Close button
- `.modal__body` - Main content area
- `.modal__iframe` - Iframe element
- `.modal__loading` - Loading state overlay
- `.modal__error` - Error state overlay

## Features in Detail

### Loading States

- Shows a spinner while iframe content is loading
- Displays error message if content fails to load
- Includes retry functionality for failed loads

### Responsive Design

- Adapts to mobile screens with optimized spacing
- Maintains readability across different viewport sizes
- Touch-friendly button sizes on mobile devices

### Security

- Iframes are sandboxed with restricted permissions
- Only allows necessary iframe capabilities (scripts, forms, popups)
- Lazy loading for better performance

### Accessibility

- Escape key closes the modal
- Focus management
- Proper ARIA labels
- Keyboard navigation support

## Browser Support

- Modern browsers with support for:
  - CSS backdrop-filter (with fallback)
  - CSS animations
  - ES6+ JavaScript features
