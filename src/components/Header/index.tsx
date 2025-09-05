import { useArticles } from '../../hooks/useArticles';
import './index.css';

function Header({
  children,
  title,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
}) {
  const { loading, fetchArticles } = useArticles();
  return (
    <header className="header">
      <button
        className="refresh-button"
        onClick={fetchArticles}
        disabled={loading}
      >
        {loading ? 'Loading...' : '🔄'}
      </button>
      {title}
      {children}
    </header>
  );
}

export { Header };
