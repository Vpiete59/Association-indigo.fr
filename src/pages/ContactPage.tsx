import Contact from '../components/Contact';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';

export default function ContactPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <SEO
        title="Nous Contacter | Association Indigo - Preseau"
        description="Contactez l'Association Indigo à Preseau. Une question sur nos ateliers, groupes de parole ou l'accompagnement des enfants atypiques ? Nous vous répondons rapidement."
        canonical="/contact"
      />

      {/* Composant Contact (Formulaire + Infos) */}
      <div className="pt-20">
        <Contact />
      </div>

      {/* Lien vers la FAQ */}
      <section className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <span className="inline-flex items-center justify-center p-3 bg-indigo-primary/10 text-indigo-primary rounded-full mb-4">
            <HelpCircle size={28} />
          </span>
          <p className="font-heading font-bold text-xl text-dark-text mb-2">
            Vous avez des questions sur l'association ?
          </p>
          <p className="text-dark-text/60 mb-6">
            Consultez notre Foire aux Questions pour trouver rapidement les réponses.
          </p>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-primary text-white font-heading font-bold rounded-full hover:bg-indigo-primary/90 transition-all shadow-md"
          >
            <HelpCircle size={20} />
            Voir la FAQ
          </Link>
        </div>
      </section>
    </div>
  );
}
