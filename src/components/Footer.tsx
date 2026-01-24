import { Link } from 'react-router-dom';
import { Facebook, Mail, MapPin, ExternalLink, Heart, ChevronRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Liste des partenaires secondaires avec leurs descriptions
  const localPartners = [
    {
      name: "Ville de Préseau",
      desc: "Soutien institutionnel et local pour nos actions.",
      url: "https://www.preseau.fr/",
      image: "/Preseau.webp", 
    },
    {
      name: "BYcoach Yohan Bauduin",
      desc: "Accompagnement sportif et mental adapté.",
      url: "https://www.facebook.com/yohan.bauduin.52",
      image: "/Bauduin.webp",
    },
    {
      name: "Cabinet MERCI",
      desc: "Espace de soin et d'écoute bienveillante.",
      url: "https://www.facebook.com/yohanbauduin.cabinet.MERCI",
      image: "/merci.webp",
    },
    {
      name: "Le Baragraphe",
      desc: "Lieu de convivialité et de soutien local.",
      url: "https://www.facebook.com/lebaragraphe.fr",
      image: "/baragraphe.webp",
    },
    {
      name: "Maïté Jonckheere",
      desc: "Sophrologue à Villereau, gestion du stress et émotions.",
      url: "https://www.facebook.com/people/Ma%C3%AFt%C3%A9-Jonckheere-Sophrologue-Villereau/pfbid02FBQDg3yfxr2nGCdhnvFhYg475D7eWkLPUQTXBzcgYbRTWoCTjkou44j5Ct6BcsiMl/",
      image: "/maite.webp", // ⚠️ Assure-toi que l'image porte bien ce nom dans le dossier public
    }
  ];

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
                  <ChevronRight size={14} /> S'informer
                </Link>
              </li>
              <li>
                <Link to="/evenements" className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                  <ChevronRight size={14} /> Nos événements
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                  <ChevronRight size={14} /> Une question ?
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

          {/* COLONNE 3 : PARTENAIRES */}
          <div className="lg:pl-8">
            <h4 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-nature-primary rounded-full"></span>
              Nos Partenaires
            </h4>
            
            <div className="space-y-4">
                {/* 1. KINEVIR (Mis en avant - Fond Blanc) */}
                <div className="bg-white rounded-xl p-4 shadow-lg transform hover:-translate-y-1 transition-transform duration-300 group flex items-start gap-4">
                    <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg p-1 flex items-center justify-center border border-gray-100">
                        <img src="/kinevir-logo.webp" alt="Kinevir" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-heading font-bold text-dark-text text-sm">Kinevir</h5>
                            <span className="bg-indigo-50 text-indigo-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Officiel</span>
                        </div>
                        <p className="text-gray-500 text-xs leading-tight mb-1">
                            Téléconsultation & kinésithérapie en ligne.
                        </p>
                        <a href="https://kinevir.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-primary hover:text-peach-primary flex items-center gap-1">
                            Visiter <ExternalLink size={10} />
                        </a>
                    </div>
                </div>

                {/* 2. AUTRES PARTENAIRES (Style "Glass") */}
                <div className="grid grid-cols-1 gap-3">
                  {localPartners.map((partner) => (
                      <div key={partner.name} className="bg-white/10 border border-white/10 rounded-xl p-3 hover:bg-white/20 transition-colors flex items-start gap-4">
                          <div className="w-10 h-10 flex-shrink-0 bg-white rounded-lg p-1 flex items-center justify-center">
                              <img src={partner.image} alt={partner.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                              <h5 className="font-heading font-bold text-white text-sm mb-0.5 truncate">{partner.name}</h5>
                              <p className="text-indigo-100 text-xs leading-tight mb-1 line-clamp-2">
                                  {partner.desc}
                              </p>
                              <a href={partner.url} target="_blank" rel="noopener noreferrer" className="text-xs text-white/70 hover:text-white flex items-center gap-1">
                                  Voir le site <ExternalLink size={10} />
                              </a>
                          </div>
                      </div>
                  ))}
                </div>
            </div>

          </div>

        </div>

        {/* BARRE DU BAS */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-indigo-200">
          <p className="font-body text-center md:text-left">
            © {currentYear} Association Indigo. Association loi 1901.
          </p>
          <div className="flex gap-6">
            <Link to="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link to="/politique-confidentialite" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}