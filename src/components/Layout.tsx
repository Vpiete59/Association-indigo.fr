import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Facebook, Settings, Heart, BookOpen, CalendarHeart, MessageCircleQuestion } from 'lucide-react';
import Footer from './Footer';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Fermer le menu mobile au changement de page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // --- NAVIGATION CONFIGURATION ---
  const navItems = [
    { 
      name: "S'informer",      // Au lieu de "Ressources"
      href: '/articles',
      icon: BookOpen           // Icône livre
    }, 
    { 
      name: 'Nos événements',  // Au lieu de "Agenda"
      href: '/evenements',
      icon: CalendarHeart      // Icône calendrier avec un cœur (plus associatif)
    },   
    { 
      name: 'Une question ?',  // Au lieu de "Contact" -> Plus invitant
      href: '/contact',
      icon: MessageCircleQuestion // Icône bulle de dialogue
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-body text-dark-text">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
        
        {/* Ligne arc-en-ciel supérieure */}
        <div className="h-1.5 w-full bg-gradient-to-r from-nature-primary via-peach-primary to-indigo-primary"></div>

        <nav className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            
            {/* LOGO */}
            <Link
              to="/"
              className="font-heading text-xl md:text-2xl group focus:outline-none flex items-center gap-1"
              aria-label="Association Indigo - Retour à l'accueil"
            >
              <span className="font-semibold text-dark-text">Association</span>
              <span className="font-bold text-indigo-primary group-hover:text-peach-primary transition-colors duration-300">Indigo</span>
            </Link>

            {/* Navigation Desktop (Avec icônes maintenant !) */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-heading text-sm transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-indigo-primary/10 text-indigo-primary font-bold shadow-sm'
                        : 'text-dark-text font-semibold hover:text-indigo-primary hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} className={isActive(item.href) ? "text-indigo-primary" : "text-gray-400 group-hover:text-indigo-primary"} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Actions Droite */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/groups/467126453152213"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#1877F2] transition-colors duration-300 p-2 rounded-full hover:bg-[#1877F2]/10"
                title="Rejoindre le groupe Facebook"
              >
                <Facebook size={20} />
              </a>
              
              {/* Admin */}
              <Link
                to="/admin"
                className="text-gray-400 hover:text-dark-text transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
                title="Administration"
              >
                <Settings size={20} />
              </Link>

              {/* Bouton CTA "Nous soutenir" */}
              <a
                href="https://www.helloasso.com/associations/indigo-preseau/formulaires/1"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center gap-2 px-6 py-2.5 bg-nature-primary text-white font-heading font-bold rounded-full hover:bg-nature-primary/90 hover:scale-105 transition-all shadow-md text-sm"
              >
                <Heart size={16} fill="currentColor" />
                Nous soutenir
              </a>
            </div>

            {/* Bouton Burger Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-dark-text p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Menu Mobile */}
          <div 
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-[30rem] opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="flex flex-col space-y-2 pb-4 border-t border-gray-100 pt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-heading transition-colors ${
                       isActive(item.href) 
                       ? 'bg-indigo-primary/10 text-indigo-primary font-bold' 
                       : 'text-dark-text font-semibold hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-100 my-2 pt-4 px-2 grid grid-cols-2 gap-3">
                    <a
                        href="https://www.facebook.com/groups/467126453152213"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-[#1877F2] bg-[#1877F2]/10 py-3 rounded-xl font-heading font-bold text-sm"
                    >
                        <Facebook size={18} />
                        Facebook
                    </a>
                    <Link to="/admin" className="flex items-center justify-center gap-2 text-gray-500 bg-gray-100 py-3 rounded-xl font-heading font-bold text-sm">
                        <Settings size={18} />
                        Admin
                    </Link>
              </div>

              <a
                href="https://www.helloasso.com/associations/indigo-preseau/formulaires/1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-nature-primary text-white font-heading font-bold rounded-xl active:scale-95 transition-transform shadow-md mt-2"
              >
                <Heart size={18} fill="currentColor" />
                Faire un don
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow pt-[70px] md:pt-[80px]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}