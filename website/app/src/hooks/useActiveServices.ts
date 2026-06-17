import { useState, useEffect } from 'react';

const BASE = import.meta.env.VITE_API_URL ?? 'https://riyada-medical-backend-production.up.railway.app';

let cache: string[] | null = null;

export function useActiveServices() {
  const [slugs, setSlugs] = useState<string[]>(cache ?? []);
  const [loaded, setLoaded] = useState(!!cache);

  useEffect(() => {
    if (cache) { setSlugs(cache); setLoaded(true); return; }
    fetch(`${BASE}/services`)
      .then(r => r.json())
      .then((services: { slug: string }[]) => {
        cache = services.map(s => s.slug);
        setSlugs(cache);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return { slugs, loaded };
}
