import './index.css';

const areCookiesEnabled = (): boolean => {
  if (typeof document === 'undefined') {
    return false;
  }

  document.cookie = 'testcookie=1';
  return document.cookie.indexOf('testcookie=') !== -1;
};

function CookieNotification() {
  return (
    !areCookiesEnabled && (
      <div className="cookie-notification">
        <p>
          🍪 This app uses cookies and browser storage to save your preferences.
          Please enable cookies for the best experience.
        </p>
      </div>
    )
  );
}

export { CookieNotification };
