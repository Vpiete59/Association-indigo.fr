// Bibliothèque « L'atelier » : les pochettes par profil, une recherche, les fiches en tirages scotchés.
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, X, Clock } from 'lucide-react';
import { supabase, type Article } from '../lib/supabase';
import SEO from '../components/SEO';
import { PROFILES, cleanTitle, categoryLabel, type ProfileKey } from '../atelier/data';
import { readingMinutes, articleText, INLINE_LINK } from '../atelier/articleBody';
import { Tape, PAPER, PROFILE_PAPER, articleHref } from '../atelier/kit';

type Filter = 'tout' | ProfileKey | 'famille';

const FILTERS: { key: Filter; label: string; paper: string }[] = [
  { key: 'tout', label: 'Tout', paper: '#FFFFFF' },
  ...PROFILES.map((p) => ({ key: p.key as Filter, label: p.name, paper: PROFILE_PAPER[p.key] })),
  { key: 'famille', label: 'Vie de famille & ateliers', paper: PAPER.menthe },
];

const SEO_PROPS = {
  title: 'Articles TDAH, DYS, HPI, phobie scolaire',
  description:
    'Guides, fiches pratiques et dossiers complets pour comprendre le TDAH, les troubles DYS, le Haut Potentiel et la phobie scolaire. Ressources gratuites pour les familles.',
  canonical: '/articles',
};

const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const TILT = [-1.5, 1, -0.5, 1.5, -1, 0.5];

function excerpt(a: Article) {
  const raw = (a.subtitle || articleText(a).replace(INLINE_LINK, '$1') || '').replace(/[\p{Extended_Pictographic}️]/gu, '').replace(/\s+/g, ' ').trim();
  return raw.length > 150 ? raw.slice(0, raw.lastIndexOf(' ', 150)) + '…' : raw;
}

function matchesFilter(a: Article, f: Filter) {
  if (f === 'tout') return true;
  if (f === 'famille') return a.category === 'Autre';
  const p = PROFILES.find((x) => x.key === f)!;
  return a.category === p.category || a.slug === p.dossier;
}

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');

  const filter: Filter = (FILTERS.some((f) => f.key === params.get('profil')) ? params.get('profil') : 'tout') as Filter;
  const setFilter = (f: Filter) => setParams(f === 'tout' ? {} : { profil: f }, { replace: true });

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        console.error('Erreur chargement articles:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const profile = PROFILES.find((p) => p.key === filter);
  const results = useMemo(() => {
    const q = norm(query.trim());
    // Une recherche porte sur toute la bibliothèque, quel que soit l'onglet ouvert
    if (q) return articles.filter((a) => norm(`${a.title} ${a.subtitle || ''} ${articleText(a)}`).includes(q));
    let list = articles.filter((a) => matchesFilter(a, filter));
    // Le dossier principal du profil passe en tête
    if (profile) list = [...list.filter((a) => a.slug === profile.dossier), ...list.filter((a) => a.slug !== profile.dossier)];
    return list;
  }, [articles, filter, query, profile]);

  return (
    <div>
      <SEO {...SEO_PROPS} />

      <PageHeaderBlock count={articles.length} filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} />

      <section className="bg-white py-14 sm:py-20" aria-busy={loading}>
        <div className="mx-auto max-w-6xl px-4">
          {profile && !query && (
            <div className="paper relative mb-14 grid gap-4 p-7 sm:p-9 md:grid-cols-[1fr_auto] md:items-center" style={{ backgroundColor: PROFILE_PAPER[profile.key] }}>
              <Tape color="#FFFFFF" className="-top-3 left-10 rotate-[-5deg]" />
              <div>
                <h2 className="text-3xl font-extrabold">{profile.name}</h2>
                <p className="mt-2 max-w-2xl text-lg font-semibold text-[var(--ink-2)]">{profile.summary}</p>
              </div>
              <Link
                to={articleHref(profile.dossier)}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 font-extrabold text-white hover:bg-[var(--act)]"
              >
                Lire le dossier <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
          )}

          <p className="mb-8 font-extrabold text-[var(--ink-2)]" aria-live="polite">
            {loading
              ? 'Chargement des fiches…'
              : `${results.length} fiche${results.length > 1 ? 's' : ''}${query.trim() ? ` pour « ${query.trim()} », dans toute la bibliothèque` : ''}`}
          </p>

          {loading ? (
            <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => <li key={i} className="aspect-[4/5] animate-pulse bg-[var(--mat)]" />)}
            </ul>
          ) : results.length ? (
            <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((a, i) => {
                const p = PROFILES.find((x) => x.category === a.category || x.dossier === a.slug);
                const paper = p ? PROFILE_PAPER[p.key] : PAPER.menthe;
                return (
                  <li key={a.id}>
                    <Link
                      to={articleHref(a.slug)}
                      className="paper paper-lift group relative flex h-full flex-col bg-white p-3 pb-5"
                      style={{ transform: `rotate(${TILT[i % TILT.length]}deg)` }}
                    >
                      <Tape color={paper} className="-top-3 left-1/2 -translate-x-1/2" />
                      {a.image_url ? (
                        <img src={a.image_url} alt="" loading="lazy" width={600} height={450} className="aspect-[4/3] w-full object-cover" />
                      ) : (
                        <div aria-hidden className="mat aspect-[4/3] w-full" />
                      )}
                      <div className="flex flex-1 flex-col px-2 pt-4">
                        <span className="tag w-fit px-3 pt-1 pb-0.5 text-[13px] font-extrabold" style={{ backgroundColor: paper }}>
                          {p ? p.name : categoryLabel(a.category)}
                        </span>
                        <h2 className="mt-3 text-xl font-bold leading-snug group-hover:text-[var(--act)]">{cleanTitle(a.title)}</h2>
                        {excerpt(a) && <p className="mt-2 flex-1 text-[15px] font-semibold leading-relaxed text-[var(--ink-2)] line-clamp-3">{excerpt(a)}</p>}
                        <p className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-[var(--ink-2)]">
                          <Clock size={15} aria-hidden /> {readingMinutes(articleText(a))} min de lecture
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="paper relative mx-auto max-w-xl rotate-[-1deg] bg-[#FFF9E3] p-10 text-center">
              <Tape color={PAPER.saumon} className="-top-3 left-1/2 -translate-x-1/2" />
              <p className="text-2xl font-extrabold display">Aucune fiche ne correspond{query ? ` à « ${query} »` : ''}</p>
              <p className="mt-2 font-semibold text-[var(--ink-2)]">Essayez un autre mot, ou regardez toutes les fiches.</p>
              <button
                type="button"
                onClick={() => { setQuery(''); setFilter('tout'); }}
                className="mt-6 rounded-full bg-[var(--ink)] px-6 py-3.5 font-extrabold text-white hover:bg-[var(--act)]"
              >
                Voir toutes les fiches
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PageHeaderBlock({
  count, filter, setFilter, query, setQuery,
}: { count: number; filter: Filter; setFilter: (f: Filter) => void; query: string; setQuery: (q: string) => void }) {
  return (
    <section className="mat relative overflow-hidden">
      <div aria-hidden className="mat-diagonal pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 pt-12 sm:pt-16">
        <h1
          className="settle paper w-fit bg-white px-4 pt-2 pb-1.5 text-[clamp(2.2rem,5vw,3.9rem)] font-extrabold leading-[1.05]"
          style={{ clipPath: 'polygon(0 3%,100% 0,99.5% 97%,0.5% 100%)', '--r': '-1.2deg' } as CSSProperties}
        >
          La bibliothèque des parents
        </h1>
        <p className="mt-6 max-w-[42rem] text-lg sm:text-xl font-semibold leading-relaxed text-[var(--ink-2)]">
          {count ? `${count} articles` : 'Des articles'} écrits par l'association pour comprendre le TDAH, les troubles DYS, le haut potentiel,
          l'hypersensibilité et la phobie scolaire. Gratuits, sans inscription.
        </p>

        <div className="mt-8 max-w-md">
          <label htmlFor="recherche" className="display text-lg font-bold">Chercher un mot</label>
          <div className="paper relative mt-2 flex items-center bg-white">
            <Search size={20} className="ml-4 shrink-0 text-[var(--ink-2)]" aria-hidden />
            <input
              id="recherche"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="sommeil, MDPH, dyslexie…"
              className="w-full bg-transparent px-3 py-3.5 text-lg font-semibold placeholder:text-[#7D7AA0] focus:outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Effacer la recherche" className="mr-2 grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--mat)]">
                <X size={18} aria-hidden />
              </button>
            )}
          </div>
        </div>

        {/* Les onglets des pochettes */}
        <div role="group" aria-label="Filtrer par profil" className="mt-10 flex flex-wrap items-end gap-2">
          {FILTERS.map((f) => {
            const on = f.key === filter;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.key)}
                className={`display rounded-t-2xl px-4 sm:px-5 text-[15px] font-bold transition-[padding,transform] duration-200 ${
                  on ? 'pt-4 pb-3 shadow-[0_-4px_10px_-4px_rgba(42,40,78,.25)]' : 'pt-2.5 pb-2 translate-y-1 hover:translate-y-0 opacity-90'
                }`}
                style={{ backgroundColor: on ? (f.key === 'tout' ? '#FFFFFF' : f.paper) : f.paper, outline: on ? '2px solid var(--ink)' : undefined, outlineOffset: on ? '-2px' : undefined }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
