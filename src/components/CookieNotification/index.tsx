import { areCookiesEnabled } from '../../services/cookieService';

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
