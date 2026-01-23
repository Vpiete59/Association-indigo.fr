import { Link } from 'react-router-dom';
import { Facebook, Mail, MapPin, ExternalLink, Heart, ChevronRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-indigo-primary text-white pt-16 pb-8 relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-peach-primary/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* COLONNE 1 : L'Association */}
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-bold text-2xl mb-2">Association Indigo</h3>
              <p className="text-indigo-100 text-sm font-body">
                Accompagner les particularités, valoriser les singularités.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-indigo-100">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-peach-primary" />
                <span className="text-sm">Preseau (59990)<br />Hauts-de-France</span>
              </div>
              <a 
                href="mailto:contact@association-indigo.fr" 
                className="flex items-center gap-3 text-indigo-100 hover:text-white transition-colors group"
              >
                <Mail className="w-5 h-5 flex-shrink-0 text-peach-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm">Nous écrire</span>
              </a>
            </div>

            <div className="pt-4">
              <a
                href="https://www.facebook.com/groups/467126453152213"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all duration-300 text-sm font-semibold"
              >
                <Facebook size={18} />
                Rejoindre le groupe
              </a>
            </div>
          </div>

          {/* COLONNE 2 : Navigation Rapide */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-peach-primary rounded-full"></span>
              Navigation
            </h4>
            <ul className="space-y-3 font-body text-indigo-100">
              <li>
                <Link to="/" className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                  <ChevronRight size={14} /> Accueil
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                  <ChevronRight size={14} /> Ressources & Articles
                </Link>
              </li>
              <li>
                <Link to="/evenements" className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                  <ChevronRight size={14} /> Agenda
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                  <ChevronRight size={14} /> Contact
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.helloasso.com/associations/indigo-preseau/formulaires/1"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2 font-bold text-peach-primary"
                >
                  <Heart size={14} fill="currentColor" /> Faire un don
                </a>
              </li>
            </ul>
          </div>

          {/* COLONNE 3 : FOCUS PARTENAIRE (KINEVIR) */}
          <div className="lg:pl-8">
            <h4 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-nature-primary rounded-full"></span>
              Partenaire Officiel
            </h4>
            
            {/* Carte Kinevir */}
            <div className="bg-white rounded-2xl p-6 shadow-xl transform hover:-translate-y-1 transition-transform duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-auto">
                    {/* Placeholder pour le logo si l'image ne charge pas, ou ajustement de la taille */}
                    <img
                        src="/kinevir-logo.webp"
                        alt="Logo Kinevir"
                        className="h-full w-auto object-contain"
                    />
                </div>
                <span className="bg-indigo-50 text-indigo-primary text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                  Soutien
                </span>
              </div>
              
              <h5 className="font-heading font-bold text-dark-text text-lg mb-2 group-hover:text-indigo-primary transition-colors">
                Kinevir
              </h5>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                La plateforme de référence pour la <strong className="text-indigo-primary">kinésithérapie en ligne</strong> et la téléconsultation.
              </p>
              
              <a
                href="https://kinevir.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-bold text-indigo-primary hover:text-peach-primary transition-colors"
              >
                Découvrir la plateforme <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>

        </div>

        {/* BARRE DU BAS : Copyright & Mentions légales */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-indigo-200">
          <p className="font-body text-center md:text-left">
            © {currentYear} Association Indigo. Association loi 1901.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link to="/politique-confidentialite" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
            <button 
              onClick={() => window.dispatchEvent(new Event('openCookieSettings'))}
              className="hover:text-white transition-colors"
            >
              Gérer les cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}