import { Link } from 'react-router-dom';
import {
  Heart,
  HandHeart,
  Star,
  BookOpen,
  Calendar,
  Mail,
  Facebook,
  ArrowRight,
  Quote,
  CheckCircle2
} from 'lucide-react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Association Indigo',
  legalName: 'Association Indigo Preseau',
  description: 'Association loi 1901 accompagnant les familles d\'enfants atypiques : TDAH, DYS, HPI, hypersensibilité, phobie scolaire à Preseau (Nord).',
  url: 'https://association-indigo.fr',
  logo: 'https://association-indigo.fr/logo-indigo.png',
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mairie de Preseau',
    addressLocality: 'Preseau',
    postalCode: '59990',
    addressRegion: 'Nord',
    addressCountry: 'FR',
  },
  areaServed: {
    '@type': 'Place',
    name: 'Valenciennois, Nord, Hauts-de-France',
  },
  sameAs: ['https://www.facebook.com/groups/467126453152213'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'associationindigo59@gmail.com',
    url: 'https://association-indigo.fr/contact',
  },
};

export default function HomePage() {
  const values = [
    {
      icon: Heart,
      title: 'Bienveillance',
      description: "Un espace sans jugement pour accueillir votre parole.",
      color: 'text-peach-primary',
      bgColor: 'bg-peach-primary/10'
    },
    {
      icon: HandHeart,
      title: 'Entraide',
      description: "Ne restez plus isolés face aux défis du quotidien.",
      color: 'text-nature-primary',
      bgColor: 'bg-nature-primary/10'
    },
    {
      icon: Star,
      title: 'Valorisation',
      description: "Transformer la différence en une véritable force.",
      color: 'text-indigo-primary',
      bgColor: 'bg-indigo-primary/10'
    },
  ];

  const pathologies = [
    {
      title: 'TDAH / TDA',
      description: "Comprendre le déficit de l'attention et l'hyperactivité.",
      slug: 'tdah-tda',
      color: 'bg-indigo-primary',
    },
    {
      title: 'Troubles DYS',
      description: 'Dyslexie, Dyspraxie et autres troubles des apprentissages.',
      slug: 'dys',
      color: 'bg-peach-primary',
    },
    {
      title: 'Phobie Scolaire',
      description: 'Accompagner le refus scolaire anxieux avec douceur.',
      slug: 'phobie-scolaire',
      color: 'bg-nature-primary',
    },
    {
      title: 'Haut Potentiel',
      description: 'HPI, HPE, Zèbres : gérer intensité et hypersensibilité.',
      slug: 'haut-potentiel',
      color: 'bg-indigo-primary',
    },
  ];

  const testimonials = [
    {
      text: "Grâce à Indigo, nous avons enfin compris que notre fils n'était pas 'difficile', mais qu'il percevait le monde différemment. Un soulagement immense.",
      author: "Sophie, maman de Léo (TDAH)",
    },
    {
      text: "L'association a été une bouffée d'oxygène. Rencontrer d'autres parents qui vivent la même chose permet de se sentir moins seule.",
      author: "Marc, papa de Julie (HPI)",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Association Indigo | TDAH, DYS, HPI | Preseau - Valenciennes"
        description="Association Indigo à Preseau (proche Valenciennes). Accompagnement bienveillant des familles d'enfants atypiques : TDAH, troubles DYS, HPI, hypersensibilité, phobie scolaire."
        canonical="/"
        structuredData={homeStructuredData}
      />
      {/* Hero Section */}
      <Hero />

      {/* Section Qui sommes-nous - Redesignée pour être plus lisible */}
      <section id="qui-sommes-nous" className="py-20 bg-white relative overflow-hidden">
        {/* Décoration d'arrière-plan subtile */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-dark-text mb-6">
              Plus qu'une association, <span className="text-indigo-primary">une famille</span>
            </h2>
            <p className="font-body text-lg text-dark-text/80 leading-relaxed mb-8">
              L'Association Indigo, basée à Preseau (Nord), est le point de repère pour les familles d'enfants atypiques. 
              Nous transformons le parcours du combattant en un chemin partagé.
            </p>
            
            {/* Liste des profils accompagnés pour scanner rapidement */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['TDAH/TDA', 'DYS', 'HPI/HPE', 'Hypersensibilité', 'Phobie Scolaire'].map((tag) => (
                <span key={tag} className="px-4 py-2 bg-light-bg text-indigo-primary rounded-full font-semibold text-sm shadow-sm border border-indigo-primary/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white border border-gray-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex justify-center mb-6">
                    <div className={`${value.color} ${value.bgColor} rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={40} strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-dark-text mb-3">
                    {value.title}
                  </h3>
                  <p className="font-body text-dark-text/70">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Articles - Pathologies */}
      <section id="articles" className="py-20 bg-light-bg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 max-w-6xl mx-auto gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-indigo-primary mb-3 bg-white px-4 py-1 rounded-full shadow-sm">
                <BookOpen size={20} />
                <span className="font-body font-semibold text-sm uppercase tracking-wide">Comprendre</span>
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark-text mb-4">
                Mieux comprendre pour mieux accompagner
              </h2>
              <p className="font-body text-lg text-dark-text/80">
                L'information est la première clé de l'acceptation. Explorez nos dossiers complets.
              </p>
            </div>
            <Link
              to="/articles"
              className="hidden md:inline-flex items-center gap-2 text-indigo-primary font-bold hover:text-indigo-primary/80 transition-colors"
            >
              Voir toute la bibliothèque <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pathologies.map((item) => (
              <Link
                key={item.slug}
                to={`/articles/${item.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border-b-4 border-transparent hover:border-indigo-primary flex flex-col h-full"
              >
                <div className={`${item.color} w-12 h-12 rounded-xl mb-6 flex items-center justify-center shadow-md transform group-hover:rotate-6 transition-transform`}>
                  <BookOpen size={24} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-xl text-dark-text mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-dark-text/70 mb-6 flex-grow">
                  {item.description}
                </p>
                <div className="flex items-center text-indigo-primary font-semibold text-sm mt-auto">
                  Lire le dossier
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
             <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-indigo-primary font-bold"
            >
              Voir toute la bibliothèque <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* NOUVELLE SECTION: Témoignages */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl text-center text-dark-text mb-12">
            La parole aux familles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-light-bg rounded-tr-3xl rounded-bl-3xl rounded-tl-lg rounded-br-lg p-8 relative">
                <Quote className="absolute top-4 left-4 text-peach-primary/20 w-12 h-12" />
                <p className="font-body text-dark-text/80 italic relative z-10 mb-6 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-peach-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {t.author.charAt(0)}
                  </div>
                  <span className="font-heading font-semibold text-dark-text">{t.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Événements & Contact (Regroupées pour la fluidité) */}
      <section id="agenda-contact" className="py-20 bg-gradient-to-b from-white to-light-bg">
        <div className="container mx-auto px-4">
          
          {/* Agenda Preview */}
          <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 max-w-5xl mx-auto mb-20 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-2 bg-peach-primary"></div>
             <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                   <div className="inline-flex items-center gap-2 text-peach-primary mb-4">
                    <Calendar size={24} />
                    <span className="font-body font-bold uppercase tracking-wide text-sm">Agenda</span>
                  </div>
                  <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark-text mb-6">
                    Ne manquez aucun atelier
                  </h2>
                  <p className="font-body text-lg text-dark-text/80 mb-8">
                    Groupes de parole, ateliers créatifs, cafés des parents... Nos événements sont pensés pour créer du lien et vous outiller au quotidien.
                  </p>
                  <Link
                    to="/evenements"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-peach-primary text-white font-body font-bold rounded-full hover:bg-peach-dark transition-all duration-300 shadow-lg hover:shadow-peach-primary/30"
                  >
                    Voir le calendrier
                    <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="hidden md:block w-px h-64 bg-gray-100"></div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="font-heading font-bold text-xl text-dark-text mb-6">Pourquoi participer ?</h3>
                    <ul className="space-y-4">
                        {[
                            'Rompre l\'isolement',
                            'Échanger des astuces concrètes',
                            'Rencontrer des professionnels bienveillants',
                            'Permettre aux enfants de se faire des amis'
                        ].map(item => (
                            <li key={item} className="flex items-center gap-3 text-dark-text/80">
                                <CheckCircle2 size={20} className="text-nature-primary flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
             </div>
          </div>

          {/* Contact Banner */}
          <div className="max-w-4xl mx-auto text-center">
             <h2 className="font-heading font-bold text-3xl text-dark-text mb-6">Une question ?</h2>
             <p className="font-body text-lg text-dark-text/80 mb-8 max-w-2xl mx-auto">
                Que ce soit pour une demande d'information ou simplement pour échanger avant de nous rejoindre, nous sommes à votre écoute.
             </p>
             <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-nature-primary text-nature-primary font-body font-bold rounded-full hover:bg-nature-primary hover:text-white transition-all duration-300"
              >
                <Mail size={20} />
                Nous contacter
              </Link>
          </div>

        </div>
      </section>

      {/* Section Adhésion / Don - Corrigée pour l'accessibilité */}
      <section
        id="soutenir"
        className="py-20 relative overflow-hidden bg-nature-primary"
      >
        {/* Motif de fond subtil pour éviter le plat sans casser le contraste */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            Soutenez nos actions
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-12">
            L'Association Indigo vit grâce à ses adhérents et donateurs. Chaque geste nous aide à organiser plus d'ateliers et à accompagner plus de familles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {/* Carte Adhésion */}
            <div className="bg-white rounded-3xl p-8 shadow-xl transform hover:-translate-y-1 transition-transform duration-300">
              <div className="text-nature-primary mb-4 flex justify-center">
                 <Heart size={48} fill="currentColor" className="opacity-20" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-dark-text mb-2">
                Devenir Adhérent
              </h3>
              <p className="font-body text-3xl font-bold text-nature-primary mb-4">
                5€ <span className="text-base font-normal text-gray-500">/ an</span>
              </p>
              <ul className="text-left space-y-3 mb-8 text-dark-text/80 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-nature-primary"/> Accès prioritaire aux ateliers</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-nature-primary"/> Participation à la vie de l'asso</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-nature-primary"/> Soutien moral</li>
              </ul>
              <a
                href="https://www.helloasso.com/associations/indigo-preseau/paiements/adhesion-indigo-preseau"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 bg-nature-primary text-white font-body font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-md"
              >
                J'adhère
              </a>
            </div>

            {/* Carte Don */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl text-white">
              <div className="mb-4 flex justify-center text-white">
                 <Star size={48} className="opacity-50" />
              </div>
              <h3 className="font-heading font-bold text-2xl mb-2">
                Faire un Don
              </h3>
              <p className="font-body text-3xl font-bold mb-4">
                Libre
              </p>
              <p className="font-body text-white/80 mb-8 min-h-[80px] flex items-center justify-center">
                Aidez-nous à acheter du matériel pédagogique et à financer des intervenants experts.
              </p>
              <a
                href="https://www.helloasso.com/associations/indigo-preseau/formulaires/1"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 bg-white text-nature-primary font-body font-bold rounded-xl hover:bg-gray-50 transition-all shadow-md"
              >
                Je donne
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Facebook - Simplifié et moderne */}
      <section className="py-12 bg-[#1877F2] text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
          <div className="bg-white/20 p-4 rounded-full">
            <Facebook size={32} />
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl mb-1">
              Rejoignez la communauté
            </h2>
            <p className="font-body text-white/80">
              Échangez avec d'autres parents sur notre groupe privé.
            </p>
          </div>
          <a
            href="https://www.facebook.com/groups/467126453152213"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-[#1877F2] font-body font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg whitespace-nowrap"
          >
            Rejoindre le groupe
          </a>
        </div>
      </section>
    </div>
  );
}