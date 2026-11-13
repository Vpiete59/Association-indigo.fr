// Page introuvable : noindex, pour que Google ne garde pas d'adresses fantômes (« soft 404 »).
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Tape, PAPER } from '../atelier/kit';

export default function NotFoundPage() {
  return (
    <div className="mat min-h-[70vh] px-4 py-24">
      <SEO title="Page introuvable" description="Cette page n'existe pas ou a été déplacée." canonical="/" noIndex />
      <div className="paper relative mx-auto max-w-xl rotate-[-1deg] bg-white p-10 text-center">
        <Tape color={PAPER.beurre} className="-top-3 left-1/2 -translate-x-1/2" />
        <h1 className="text-3xl font-extrabold">Cette page s'est envolée</h1>
        <p className="mt-3 font-semibold text-[var(--ink-2)]">Elle n'existe pas, ou elle a changé d'adresse.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-full bg-[var(--ink)] px-6 py-3.5 font-extrabold text-white hover:bg-[var(--act)]">Retour à l'accueil</Link>
          <Link to="/articles" className="rounded-full border-2 border-[var(--ink)] bg-white px-6 py-3 font-extrabold hover:bg-[var(--mat)]">La bibliothèque</Link>
        </div>
      </div>
    </div>
  );
}
