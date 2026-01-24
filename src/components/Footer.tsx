import { Link } from 'react-router-dom';
import { Facebook, Mail, MapPin, ExternalLink, Heart, ChevronRight, Handshake } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Partenaires locaux
  const partners = [
    {
      name: "Ville de Préseau",
      desc: "Soutien institutionnel",
      url: "https://www.preseau.fr/",
      image: "/Preseau.webp", 
    },
    {
      name: "BYcoach Yohan Bauduin",
      desc: "Coaching sportif & mental",
      url: "https://www.facebook.com/yohan.bauduin.52",
      image: "/Bauduin.webp",
    },
    {
      name: "Cabinet MERCI",
      desc: "Soins & écoute",
      url: "https://www.facebook.com/yohanbauduin.cabinet.MERCI",
      image: "/merci.webp",
    },
    {
      name: "Le Baragraphe",
      desc: "Convivialité locale",
      url: "https://www.facebook.com/lebaragraphe.fr",
      image: "/baragraphe.webp",
    },
    {
      name: "Maïté Jonckheere",
      desc: "Sophrologie",
      url: "https://www.facebook.com/people/Ma%C3%AFt%C3%A9-Jonckheere-Sophrologue-Villereau/pfbid02FBQDg3yfxr2nGCdhnvFhYg475D7eWkLPUQTXBzcgYbRTWoCTjkou44j5Ct6BcsiMl/",
      image: "/maite.webp",
    },
    {
      name: "Study avec Julie",
      desc: "Soutien scolaire",
      url: "https://www.facebook.com/people/Studyavecjulie/61567019326778/",
      image: "/Studavecjulie.webp",
    }
  ];

  return (
    <footer className="bg-indigo-primary text-white pt-16 pb-8 relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-peach-primary/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* SECTION PRINCIPALE - 3 COLONNES */}
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
                href="mailto:associationindigo59@gmail.com" 
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
                  <ChevronRight size={14} /> S'informer
                </Link>
              </li>
              <li>
                <Link to="/evenements" className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                  <ChevronRight size={14} /> Nos événements
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                  <ChevronRight size={14} /> FAQ
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

          {/* COLONNE 3 : Rejoindre / Soutenir */}
          <div className="lg:pl-8">
            <h4 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-nature-primary rounded-full"></span>
              Nous rejoindre
            </h4>
            
            <p className="text-indigo-100 text-sm mb-6">
              L'Association Indigo vit grâce à ses adhérents et bénévoles. Rejoignez-nous pour soutenir les familles d'enfants atypiques !
            </p>

            <div className="space-y-3">
              <a
                href="https://www.helloasso.com/associations/indigo-preseau/adhesions/adhesion-2025"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-indigo-primary font-heading font-bold rounded-xl hover:bg-gray-100 transition-all"
              >
                <Heart size={18} />
                Adhérer (5€/an)
              </a>
              
              <a
                href="https://www.helloasso.com/associations/indigo-preseau/formulaires/1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-peach-primary text-white font-heading font-bold rounded-xl hover:bg-peach-primary/90 transition-all"
              >
                <Heart size={18} fill="currentColor" />
                Faire un don
              </a>
            </div>
          </div>

        </div>

        {/* SECTION PARTENAIRES LOCAUX - Bandeau horizontal */}
        <div className="border-t border-white/10 pt-10 mb-10">
          <h4 className="font-heading font-bold text-lg mb-6 flex items-center justify-center gap-2">
            <Handshake size={20} className="text-peach-primary" />
            Ils nous soutiennent
          </h4>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {/* Kinevir en premier */}
            <a 
              href="https://kinevir.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-3 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 mb-2 bg-white rounded-lg p-1.5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src="/kinevir-logo.webp" alt="Kinevir" className="max-w-full max-h-full object-contain" />
              </div>
              <h5 className="font-heading font-bold text-white text-xs">Kinevir</h5>
            </a>
            
            {/* Autres partenaires */}
            {partners.map((partner) => (
              <a 
                key={partner.name}
                href={partner.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-3 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 mb-2 bg-white rounded-lg p-1.5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img src={partner.image} alt={partner.name} className="max-w-full max-h-full object-contain" />
                </div>
                <h5 className="font-heading font-bold text-white text-xs line-clamp-1">{partner.name}</h5>
              </a>
            ))}
          </div>
        </div>

        {/* BARRE DU BAS */}
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