import { useEffect } from 'react';
import { useLocation } from 'react-router';

const API = import.meta.env.VITE_API_URL ?? 'https://riyada-medical-backend-production.up.railway.app';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (!pathname.startsWith('/admin')) {
      fetch(`${API}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname, referrer: document.referrer }),
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
