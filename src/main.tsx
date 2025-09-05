import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ArticlesProvider } from './contexts/ArticlesContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArticlesProvider>
      <App />
    </ArticlesProvider>
  </StrictMode>
);
