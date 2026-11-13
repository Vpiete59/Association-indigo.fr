// Direction A — « Le classeur » : intercalaires pastel de la liste de fournitures.
import { useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Facebook, MapPin, Clock, Mail, Menu, X, Heart, Check } from 'lucide-react';
import {
  PROFILES, TESTIMONIALS, PARTNERS, LINKS, usePreviewData, articlesFor, cleanTitle, eventDay, categoryLabel, type ProfileKey,
} from '../atelier/data';

const TINT: Record<ProfileKey, string> = {
  tdah: '#D9DDFB',
  dys: '#FFD9C7',
  hpi: '#FBEBB5',
  phobie: '#CFEBD0',
  hyper: '#CFE6F6',
};

const TAB_LABEL: Record<ProfileKey, string> = {
  tdah: 'TDAH', dys: 'DYS', hpi: 'Haut potentiel', phobie: 'Phobie scolaire', hyper: 'Hypersensibilité',
};

const css = `
.dirA { --ink:#23264A; --ink-2:#464A78; --act:#4553B8; --paper:#FFFFFF; --rule:#C9CEF2;
  font-family:'Atkinson Hyperlegible',system-ui,sans-serif; color:var(--ink); background:#fff; }
.dirA h1,.dirA h2,.dirA h3,.dirA .display { font-family:'Lexend',system-ui,sans-serif; text-wrap:balance; }
.dirA ::selection { background:#FFD9C7; color:var(--ink); }
.dirA :focus-visible { outline:3px solid var(--act); outline-offset:3px; border-radius:6px; }
.dirA a { text-underline-offset:4px; text-decoration-thickness:2px; }
.dirA .hero-ground { transition: background-color .45s cubic-bezier(.16,1,.3,1); }
.dirA .sheet-enter { animation: dirA-sheet .38s cubic-bezier(.16,1,.3,1); }
@keyframes dirA-sheet { from { transform: translateY(18px) rotate(-.6deg); opacity:.4 } to { transform:none; opacity:1 } }
.dirA .seyes { background-color:#fff;
  background-image: linear-gradient(90deg, transparent 63px, #F4B9A6 63px, #F4B9A6 65px, transparent 65px),
  repeating-linear-gradient(180deg, transparent 0 31px, var(--rule) 31px 32px); }
.dirA .hole { box-shadow: inset 0 2px 3px rgba(35,38,74,.25); }
@media (max-width: 640px){ .dirA .seyes { background-image: repeating-linear-gradient(180deg, transparent 0 31px, var(--rule) 31px 32px); } }
@media (prefers-reduced-motion: reduce){ .dirA .sheet-enter{animation:none} .dirA .hero-ground{transition:none} }
`;

export default function DirectionA() {
  const data = usePreviewData();
  const [active, setActive] = useState<ProfileKey>('tdah');
  const [menu, setMenu] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const profile = PROFILES.find((p) => p.key === active)!;
  const related = articlesFor(profile, data.articles).slice(0, 3);
  const latest = data.articles.filter((a) => a.image_url).slice(0, 4);

  const onTabKey = (e: KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + PROFILES.length) % PROFILES.length;
    setActive(PROFILES[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="dirA">
      <Helmet>
        <title>Maquette A · Le classeur | Association Indigo</title>
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Lexend:wght@500;600;700;800&display=swap"
        />
      </Helmet>
      <style>{css}</style>

      {/* En-tête */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[var(--rule)]">
        <div className="mx-auto max-w-6xl px-4 h-[72px] flex items-center justify-between gap-4">
          <Link to="/preview/a" className="flex items-center gap-3 shrink-0">
            <img src="/logo-indigo.png" alt="" width={44} height={44} className="h-11 w-11" />
            <span className="display font-bold text-lg leading-none">
              Association<br className="sm:hidden" /> <span className="text-[var(--act)]">Indigo</span>
            </span>
          </Link>
          <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-1 text-[15px] font-bold">
            {['Comprendre', 'Rendez-vous', 'Questions fréquentes', 'Contact'].map((l) => (
              <a key={l} href="#" className="px-4 py-2.5 rounded-full hover:bg-[#EEF0FD]">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={LINKS.adhesion} className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-5 py-3 text-[15px] font-bold hover:bg-[var(--act)] transition-colors">
              Adhérer · 5 € par an
            </a>
            <button className="lg:hidden p-3 rounded-full hover:bg-[#EEF0FD]" aria-expanded={menu} aria-label="Menu" onClick={() => setMenu(!menu)}>
              {menu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {menu && (
          <nav aria-label="Navigation mobile" className="lg:hidden border-t border-[var(--rule)] px-4 py-3 grid gap-1 font-bold">
            {['Comprendre', 'Rendez-vous', 'Questions fréquentes', 'Contact'].map((l) => (
              <a key={l} href="#" className="px-3 py-3 rounded-xl hover:bg-[#EEF0FD]">{l}</a>
            ))}
            <a href={LINKS.adhesion} className="mt-1 px-3 py-3 rounded-xl bg-[var(--ink)] text-white text-center">Adhérer · 5 € par an</a>
          </nav>
        )}
      </header>

      {/* Hero : le classeur */}
      <section className="hero-ground" style={{ backgroundColor: TINT[active] }}>
        <div className="mx-auto max-w-7xl px-4 pt-12 pb-16 lg:pt-16 lg:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 lg:pt-10">
            <h1 className="font-extrabold text-[clamp(2.2rem,4.2vw,3.3rem)] leading-[1.06] tracking-[-0.025em]">
              Votre enfant voit le monde autrement. Ici, vous n'êtes plus seuls.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[var(--ink-2)] max-w-[34rem]">
              L'Association Indigo réunit des parents d'enfants TDAH, DYS, HPI, hypersensibles ou en phobie scolaire,
              à Préseau près de Valenciennes. Des dossiers pour comprendre, des groupes de parole pour souffler,
              des ateliers pour les enfants.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-bold">
              <a href="#rendez-vous" className="inline-flex items-center gap-2 underline">
                Venir à un groupe de parole <ArrowRight size={18} aria-hidden />
              </a>
              <a href={LINKS.facebook} className="inline-flex items-center gap-2 underline">
                <Facebook size={18} aria-hidden /> Le groupe des parents
              </a>
            </div>
          </div>

          {/* Le classeur à intercalaires */}
          <div className="lg:col-span-7">
            <p id="classeur-label" className="display font-semibold mb-3 text-[var(--ink-2)]">Mon enfant est concerné par…</p>
            <div role="tablist" aria-labelledby="classeur-label" className="flex flex-wrap gap-1.5 pl-4 sm:pl-8">
              {PROFILES.map((p, i) => {
                const on = p.key === active;
                return (
                  <button
                    key={p.key}
                    ref={(el) => { tabRefs.current[i] = el; }}
                    role="tab"
                    id={`tab-${p.key}`}
                    aria-selected={on}
                    aria-controls="classeur-sheet"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(p.key)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={`display relative rounded-t-2xl px-4 sm:px-5 text-[15px] font-bold border-2 border-b-0 border-[var(--ink)] transition-[padding,transform] duration-200 ${
                      on ? 'pt-3.5 pb-3 -mb-[2px] z-10' : 'pt-2.5 pb-2 translate-y-1 hover:translate-y-0'
                    }`}
                    style={{ backgroundColor: on ? '#fff' : TINT[p.key] }}
                  >
                    {TAB_LABEL[p.key]}
                  </button>
                );
              })}
            </div>
            <div
              key={active}
              id="classeur-sheet"
              role="tabpanel"
              aria-labelledby={`tab-${active}`}
              className="sheet-enter relative bg-white border-2 border-[var(--ink)] rounded-[22px] shadow-[0_18px_40px_-18px_rgba(35,38,74,.45)] pl-12 sm:pl-20 pr-6 sm:pr-10 py-9 min-h-[380px]"
            >
              {/* perforations : on voit la couleur du fond à travers */}
              <div aria-hidden className="absolute left-4 sm:left-7 top-0 bottom-0 flex flex-col justify-around py-10">
                {[0, 1, 2].map((h) => (
                  <span key={h} className="hole block h-4 w-4 rounded-full" style={{ backgroundColor: TINT[active] }} />
                ))}
              </div>
              <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold leading-tight">{profile.name}</h2>
              <p className="mt-1 font-bold text-[var(--ink-2)]">{profile.short}</p>
              <p className="mt-5 text-lg leading-relaxed max-w-[36rem]">{profile.summary}</p>
              <Link
                to={`/articles/${profile.dossier}`}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-3.5 font-bold hover:bg-[var(--act)] transition-colors"
              >
                Lire le dossier {profile.name} <ArrowRight size={18} aria-hidden />
              </Link>
              {related.length > 0 && (
                <div className="mt-8 pt-6 border-t-2 border-dashed border-[var(--rule)]">
                  <p className="display font-semibold text-[15px] mb-3">Aussi dans ce classeur</p>
                  <ul className="grid gap-2">
                    {related.map((a) => (
                      <li key={a.slug}>
                        <Link to={`/articles/${a.slug}`} className="group inline-flex items-start gap-2 font-bold hover:text-[var(--act)]">
                          <ArrowRight size={18} className="mt-0.5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
                          {cleanTitle(a.title)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Rendez-vous : la page d'agenda */}
      <section id="rendez-vous" className="seyes py-20">
        <div className="mx-auto max-w-5xl px-4 sm:pl-24">
          <h2 className="text-[clamp(1.9rem,3.6vw,2.8rem)] font-bold leading-tight">
            {data.eventsArePast ? 'Les derniers rendez-vous' : 'Les prochains rendez-vous'}
          </h2>
          <p className="mt-3 text-lg text-[var(--ink-2)] max-w-[40rem]">
            Groupes de parole pour les parents, ateliers pour les enfants, à la salle la Verrière de Préseau.
            {data.eventsArePast && ' La prochaine date sera annoncée en premier sur le groupe Facebook des parents.'}
          </p>
          {data.eventsArePast && (
            <a href={LINKS.facebook} className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-white px-5 py-3 font-bold hover:bg-[#EEF0FD]">
              <Facebook size={18} aria-hidden /> Être prévenu de la prochaine date
            </a>
          )}
          <ol className="mt-10 grid gap-4">
            {data.loading && <li className="h-28 rounded-2xl bg-white/70 animate-pulse" />}
            {data.events.map((e) => {
              const d = eventDay(e.event_date);
              return (
                <li key={e.id} className="bg-white rounded-2xl border-2 border-[var(--ink)] p-4 sm:p-5 flex gap-4 sm:gap-6 items-center">
                  <div className="shrink-0 w-[74px] text-center rounded-xl py-2" style={{ backgroundColor: TINT.dys }}>
                    <span className="block text-xs font-bold uppercase">{d.weekday.slice(0, 3)}</span>
                    <span className="display block text-3xl font-extrabold leading-none tabular-nums">{d.day}</span>
                    <span className="block text-sm font-bold">{d.month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-lg leading-snug">{e.title}</h3>
                    <p className="mt-1 text-[15px] text-[var(--ink-2)] flex flex-wrap gap-x-4 gap-y-1">
                      <span className="inline-flex items-center gap-1.5"><Clock size={15} aria-hidden /> {d.time}</span>
                      {e.location && <span className="inline-flex items-center gap-1.5"><MapPin size={15} aria-hidden /> {e.location}</span>}
                      {data.eventsArePast && <span className="font-bold">· passé</span>}
                    </p>
                  </div>
                  {e.image_url && (
                    <img src={e.image_url} alt="" loading="lazy" width={72} height={96} className="hidden sm:block h-24 w-[72px] object-cover rounded-lg border border-[var(--rule)]" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Dernières fiches */}
      <section className="py-20" style={{ backgroundColor: TINT.phobie }}>
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.9rem,3.6vw,2.8rem)] font-bold leading-tight">Les dernières fiches</h2>
            <Link to="/articles" className="font-bold underline inline-flex items-center gap-2">
              Toute la bibliothèque ({data.articles.length || '…'} articles) <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          {latest.length > 0 && (
            <div className="mt-10 grid lg:grid-cols-2 gap-6">
              <Link to={`/articles/${latest[0].slug}`} className="group bg-white rounded-[22px] border-2 border-[var(--ink)] overflow-hidden">
                <img src={latest[0].image_url} alt="" loading="lazy" className="w-full aspect-[16/9] object-cover" />
                <div className="p-6">
                  <p className="text-sm font-bold text-[var(--ink-2)]">{categoryLabel(latest[0].category)}</p>
                  <h3 className="mt-1 text-2xl font-bold leading-snug group-hover:text-[var(--act)]">{cleanTitle(latest[0].title)}</h3>
                </div>
              </Link>
              <ul className="grid gap-4 content-start">
                {latest.slice(1).map((a) => (
                  <li key={a.slug}>
                    <Link to={`/articles/${a.slug}`} className="group flex gap-4 items-center bg-white rounded-2xl border-2 border-[var(--ink)] p-3 pr-5">
                      <img src={a.image_url} alt="" loading="lazy" className="h-20 w-24 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[var(--ink-2)]">{categoryLabel(a.category)}</p>
                        <h3 className="font-bold leading-snug group-hover:text-[var(--act)]">{cleanTitle(a.title)}</h3>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20" style={{ backgroundColor: TINT.dys }}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-[clamp(1.9rem,3.6vw,2.8rem)] font-bold leading-tight">Ce que disent les familles</h2>
          <div className="mt-10 grid md:grid-cols-2 gap-10">
            {TESTIMONIALS.map((t) => (
              <figure key={t.author}>
                <blockquote className="display text-[1.35rem] sm:text-2xl leading-snug font-medium">«&nbsp;{t.text}&nbsp;»</blockquote>
                <figcaption className="mt-4 font-bold">{t.author}, <span className="font-normal">{t.role}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Rejoindre / soutenir */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-[clamp(1.9rem,3.6vw,2.8rem)] font-bold leading-tight max-w-[36rem]">
            L'association vit grâce aux familles qui la rejoignent
          </h2>
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {[
              {
                tab: 'Adhérer', tint: TINT.phobie, price: '5 €', unit: 'par an', href: LINKS.adhesion, cta: "J'adhère sur HelloAsso",
                body: ['Accès prioritaire aux ateliers', "Participation à la vie de l'association", 'Un soutien moral entre parents'],
              },
              {
                tab: 'Donner', tint: TINT.hpi, price: 'Libre', unit: '', href: LINKS.don, cta: 'Je fais un don',
                body: ['Du matériel pédagogique pour les ateliers', 'Des intervenants spécialisés', 'Plus de familles accompagnées'],
              },
            ].map((c) => (
              <div key={c.tab}>
                <span className="display inline-block ml-8 rounded-t-2xl border-2 border-b-0 border-[var(--ink)] px-5 pt-2.5 pb-2 font-bold" style={{ backgroundColor: c.tint }}>
                  {c.tab}
                </span>
                <div className="relative -mt-[2px] rounded-[22px] border-2 border-[var(--ink)] p-8 pl-14" style={{ backgroundColor: c.tint }}>
                  <div aria-hidden className="absolute left-5 top-8 bottom-8 flex flex-col justify-between">
                    {[0, 1, 2].map((h) => <span key={h} className="hole block h-3.5 w-3.5 rounded-full bg-white" />)}
                  </div>
                  <p className="display text-5xl font-extrabold tabular-nums">{c.price} <span className="text-xl font-semibold">{c.unit}</span></p>
                  <ul className="mt-6 grid gap-2.5">
                    {c.body.map((b) => (
                      <li key={b} className="flex gap-2.5 items-start"><Check size={20} className="mt-0.5 shrink-0" aria-hidden /> {b}</li>
                    ))}
                  </ul>
                  <a href={c.href} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-3.5 font-bold hover:bg-[var(--act)] transition-colors">
                    {c.tab === 'Donner' && <Heart size={18} aria-hidden />} {c.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="border-t-2 border-[var(--ink)]" style={{ backgroundColor: TINT.tdah }}>
        <div className="mx-auto max-w-6xl px-4 py-14 grid gap-10 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo-indigo.png" alt="" width={48} height={48} className="h-12 w-12" />
              <p className="display font-bold text-xl">Association Indigo</p>
            </div>
            <p className="mt-4 text-[var(--ink-2)]">Accompagner les particularités, valoriser les singularités. Association loi 1901.</p>
            <p className="mt-4 flex items-center gap-2 font-bold"><MapPin size={18} aria-hidden /> Préseau (59990), Hauts-de-France</p>
            <a href={`mailto:${LINKS.email}`} className="mt-2 flex items-center gap-2 font-bold underline"><Mail size={18} aria-hidden /> {LINKS.email}</a>
          </div>
          <div className="lg:col-span-2">
            <p className="display font-semibold">Ils nous soutiennent</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {PARTNERS.map((p) => (
                <li key={p.name}>
                  <a href={p.url} className="flex items-center gap-3 rounded-xl bg-white border-2 border-[var(--ink)] pl-2 pr-4 py-2 font-bold text-[15px] hover:-translate-y-0.5 transition-transform">
                    <img src={p.image} alt="" loading="lazy" className="h-9 w-9 object-contain" /> {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--ink)]/20">
          <div className="mx-auto max-w-6xl px-4 py-5 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            <span>© {new Date().getFullYear()} Association Indigo</span>
            <Link to="/mentions-legales" className="underline">Mentions légales</Link>
            <Link to="/politique-confidentialite" className="underline">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
