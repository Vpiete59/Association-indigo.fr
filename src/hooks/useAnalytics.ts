import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const VISITOR_ID_KEY = 'indigo_visitor_id';

function getOrCreateVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    // Fallback si localStorage indisponible (mode privé strict)
    return 'no-storage';
  }
}

// Hook : tracke chaque changement de route, sauf /admin
export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return;

    // Pendant le prerender Puppeteer, on n'a pas besoin d'envoyer des hits
    if (navigator.userAgent.includes('HeadlessChrome')) return;

    const visitorId = getOrCreateVisitorId();
    supabase
      .from('page_views')
      .insert([{ path, visitor_id: visitorId }])
      .then(({ error }) => {
        if (error) console.debug('[analytics] insert failed:', error.message);
      });
  }, [location.pathname]);
}
