// Contact « L'atelier » : la carte postale, et les autres moyens de nous joindre.
import { Link } from 'react-router-dom';
import { Mail, MapPin, Facebook, ArrowRight } from 'lucide-react';
import Contact from '../components/Contact';
import SEO from '../components/SEO';
import { LINKS } from '../atelier/data';
import { PageHeader, Tape, PAPER } from '../atelier/kit';

export default function ContactPage() {
  return (
    <div>
      <SEO
        title="Nous Contacter | Association Indigo - Preseau"
        description="Contactez l'Association Indigo à Preseau. Une question sur nos ateliers, groupes de parole ou l'accompagnement des enfants atypiques ? Nous vous répondons rapidement."
        canonical="/contact"
      />

      <PageHeader
        title="Contacter l'Association Indigo"
        paper={PAPER.saumon}
        intro="Une question sur nos ateliers ? Besoin d'échanger sur votre situation ? Nous sommes là pour vous écouter et vous répondre."
      />

      <section className="mat pb-20">
        <div className="mx-auto max-w-5xl px-4">
          <Contact />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <a href={`mailto:${LINKS.email}`} className="paper paper-lift relative block bg-white p-6 rotate-[-1deg]">
              <Tape color={PAPER.lilas} className="-top-3 left-8 rotate-[-6deg]" />
              <Mail size={22} aria-hidden />
              <p className="display mt-3 text-xl font-extrabold">Par email</p>
              <p className="mt-1 break-all font-bold underline">{LINKS.email}</p>
            </a>
            <a href={LINKS.facebook} target="_blank" rel="noopener noreferrer" className="paper paper-lift relative block p-6 rotate-[1deg]" style={{ backgroundColor: PAPER.ciel }}>
              <Tape color={PAPER.beurre} className="-top-3 left-8 rotate-[4deg]" />
              <Facebook size={22} aria-hidden />
              <p className="display mt-3 text-xl font-extrabold">Le groupe des parents</p>
              <p className="mt-1 font-semibold text-[var(--ink-2)]">Le groupe privé Facebook, pour les questions du quotidien.</p>
            </a>
            <div className="paper relative bg-white p-6 rotate-[-0.5deg]">
              <Tape color={PAPER.menthe} className="-top-3 left-8 rotate-[-3deg]" />
              <MapPin size={22} aria-hidden />
              <p className="display mt-3 text-xl font-extrabold">Par courrier</p>
              <p className="mt-1 font-semibold text-[var(--ink-2)]">Association Indigo<br />Mairie de Preseau<br />59990 Preseau</p>
            </div>
          </div>

          <p className="mt-12 text-center text-lg font-semibold text-[var(--ink-2)]">
            La réponse est peut-être déjà là :{' '}
            <Link to="/faq" className="inline-flex items-center gap-1.5 font-extrabold text-[var(--ink)] underline">
              les questions fréquentes <ArrowRight size={17} aria-hidden />
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
