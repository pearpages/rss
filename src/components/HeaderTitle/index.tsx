import { getAppVersion } from '../../utils/version';
import './index.css';

function HeaderTitle({ onClick }: { onClick?: () => void }) {
  return (
    <h1 className="header-title" onClick={onClick ?? (() => {})}>
      <img src="/rss-classic-32.svg" alt="RSS" className="header-icon" />
      <div className="header-title__main">
        <div>News Aggregator</div>
        <div className="version">beta v{getAppVersion()}</div>
      </div>
      {onClick && <span className="back-indicator">← Back to feeds</span>}
    </h1>
  );
}

export { HeaderTitle };
