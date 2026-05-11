import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

// Couleurs pour chaque catégorie
const categoryColors = [
  { bg: 'bg-indigo-primary/10', border: 'border-indigo-primary/20', title: 'text-indigo-primary', accent: 'bg-indigo-primary' },
  { bg: 'bg-peach-primary/10', border: 'border-peach-primary/20', title: 'text-peach-primary', accent: 'bg-peach-primary' },
  { bg: 'bg-nature-primary/10', border: 'border-nature-primary/20', title: 'text-nature-primary', accent: 'bg-nature-primary' },
  { bg: 'bg-purple-100', border: 'border-purple-200', title: 'text-purple-600', accent: 'bg-purple-500' },
  { bg: 'bg-amber-100', border: 'border-amber-200', title: 'text-amber-600', accent: 'bg-amber-500' },
];

// --- DONNÉES DE LA FAQ ---
const faqData = [
  {
    category: "Comprendre l'association",
    icon: "🏠",
    items: [
      {
        question: "Qu'est-ce que l'association Indigo ?",
        answer: "Indigo est une association dédiée à l'accompagnement des enfants atypiques (HPI, TSA, TDAH, dyspraxiques, dyslexiques, hypersensibles, etc.) et de leurs parents. Nous proposons un espace sécurisant, créatif et structuré pour soutenir les familles dans leur quotidien, leurs défis et leurs réussites."
      },
      {
        question: "Que signifie « enfants atypiques » ?",
        answer: "Nous utilisons ce terme pour englober les enfants dont le fonctionnement diffère des normes attendues : neuroatypies, profils cognitifs singuliers, hypersensibilités, besoins éducatifs particuliers. L'objectif est d'éviter les étiquettes réductrices et de valoriser la diversité des trajectoires."
      },
      {
        question: "Pourquoi parler de « parents émérites » ?",
        answer: "Parce que nous reconnaissons la compétence, la persévérance et l'amour des parents qui accompagnent un enfant atypique. Ce terme souligne leur expertise vécue, souvent invisible mais essentielle."
      }
    ]
  },
  {
    category: "Accompagnement et services",
    icon: "🤝",
    items: [
      {
        question: "Quels types d'accompagnement propose Indigo ?",
        answer: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Ateliers pour enfants (émotions, compétences sociales, jeux créativité, autonomie, ateliers concentration BrainBall…)</li>
            <li>Groupes de parole pour parents</li>
            <li>Séances individuelles (enfant, parent, fratrie)</li>
            <li>Interventions en milieu scolaire ou associatif</li>
            <li>Ressources pédagogiques et outils visuels</li>
            <li>Événements, conférences et formations</li>
          </ul>
        )
      },
      {
        question: "À partir de quel âge accompagnez-vous les enfants ?",
        answer: "Nous intervenons généralement à partir de 3 ans et sans limite d'âge supérieure, avec des formats adaptés à chaque tranche d'âge."
      },
      {
        question: "L'accompagnement est-il personnalisé ?",
        answer: "Oui. Chaque enfant et chaque famille est unique. Nous adaptons nos outils, nos rythmes et nos supports en fonction des besoins, du profil et des objectifs de chacun."
      }
    ]
  },
  {
    category: "Fonctionnement pratique",
    icon: "⚙️",
    items: [
      {
        question: "Comment prendre contact ou s'inscrire à un atelier ?",
        answer: "Vous pouvez nous écrire via notre page contact, nous envoyer un email ou venir nous rencontrer lors de nos réunions. Nous vous guidons ensuite vers l'accompagnement et les professionnels les plus adaptés."
      },
      {
        question: "Les activités sont-elles payantes ?",
        answer: "Certaines actions sont gratuites grâce au soutien de partenaires. D'autres sont proposées à tarif solidaire sur adhésion. Les informations précises sont indiquées sur chaque activité."
      },
      {
        question: "Faut-il un diagnostic pour participer ?",
        answer: "Non. Indigo accueille les enfants avec ou sans diagnostic. Ce qui compte, ce sont les besoins, pas les étiquettes."
      },
      {
        question: "Intervenez-vous dans les écoles ?",
        answer: "Oui, sur demande des familles ou des établissements : sensibilisation, outils pédagogiques, médiation, aménagements, ateliers collectifs."
      }
    ]
  },
  {
    category: "Valeurs et philosophie",
    icon: "💜",
    items: [
      {
        question: "Quelle est votre approche ?",
        answer: "Indigo s'appuie sur une vision humaniste, inclusive et créative. Nous valorisons les forces de chaque enfant, soutenons les parents et favorisons des environnements bienveillants et adaptés."
      },
      {
        question: "Travaillez-vous avec des professionnels de santé ?",
        answer: "Oui. Nous collaborons avec des psychologues, orthophonistes, psychomotriciens, sophrologues, enseignants spécialisés, éducateurs, infirmiers et thérapeutes selon les besoins."
      },
      {
        question: "Comment garantissez-vous la confidentialité ?",
        answer: "Toutes les informations partagées au sein de l'association sont strictement confidentielles et protégées."
      }
    ]
  },
  {
    category: "Pour aller plus loin",
    icon: "🚀",
    items: [
      {
        question: "Puis-je proposer une idée d'atelier ou devenir bénévole ?",
        answer: "Avec joie ! Indigo est un espace vivant et collaboratif. Les parents, professionnels et bénévoles sont invités à enrichir nos actions."
      },
      {
        question: "Comment soutenir l'association ?",
        answer: "En adhérant, en faisant un don, en participant aux événements ou en relayant nos actions autour de vous."
      }
    ]
  }
];

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.flatMap((section) =>
    section.items
      .filter((item) => typeof item.answer === 'string')
      .map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer as string,
        },
      }))
  ),
};

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="FAQ | Questions Fréquentes sur l'Association Indigo"
        description="Toutes les réponses à vos questions sur l'Association Indigo : accompagnement enfants atypiques, ateliers, groupes de parole, adhésion, prise en charge TDAH, DYS, HPI."
        canonical="/faq"
        structuredData={faqStructuredData}
      />

      {/* Hero Section - Arc-en-ciel */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Fond dégradé arc-en-ciel */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-primary/20 via-peach-primary/20 to-nature-primary/20"></div>
        
        {/* Cercles décoratifs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-peach-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-nature-primary/10 rounded-full blur-2xl"></div>
        
        {/* Étoiles décoratives */}
        <div className="absolute top-16 right-1/4 text-peach-primary/40 animate-pulse">
          <Sparkles size={24} />
        </div>
        <div className="absolute bottom-20 left-1/4 text-indigo-primary/40 animate-pulse delay-300">
          <Sparkles size={20} />
        </div>
        <div className="absolute top-1/2 right-10 text-nature-primary/40 animate-pulse delay-500">
          <Sparkles size={28} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm text-indigo-primary rounded-full mb-6 shadow-lg">
            <HelpCircle size={40} />
          </span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-dark-text mb-4">
            Questions <span className="text-indigo-primary">Fré</span><span className="text-peach-primary">quen</span><span className="text-nature-primary">tes</span>
          </h1>
          <p className="font-body text-dark-text/70 text-lg max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur l'Association Indigo et notre accompagnement des familles d'enfants atypiques.
          </p>
          
          {/* Barre arc-en-ciel */}
          <div className="mt-8 h-1.5 w-48 mx-auto rounded-full bg-gradient-to-r from-indigo-primary via-peach-primary to-nature-primary"></div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          {faqData.map((section, sIndex) => {
            const colors = categoryColors[sIndex % categoryColors.length];
            
            return (
              <div 
                key={sIndex} 
                className={`bg-white rounded-3xl shadow-sm border-2 ${colors.border} overflow-hidden transition-all hover:shadow-lg`}
              >
                {/* Titre de Catégorie avec couleur */}
                <div className={`${colors.bg} px-6 py-5 border-b ${colors.border} flex items-center gap-3`}>
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className={`font-heading font-bold text-xl ${colors.title}`}>
                    {section.category}
                  </h2>
                </div>
                
                {/* Questions de la catégorie */}
                <div className="divide-y divide-gray-100">
                  {section.items.map((item, qIndex) => {
                    const uniqueKey = `${sIndex}-${qIndex}`;
                    const isOpen = openIndex === uniqueKey;

                    return (
                      <div key={qIndex} className="group">
                        <button
                          onClick={() => toggleFAQ(uniqueKey)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-gray-50 transition-colors"
                        >
                          <span className={`font-body font-bold text-lg ${isOpen ? colors.title : 'text-dark-text group-hover:text-indigo-primary'} transition-colors`}>
                            {item.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className={`${colors.title} flex-shrink-0 ml-4`} />
                          ) : (
                            <ChevronDown className="text-gray-400 group-hover:text-indigo-primary flex-shrink-0 ml-4 transition-colors" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-6 pt-2">
                            <div className={`font-body text-dark-text/70 leading-relaxed pl-4 border-l-4 ${colors.border}`}>
                              {item.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA vers Contact - Style arc-en-ciel */}
        <div className="mt-12 text-center bg-gradient-to-r from-indigo-primary/5 via-peach-primary/5 to-nature-primary/5 p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Bordure arc-en-ciel en haut */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-primary via-peach-primary to-nature-primary"></div>
          
          <p className="font-heading font-bold text-xl text-dark-text mb-2">
            Vous n'avez pas trouvé votre réponse ?
          </p>
          <p className="text-dark-text/60 mb-6">
            N'hésitez pas à nous contacter directement, nous vous répondrons avec plaisir !
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-primary to-peach-primary text-white font-heading font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-md"
          >
            <MessageCircle size={20} />
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
}