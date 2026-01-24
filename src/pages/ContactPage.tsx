import { useState } from 'react';
import Contact from '../components/Contact';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

// --- DONNÉES DE LA FAQ ---
const faqData = [
  {
    category: "Comprendre l’association",
    items: [
      {
        question: "Qu’est‑ce que l’association Indigo ?",
        answer: "Indigo est une association dédiée à l’accompagnement des enfants atypiques (HPI, TSA, TDAH, dyspraxiques, dyslexiques, hypersensibles, etc.) et de leurs parents. Nous proposons un espace sécurisant, créatif et structuré pour soutenir les familles dans leur quotidien, leurs défis et leurs réussites."
      },
      {
        question: "Que signifie “enfants atypiques” ?",
        answer: "Nous utilisons ce terme pour englober les enfants dont le fonctionnement diffère des normes attendues : neuroatypies, profils cognitifs singuliers, hypersensibilités, besoins éducatifs particuliers. L’objectif est d’éviter les étiquettes réductrices et de valoriser la diversité des trajectoires."
      },
      {
        question: "Pourquoi parler de “parents émérites” ?",
        answer: "Parce que nous reconnaissons la compétence, la persévérance et l’amour des parents qui accompagnent un enfant atypique. Ce terme souligne leur expertise vécue, souvent invisible mais essentielle."
      }
    ]
  },
  {
    category: "Accompagnement et services",
    items: [
      {
        question: "Quels types d’accompagnement propose Indigo ?",
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
        question: "À partir de quel âge accompagnez‑vous les enfants ?",
        answer: "Nous intervenons généralement à partir de 3 ans et sans limite d’âge supérieure, avec des formats adaptés à chaque tranche d’âge."
      },
      {
        question: "L’accompagnement est‑il personnalisé ?",
        answer: "Oui. Chaque enfant et chaque famille est unique. Nous adaptons nos outils, nos rythmes et nos supports en fonction des besoins, du profil et des objectifs de chacun."
      }
    ]
  },
  {
    category: "Fonctionnement pratique",
    items: [
      {
        question: "Comment prendre contact ou s’inscrire à un atelier ?",
        answer: "Vous pouvez nous écrire via le formulaire ci-dessus, nous envoyer un email ou venir nous rencontrer lors de nos réunions. Nous vous guidons ensuite vers l’accompagnement et les professionnels les plus adaptés."
      },
      {
        question: "Les activités sont‑elles payantes ?",
        answer: "Certaines actions sont gratuites grâce au soutien de partenaires. D’autres sont proposées à tarif solidaire sur adhésion. Les informations précises sont indiquées sur chaque activité."
      },
      {
        question: "Faut‑il un diagnostic pour participer ?",
        answer: "Non. Indigo accueille les enfants avec ou sans diagnostic. Ce qui compte, ce sont les besoins, pas les étiquettes."
      },
      {
        question: "Intervenez‑vous dans les écoles ?",
        answer: "Oui, sur demande des familles ou des établissements : sensibilisation, outils pédagogiques, médiation, aménagements, ateliers collectifs."
      }
    ]
  },
  {
    category: "Valeurs et philosophie",
    items: [
      {
        question: "Quelle est votre approche ?",
        answer: "Indigo s’appuie sur une vision humaniste, inclusive et créative. Nous valorisons les forces de chaque enfant, soutenons les parents et favorisons des environnements bienveillants et adaptés."
      },
      {
        question: "Travaillez‑vous avec des professionnels de santé ?",
        answer: "Oui. Nous collaborons avec des psychologues, orthophonistes, psychomotriciens, sophrologues, enseignants spécialisés, éducateurs, infirmiers et thérapeutes selon les besoins."
      },
      {
        question: "Comment garantissez‑vous la confidentialité ?",
        answer: "Toutes les informations partagées au sein de l’association sont strictement confidentielles et protégées."
      }
    ]
  },
  {
    category: "Pour aller plus loin",
    items: [
      {
        question: "Puis‑je proposer une idée d’atelier ou devenir bénévole ?",
        answer: "Avec joie ! Indigo est un espace vivant et collaboratif. Les parents, professionnels et bénévoles sont invités à enrichir nos actions."
      },
      {
        question: "Comment soutenir l’association ?",
        answer: "En adhérant, en faisant un don, en participant aux événements ou en relayant nos actions autour de vous."
      }
    ]
  }
];

export default function ContactPage() {
  // État pour gérer quelle question est ouverte (null = aucune)
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-light-bg min-h-screen">
      
      {/* 1. COMPOSANT CONTACT (Formulaire + Infos) */}
      <div className="pt-20">
        <Contact />
      </div>

      {/* 2. SECTION FAQ */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center justify-center p-3 bg-indigo-primary/10 text-indigo-primary rounded-full mb-4">
            <HelpCircle size={32} />
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark-text mb-4">
            Questions Fréquentes
          </h2>
          <p className="font-body text-dark-text/70 text-lg">
            Tout ce que vous devez savoir pour bien comprendre notre fonctionnement.
          </p>
        </div>

        <div className="space-y-8">
          {faqData.map((section, sIndex) => (
            <div key={sIndex} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Titre de Catégorie */}
              <div className="bg-indigo-primary/5 px-6 py-4 border-b border-indigo-primary/10">
                <h3 className="font-heading font-bold text-xl text-indigo-primary">
                  {section.category}
                </h3>
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
                        <span className={`font-body font-bold text-lg ${isOpen ? 'text-peach-primary' : 'text-dark-text group-hover:text-indigo-primary'} transition-colors`}>
                          {item.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="text-peach-primary flex-shrink-0 ml-4" />
                        ) : (
                          <ChevronDown className="text-gray-400 group-hover:text-indigo-primary flex-shrink-0 ml-4 transition-colors" />
                        )}
                      </button>
                      
                      {/* Réponse (avec animation simple si on voulait, ici affichage conditionnel) */}
                      {isOpen && (
                        <div className="px-6 pb-6 pt-2">
                          <div className="font-body text-dark-text/70 leading-relaxed pl-4 border-l-2 border-peach-primary/30">
                            {item.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Petit encart final */}
        <div className="mt-12 text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <p className="font-heading font-bold text-lg text-dark-text mb-2">Vous n'avez pas trouvé votre réponse ?</p>
           <p className="text-dark-text/60 mb-0">N'hésitez pas à utiliser le formulaire de contact ci-dessus, nous vous répondrons avec plaisir !</p>
        </div>

      </section>
    </div>
  );
}