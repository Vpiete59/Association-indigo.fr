import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Settings, Check } from 'lucide-react';

type CookieConsent = {
  essential: boolean;
  clarity: boolean;
};

const COOKIE_CONSENT_KEY = 'indigo_cookie_consent';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true,
    clarity: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      const parsed = JSON.parse(savedConsent) as CookieConsent;
      setConsent(parsed);
      loadScripts(parsed);
    }
  }, []);

  const loadScripts = (consent: CookieConsent) => {
    // Microsoft Clarity
    if (consent.clarity && !document.getElementById('clarity-script')) {
      const clarityId = import.meta.env.VITE_CLARITY_ID;
      if (clarityId) {
        const script = document.createElement('script');
        script.id = 'clarity-script';
        script.innerHTML = `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `;
        document.head.appendChild(script);
      }
    }
  };

  const saveConsent = (newConsent: CookieConsent) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
    setConsent(newConsent);
    loadScripts(newConsent);
    setShowBanner(false);
    setShowDetails(false);
  };

  const acceptAll = () => {
    saveConsent({ essential: true, clarity: true });
  };

  const refuseAll = () => {
    saveConsent({ essential: true, clarity: false });
  };

  const saveCustom = () => {
    saveConsent(consent);
  };

  // Fonction pour rouvrir le bandeau (appelée depuis le footer)
  useEffect(() => {
    const handleOpenCookieSettings = () => {
      setShowBanner(true);
      setShowDetails(true);
    };
    window.addEventListener('openCookieSettings', handleOpenCookieSettings);
    return () => window.removeEventListener('openCookieSettings', handleOpenCookieSettings);
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-primary/10 p-2 rounded-full">
                <Cookie className="text-indigo-primary" size={24} />
              </div>
              <h2 className="font-heading font-bold text-xl text-dark-text">
                Gestion des cookies
              </h2>
            </div>
            <button
              onClick={refuseAll}
              className="text-dark-text/50 hover:text-dark-text transition-colors"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Description */}
          <p className="font-body text-dark-text/80 mb-6">
            Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic de notre site. 
            Vous pouvez choisir les cookies que vous acceptez.{' '}
            <Link to="/politique-confidentialite" className="text-indigo-primary hover:underline">
              En savoir plus
            </Link>
          </p>

          {/* Détails des cookies */}
          {showDetails && (
            <div className="space-y-4 mb-6 border-t border-b border-gray-100 py-4">
              {/* Cookies essentiels */}
              <div className="flex items-center justify-between p-4 bg-light-bg rounded-xl">
                <div>
                  <h3 className="font-heading font-semibold text-dark-text">Cookies essentiels</h3>
                  <p className="font-body text-sm text-dark-text/60">
                    Nécessaires au fonctionnement du site (préférences)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-dark-text/60">Toujours actifs</span>
                  <div className="w-12 h-6 bg-nature-primary rounded-full flex items-center justify-end px-1">
                    <Check size={16} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Microsoft Clarity */}
              <div className="flex items-center justify-between p-4 bg-light-bg rounded-xl">
                <div>
                  <h3 className="font-heading font-semibold text-dark-text">Microsoft Clarity</h3>
                  <p className="font-body text-sm text-dark-text/60">
                    Analyse du comportement utilisateur pour améliorer le site
                  </p>
                </div>
                <button
                  onClick={() => setConsent({ ...consent, clarity: !consent.clarity })}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                    consent.clarity ? 'bg-nature-primary justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>
            </div>
          )}

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!showDetails ? (
              <>
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-dark-text font-body font-semibold rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings size={18} />
                  Personnaliser
                </button>
                <button
                  onClick={refuseAll}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-dark-text font-body font-semibold rounded-full hover:bg-gray-50 transition-colors"
                >
                  Tout refuser
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-6 py-3 bg-indigo-primary text-white font-body font-semibold rounded-full hover:bg-indigo-primary/90 transition-colors"
                >
                  Tout accepter
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={refuseAll}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-dark-text font-body font-semibold rounded-full hover:bg-gray-50 transition-colors"
                >
                  Tout refuser
                </button>
                <button
                  onClick={saveCustom}
                  className="flex-1 px-6 py-3 bg-indigo-primary text-white font-body font-semibold rounded-full hover:bg-indigo-primary/90 transition-colors"
                >
                  Enregistrer mes choix
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
