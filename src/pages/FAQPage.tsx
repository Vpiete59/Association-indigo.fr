// Questions fréquentes « L'atelier » : une feuille de couleur par thème, des réponses dépliables.
import { Link } from 'react-router-dom';
import { Plus, Mail, Facebook } from 'lucide-react';
import SEO from '../components/SEO';
import { LINKS } from '../atelier/data';
import { PageHeader, Tape, PAPER } from '../atelier/kit';

const SHEETS = [PAPER.lilas, PAPER.saumon, PAPER.beurre, PAPER.ciel, PAPER.mauve];
const TAPES = [PAPER.beurre, PAPER.ciel, PAPER.saumon, PAPER.mauve, PAPER.lilas];

// --- DONNÉES DE LA FAQ ---
const faqData = [
  {
    category: "Comprendre l'association",
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
    items: [
      {
        question: "Quels types d'accompagnement propose Indigo ?",
        answer: (
          <ul className="mt-1 grid gap-1.5 list-disc pl-5 marker:text-[var(--act)]">
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
  return (
    <div>
      <SEO
        title="FAQ : questions fréquentes"
        description="Toutes les réponses à vos questions sur l'Association Indigo : accompagnement enfants atypiques, ateliers, groupes de parole, adhésion, prise en charge TDAH, DYS, HPI."
        canonical="/faq"
        structuredData={faqStructuredData}
      />

      <PageHeader
        title="Les questions qu'on nous pose"
        paper={PAPER.ciel}
        intro="Tout ce qu'il faut savoir sur l'Association Indigo et l'accompagnement des familles d'enfants atypiques. Une autre question ? Écrivez-nous."
      >
        <nav aria-label="Thèmes" className="mt-8 flex flex-wrap gap-3">
          {faqData.map((section, i) => (
            <a
              key={section.category}
              href={`#theme-${i}`}
              className="tag paper-lift px-4 pt-2 pb-1.5 font-extrabold"
              style={{ backgroundColor: SHEETS[i % SHEETS.length] }}
            >
              {section.category}
            </a>
          ))}
        </nav>
      </PageHeader>

      <section className="mat pb-20 pt-4">
        <div className="mx-auto grid max-w-3xl gap-14 px-4">
          {faqData.map((section, sIndex) => (
            <div
              key={section.category}
              id={`theme-${sIndex}`}
              className="paper relative scroll-mt-6 bg-white"
              style={{ transform: `rotate(${sIndex % 2 ? 0.6 : -0.6}deg)` }}
            >
              <Tape color={TAPES[sIndex % TAPES.length]} className="-top-3 right-12 rotate-[5deg]" />
              <h2 className="px-7 pt-6 pb-5 text-2xl sm:text-[1.7rem] font-extrabold" style={{ backgroundColor: SHEETS[sIndex % SHEETS.length] }}>
                {section.category}
              </h2>
              <div className="divide-y-2 divide-dashed divide-[var(--grid-strong)] px-7">
                {section.items.map((item) => (
                  <details key={item.question} className="group">
                    <summary className="flex items-center justify-between gap-4 py-5 text-lg font-extrabold leading-snug">
                      {item.question}
                      <Plus size={22} className="chev shrink-0 transition-transform duration-300" aria-hidden />
                    </summary>
                    <div className="pb-6 pr-6 font-semibold leading-relaxed text-[var(--ink-2)]">{item.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="ticket paper bg-white px-10 py-9 text-center rotate-[-0.8deg]">
            <p className="display text-2xl font-extrabold">Vous n'avez pas trouvé votre réponse ?</p>
            <p className="mt-2 font-semibold text-[var(--ink-2)]">Écrivez-nous, ou posez la question aux autres parents sur le groupe.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 font-extrabold text-white hover:bg-[var(--act)]">
                <Mail size={18} aria-hidden /> Nous écrire
              </Link>
              <a href={LINKS.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-white px-6 py-3 font-extrabold hover:bg-[var(--mat)]">
                <Facebook size={18} aria-hidden /> Le groupe des parents
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
