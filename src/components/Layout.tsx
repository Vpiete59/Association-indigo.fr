import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { css, AtelierHeader, AtelierFooter } from '../atelier/kit';

export default function Layout() {
  const { pathname, hash } = useLocation();

  // Tracking analytics anonyme (exclut /admin, géré dans le hook)
  useAnalytics();

  // Changement de page : en haut de page, ou sur l'ancre demandée (#ateliers…)
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return (
    <div className="atelier min-h-screen flex flex-col">
      <style>{css}</style>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-extrabold">
        Aller au contenu
      </a>
      <AtelierHeader />
      <main id="contenu" className="flex-grow">
        <Outlet />
      </main>
      <AtelierFooter />
    </div>
  );
}
