import { useState } from 'react';
import { Menu, X, Facebook, Instagram, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'Qui sommes-nous', href: '#qui-sommes-nous' },
    { name: 'Nos actions', href: '#nos-actions' },
    { name: 'Nous rejoindre', href: '#nous-rejoindre' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a
            href="#accueil"
            className="font-heading font-bold text-xl md:text-2xl text-indigo-primary focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:ring-offset-2 rounded-lg"
            aria-label="Association Indigo - Retour à l'accueil"
          >
            Association Indigo
          </a>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="font-body text-dark-text hover:text-indigo-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:ring-offset-2 rounded-lg px-2 py-1"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://www.facebook.com/groups/467126453152213"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-text hover:text-indigo-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:ring-offset-2 rounded-lg p-1"
              aria-label="Suivez-nous sur Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-text hover:text-indigo-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:ring-offset-2 rounded-lg p-1"
              aria-label="Suivez-nous sur Instagram"
            >
              <Instagram size={20} />
            </a>
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-primary hover:bg-indigo-primary hover:text-white border-2 border-indigo-primary rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:ring-offset-2"
              aria-label="Connexion administration"
            >
              <LogIn size={16} />
              <span className="font-body font-semibold">Admin</span>
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-dark-text focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:ring-offset-2 rounded-lg p-2"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block font-body text-dark-text hover:text-indigo-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:ring-offset-2 rounded-lg px-2 py-1"
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/groups/467126453152213"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-text hover:text-indigo-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:ring-offset-2 rounded-lg p-1"
                  aria-label="Suivez-nous sur Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-text hover:text-indigo-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:ring-offset-2 rounded-lg p-1"
                  aria-label="Suivez-nous sur Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-indigo-primary hover:bg-indigo-primary hover:text-white border-2 border-indigo-primary rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:ring-offset-2"
              >
                <LogIn size={16} />
                <span className="font-body font-semibold">Administration</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
