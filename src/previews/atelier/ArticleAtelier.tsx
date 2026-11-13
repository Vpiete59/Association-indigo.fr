// Page article « L'atelier » : une feuille blanche posée sur le tapis, pensée pour la lecture.
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, Facebook, CalendarDays } from 'lucide-react';
import { supabase, type Article } from '../../lib/supabase';
import { PROFILES, LINKS, usePreviewData, cleanTitle, categoryLabel } from '../shared';
import { parseArticle, readingMinutes, type Block } from './articleBody';
import {
  css, AtelierHead, AtelierHeader, AtelierFooter, Tape, Sparkle, CutLine,
  PAPER, PROFILE_PAPER, SPARK, BASE, articleHref,
} from './kit';

const BULLET_COLORS = [SPARK.orange, SPARK.indigo, SPARK.rouge];

function Body({ blocks }: { blocks: Block[] }) {
  return (
    <div className="text-[1.125rem] leading-[1.8] text-[#34325A]">
      {blocks.map((b, i) => {
        if (b.type === 'lead') return <p key={i} className="text-[1.3rem] leading-[1.6] font-bold text-[var(--ink)]">{b.text}</p>;
        if (b.type === 'h2')
          return (
            <h2 key={i} id={b.id} className="scroll-mt-6 mt-14 mb-4 text-[1.65rem] sm:text-[1.85rem] font-extrabold leading-tight text-[var(--ink)]">
              <span className="box-decoration-clone px-1.5 -mx-1.5" style={{ backgroundImage: `linear-gradient(transparent 58%, ${PAPER.beurre} 58%, ${PAPER.beurre} 92%, transparent 92%)` }}>
                {b.text}
              </span>
            </h2>
          );
        if (b.type === 'ul')
          return (
            <ul key={i} className="my-6 grid gap-3">
              {b.items.map((it, k) => (
                <li key={k} className="flex gap-3">
                  <Sparkle color={BULLET_COLORS[k % 3]} size={18} className="mt-[0.45em] shrink-0" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          );
        return <p key={i} className="mt-5 first:mt-0">{b.text}</p>;
      })}
    </div>
  );
}

export default function ArticleAtelier() {
  const { slug = '' } = useParams();
  const data = usePreviewData();
  const [article, setArticle] = useState<Article | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>('loading');

  useEffect(() => {
    window.scrollTo(0, 0);
    setState('loading');
    supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data: a }) => {
        setArticle(a);
        setState(a ? 'ok' : 'missing');
      });
  }, [slug]);

  const profile = article ? PROFILES.find((p) => p.category === article.category || p.dossier === article.slug) : undefined;
  const paper = profile ? PROFILE_PAPER[profile.key] : PAPER.menthe;
  const blocks = article ? parseArticle(article.paragraph_1) : [];
  const toc = blocks
    .filter((b): b is Extract<Block, { type: 'h2' }> => b.type === 'h2')
    .filter((h, i, all) => all.findIndex((x) => x.text.toLowerCase() === h.text.toLowerCase()) === i);
  const sameShelf = article
    ? data.articles.filter((a) => a.slug !== article.slug && (profile ? a.category === profile.category || a.slug === profile.dossier : a.category === article.category))
    : [];
  const related = (sameShelf.length ? sameShelf : data.articles.filter((a) => a.slug !== slug)).slice(0, 4);
  const updated = article ? new Date(article.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <div className="atelier">
      <AtelierHead title={`${article ? cleanTitle(article.title) : 'Article'} · Maquette C | Association Indigo`} />
      <style>{css}</style>
      <AtelierHeader />

      <main className="mat pb-24">
        {state === 'loading' && (
          <div className="mx-auto max-w-6xl px-4 pt-14">
            <div className="h-14 w-2/3 bg-white/60 animate-pulse" />
            <div className="mt-10 h-[60vh] bg-white/70 animate-pulse" />
          </div>
        )}

        {state === 'missing' && (
          <div className="mx-auto max-w-xl px-4 py-24">
            <div className="paper relative bg-white p-10 text-center rotate-[-1deg]">
              <Tape color={PAPER.saumon} className="-top-3 left-1/2 -translate-x-1/2" />
              <h1 className="text-3xl font-extrabold">Cette fiche n'est plus dans la pochette</h1>
              <p className="mt-3 font-semibold text-[var(--ink-2)]">Elle a peut-être été déplacée ou renommée.</p>
              <Link to={`${BASE}#bibliotheque`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-3.5 font-extrabold">
                Retour à la bibliothèque
              </Link>
            </div>
          </div>
        )}

        {state === 'ok' && article && (
          <>
            {/* En-tête de l'article */}
            <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14 grid lg:grid-cols-[1.35fr_1fr] gap-10 items-end">
              <div>
                <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 text-[15px] font-extrabold">
                  <Link to={`${BASE}#bibliotheque`} className="inline-flex items-center gap-1.5 underline">
                    <ArrowLeft size={16} aria-hidden /> Bibliothèque
                  </Link>
                  <span aria-hidden>/</span>
                  <span className="tag inline-block px-4 pt-1.5 pb-1" style={{ backgroundColor: paper }}>
                    {profile ? profile.name : categoryLabel(article.category)}
                  </span>
                </nav>
                <h1 className="mt-6 text-[clamp(2.2rem,4.6vw,3.7rem)] font-extrabold leading-[1.04]">{cleanTitle(article.title)}</h1>
                {article.subtitle && <p className="mt-4 text-xl font-semibold text-[var(--ink-2)] max-w-[40rem]">{article.subtitle}</p>}
                <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-[15px] font-bold text-[var(--ink-2)]">
                  <span className="inline-flex items-center gap-1.5"><Clock size={16} aria-hidden /> {readingMinutes(article.paragraph_1)} min de lecture</span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays size={16} aria-hidden /> Mis à jour le {updated}</span>
                </p>
              </div>
              {article.image_url && (
                <figure className="paper relative bg-white p-2.5 pb-3 rotate-[2deg] max-w-[420px] lg:justify-self-end w-full">
                  <Tape color={PAPER.ciel} className="-top-3 left-8 rotate-[-6deg]" />
                  <img src={article.image_url} alt="" className="w-full aspect-[4/3] object-cover" />
                </figure>
              )}
            </div>

            {/* La feuille */}
            <div className="mx-auto max-w-6xl px-4 mt-12 grid lg:grid-cols-[minmax(0,820px)_290px] lg:justify-between gap-10 items-start">
              <article className="paper bg-white px-6 sm:px-14 py-12 sm:py-14">
                <div className="max-w-[68ch]">
                  {blocks.length ? <Body blocks={blocks} /> : <p className="text-lg font-semibold text-[var(--ink-2)]">Cette fiche est surtout visuelle : l'affiche est juste en dessous.</p>}

                  {article.poster_image_url && (
                    <figure className="relative mx-auto mt-12 max-w-md">
                      <div className="paper relative bg-white p-3 rotate-[-1.5deg]">
                        <Tape color={PAPER.saumon} className="-top-3 left-1/2 -translate-x-1/2" />
                        <img src={article.poster_image_url} alt={`Affiche : ${cleanTitle(article.title)}`} loading="lazy" className="w-full" />
                      </div>
                    </figure>
                  )}
                  {article.image_2_url && (
                    <img src={article.image_2_url} alt="" loading="lazy" className="paper mt-12 w-full" />
                  )}
                </div>

                {article.cta_text && article.cta_link && (
                  <div className="mt-14">
                    <CutLine />
                    <a href={article.cta_link} className="ticket paper mt-8 flex flex-wrap items-center justify-between gap-4 px-10 py-6" style={{ backgroundColor: PAPER.beurre }}>
                      <span className="display text-2xl font-extrabold">{article.cta_text}</span>
                      <ArrowUpRight size={26} aria-hidden />
                    </a>
                  </div>
                )}
              </article>

              {/* Marge : sommaire et prochaines étapes */}
              <aside className="grid gap-8 lg:sticky lg:top-6">
                {toc.length >= 2 && (
                  <nav aria-label="Sommaire" className="paper relative px-6 pt-8 pb-6" style={{ backgroundColor: paper }}>
                    <span aria-hidden className="absolute -top-3.5 left-0 h-4 w-20 rounded-t-lg" style={{ backgroundColor: paper }} />
                    <p className="display text-xl font-extrabold">Sommaire</p>
                    <ol className="mt-3 grid gap-2.5 text-[15px] font-bold leading-snug">
                      {toc.map((h) => (
                        <li key={h.id}><a href={`#${h.id}`} className="hover:underline">{h.text}</a></li>
                      ))}
                    </ol>
                  </nav>
                )}
                <div className="ticket paper bg-white px-8 py-6">
                  <p className="display text-xl font-extrabold leading-tight">Et si on en parlait ?</p>
                  <p className="mt-2 text-[15px] font-semibold text-[var(--ink-2)]">
                    Des parents qui vivent la même chose se retrouvent aux groupes de parole, à Préseau.
                  </p>
                  <Link to={`${BASE}#ateliers`} className="mt-4 inline-flex items-center gap-1.5 font-extrabold underline">
                    Voir les ateliers <ArrowRight size={16} aria-hidden />
                  </Link>
                  <a href={LINKS.facebook} className="mt-2 flex items-center gap-1.5 font-extrabold underline">
                    <Facebook size={16} aria-hidden /> Le groupe des parents
                  </a>
                </div>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://association-indigo.fr/articles/${article.slug}`)}`}
                  className="inline-flex items-center gap-2 font-extrabold underline"
                >
                  <Facebook size={16} aria-hidden /> Partager cette fiche
                </a>
              </aside>
            </div>

            {/* Dans la même pochette */}
            {related.length > 0 && (
              <section className="mx-auto max-w-6xl px-4 mt-20">
                <h2 className="text-[clamp(1.8rem,3.4vw,2.5rem)] font-extrabold">
                  {sameShelf.length ? 'Dans la même pochette' : 'À lire aussi'}
                </h2>
                <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {related.map((a, i) => (
                    <li key={a.slug}>
                      <Link
                        to={articleHref(a.slug)}
                        className="paper paper-lift group flex h-full flex-col bg-white p-3"
                        style={{ transform: `rotate(${[-1.5, 1, -0.5, 1.5][i]}deg)` }}
                      >
                        {a.image_url && <img src={a.image_url} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover" />}
                        <span className="mt-3 px-1 pb-1 font-extrabold leading-snug group-hover:text-[var(--act)]">{cleanTitle(a.title)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>

      <AtelierFooter />
    </div>
  );
}
