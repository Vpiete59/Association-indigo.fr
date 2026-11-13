// Direction B — « Ciel indigo » : l'heure indigo au-dessus des champs de Préseau, une étoile par profil.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Facebook, MapPin, Clock, Mail, Menu, X, Heart } from 'lucide-react';
import {
  PROFILES, TESTIMONIALS, PARTNERS, LINKS, usePreviewData, articlesFor, cleanTitle, eventDay, categoryLabel, type ProfileKey,
} from './shared';

// Couleurs des étincelles du logo, adoucies
const STAR: Record<ProfileKey, { fill: string; x: number; y: number }> = {
  tdah: { fill: '#F2A65A', x: 8, y: 50 },
  dys: { fill: '#E9806A', x: 38, y: 14 },
  hpi: { fill: '#4553B8', x: 68, y: 24 },
  phobie: { fill: '#F7C873', x: 40, y: 80 },
  hyper: { fill: '#8E7CE0', x: 86, y: 54 },
};
const ORDER: ProfileKey[] = ['tdah', 'dys', 'hpi', 'hyper', 'phobie'];

// Petites étoiles de fond (positions fixes, décoratives)
const DUST = [
  [8, 12], [15, 48], [33, 8], [38, 40], [52, 30], [64, 9], [80, 10], [93, 18], [70, 70], [12, 70], [28, 62], [96, 38],
];

const css = `
.dirB { --ink:#1F2457; --ink-2:#464B80; --act:#3F4BA8; --mist:#F4F3FC; --night:#252A63;
  font-family:'Nunito Sans',system-ui,sans-serif; color:var(--ink); background:#fff; }
.dirB h1,.dirB h2,.dirB h3,.dirB .display { font-family:'Fredoka',system-ui,sans-serif; text-wrap:balance; }
.dirB ::selection { background:#D8D0F2; color:var(--ink); }
.dirB :focus-visible { outline:3px solid var(--act); outline-offset:3px; border-radius:10px; }
.dirB a { text-underline-offset:4px; text-decoration-thickness:2px; }
.dirB .sky { background:
  linear-gradient(180deg, #B9BEEE 0%, #CDC8F1 38%, #EBCFDD 70%, #FBD6C5 100%); }
.dirB .star { transition: transform .5s cubic-bezier(.16,1,.3,1); }
.dirB .star[aria-pressed="true"] svg { animation: dirB-twinkle 3.2s ease-in-out infinite; }
@keyframes dirB-twinkle { 0%,100% { transform: rotate(0) scale(1) } 50% { transform: rotate(12deg) scale(1.08) } }
.dirB .panel-in { animation: dirB-panel .4s cubic-bezier(.16,1,.3,1); }
@keyframes dirB-panel { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform:none } }
@media (prefers-reduced-motion: reduce){ .dirB .star[aria-pressed="true"] svg, .dirB .panel-in { animation:none } }
`;

function Sparkle({ fill, size = 40 }: { fill: string; size?: number }) {
  // Étincelle à 4 branches, comme celles du logo
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <path d="M20 1.5c1.3 9.6 5.3 15.6 17 18.5-11.7 2.9-15.7 8.9-17 18.5-1.3-9.6-5.3-15.6-17-18.5C14.7 17.1 18.7 11.1 20 1.5Z" fill={fill} stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function DirectionB() {
  const data = usePreviewData();
  const [active, setActive] = useState<ProfileKey | null>(null);
  const [menu, setMenu] = useState(false);
  const profile = PROFILES.find((p) => p.key === active);
  const related = profile ? articlesFor(profile, data.articles).slice(0, 2) : [];
  const latest = data.articles.filter((a) => a.image_url).slice(0, 4);

  return (
    <div className="dirB">
      <Helmet>
        <title>Maquette B · Ciel indigo | Association Indigo</title>
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800&display=swap"
        />
      </Helmet>
      <style>{css}</style>

      <section className="sky relative overflow-hidden">
        {/* En-tête posé sur le ciel */}
        <header className="relative z-20">
          <div className="mx-auto max-w-6xl px-4 h-20 flex items-center justify-between gap-4">
            <Link to="/preview/b" className="flex items-center gap-3">
              <span className="grid place-items-center h-12 w-12 rounded-full bg-white shadow-[0_6px_16px_-6px_rgba(31,36,87,.35)]">
                <img src="/logo-indigo.png" alt="" width={44} height={44} className="h-11 w-11" />
              </span>
              <span className="display text-xl font-semibold">Association Indigo</span>
            </Link>
            <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-1 font-bold">
              {['Comprendre', 'Rendez-vous', 'Questions', 'Contact'].map((l) => (
                <a key={l} href="#" className="px-4 py-2.5 rounded-full hover:bg-white/50">{l}</a>
              ))}
              <a href={LINKS.adhesion} className="ml-2 rounded-full bg-[var(--ink)] text-white px-5 py-3 hover:bg-[var(--act)] transition-colors">Adhérer</a>
            </nav>
            <button className="lg:hidden p-3 rounded-full bg-white/60" aria-expanded={menu} aria-label="Menu" onClick={() => setMenu(!menu)}>
              {menu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {menu && (
            <nav aria-label="Navigation mobile" className="lg:hidden mx-4 rounded-2xl bg-white p-2 grid font-bold shadow-lg">
              {['Comprendre', 'Rendez-vous', 'Questions', 'Contact'].map((l) => (
                <a key={l} href="#" className="px-4 py-3 rounded-xl hover:bg-[var(--mist)]">{l}</a>
              ))}
              <a href={LINKS.adhesion} className="px-4 py-3 rounded-xl bg-[var(--ink)] text-white text-center">Adhérer · 5 € par an</a>
            </nav>
          )}
        </header>

        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 lg:pt-14 pb-40 sm:pb-48 grid lg:grid-cols-2 gap-10 items-start">
          <div className="lg:pt-6">
            <h1 className="font-semibold text-[clamp(2.6rem,5.6vw,4.6rem)] leading-[1.02] tracking-[-0.02em]">
              Chaque enfant atypique brille à sa façon
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-[var(--ink-2)] max-w-[33rem]">
              À Préseau, près de Valenciennes, l'Association Indigo accompagne les familles d'enfants TDAH, DYS, HPI,
              hypersensibles ou en phobie scolaire : des dossiers pour comprendre, des soirées pour se retrouver entre parents.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#rendez-vous" className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-4 font-bold hover:bg-[var(--act)] transition-colors">
                Venir à un groupe de parole <ArrowRight size={18} aria-hidden />
              </a>
              <a href={LINKS.facebook} className="inline-flex items-center gap-2 rounded-full bg-white/70 px-6 py-4 font-bold hover:bg-white">
                <Facebook size={18} aria-hidden /> Le groupe des parents
              </a>
            </div>
          </div>

          {/* La constellation */}
          <div>
            <p className="display font-medium text-lg text-center lg:text-left">Choisissez une étoile pour découvrir un profil</p>
            <div className="relative mt-2 aspect-[5/4] sm:aspect-[4/3] lg:aspect-[16/11]">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                <polyline
                  points={ORDER.map((k) => `${12 + STAR[k].x * 0.76},${STAR[k].y}`).join(' ')}
                  fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="2 5" vectorEffect="non-scaling-stroke" strokeLinecap="round"
                />
              </svg>
              {DUST.map(([x, y], i) => (
                <span key={i} aria-hidden className="absolute h-1 w-1 rounded-full bg-white/90" style={{ left: `${x}%`, top: `${y}%` }} />
              ))}
              {PROFILES.map((p) => {
                const s = STAR[p.key];
                const on = active === p.key;
                return (
                  <button
                    key={p.key}
                    aria-pressed={on}
                    aria-controls="profil-panel"
                    onClick={() => setActive(on ? null : p.key)}
                    className="star absolute flex flex-col items-center gap-1 p-1"
                    style={{ left: `${12 + s.x * 0.76}%`, top: `${s.y}%`, transform: `translate(-50%,-50%) scale(${on ? 1.18 : 1})` }}
                  >
                    <Sparkle fill={s.fill} size={on ? 64 : 50} />
                    <span className={`display whitespace-nowrap rounded-full px-3 py-1 text-[13px] sm:text-[15px] font-semibold ${on ? 'bg-[var(--ink)] text-white' : 'bg-white/80'}`}>
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <div id="profil-panel" aria-live="polite" className="relative min-h-[150px]">
              {profile ? (
                <div key={profile.key} className="panel-in rounded-3xl bg-white p-6 shadow-[0_18px_40px_-20px_rgba(31,36,87,.5)]">
                  <h2 className="text-2xl font-semibold">{profile.name}</h2>
                  <p className="mt-2 leading-relaxed">{profile.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Link to={`/articles/${profile.dossier}`} className="inline-flex items-center gap-2 font-bold text-[var(--act)] underline">
                      Lire le dossier <ArrowRight size={18} aria-hidden />
                    </Link>
                    {related.map((a) => (
                      <Link key={a.slug} to={`/articles/${a.slug}`} className="text-[15px] font-semibold text-[var(--ink-2)] underline">
                        {cleanTitle(a.title)}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="rounded-3xl border-2 border-dashed border-white/80 p-6 text-[var(--ink-2)] font-semibold">
                  TDAH, troubles DYS, haut potentiel, phobie scolaire, hypersensibilité : chaque étoile ouvre un dossier écrit par l'association.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Les champs de Préseau à l'horizon */}
        <svg className="absolute bottom-0 left-0 w-full h-[140px] sm:h-[180px]" viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden>
          <path d="M0 92C180 52 360 60 520 88s340 44 520 8 280-46 400-20v112H0Z" fill="#CFE8C9" />
          <path d="M0 132c220-38 430-40 640-12s420 30 600 2 160-18 200-12v70H0Z" fill="#B6DDB6" />
          <path d="M0 180V156c260-20 520-22 760-6s460 14 680-4v34Z" fill="#fff" />
        </svg>
      </section>

      {/* Les soirées */}
      <section id="rendez-vous" className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight">
              {data.eventsArePast ? 'Nos dernières soirées' : 'Les prochaines soirées'}
            </h2>
            <p className="mt-3 text-lg text-[var(--ink-2)]">
              Groupes de parole pour les parents pendant que les enfants participent à leurs ateliers, salle la Verrière à Préseau.
              {data.eventsArePast && ' Les nouvelles dates sont annoncées sur le groupe Facebook des parents.'}
            </p>
          </div>
          <ul className="mt-12 grid md:grid-cols-3 gap-8">
            {data.loading && [0, 1, 2].map((i) => <li key={i} className="aspect-[3/4] rounded-3xl bg-[var(--mist)] animate-pulse" />)}
            {data.events.map((e) => {
              const d = eventDay(e.event_date);
              return (
                <li key={e.id}>
                  <div className="relative overflow-hidden rounded-3xl bg-[var(--mist)] aspect-[4/5]">
                    {e.image_url && <img src={e.image_url} alt={`Affiche : ${e.title}`} loading="lazy" className="h-full w-full object-cover" />}
                    <div className="absolute left-4 top-4 rounded-2xl bg-white px-3 py-2 text-center shadow-md">
                      <span className="display block text-3xl font-semibold leading-none tabular-nums">{d.day}</span>
                      <span className="block text-sm font-bold">{d.month}</span>
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold leading-snug">{e.title}</h3>
                  <p className="mt-1 text-[15px] text-[var(--ink-2)] flex flex-wrap gap-x-4">
                    <span className="inline-flex items-center gap-1.5 capitalize"><Clock size={15} aria-hidden /> {d.weekday} {d.time}</span>
                    {e.location && <span className="inline-flex items-center gap-1.5"><MapPin size={15} aria-hidden /> {e.location}</span>}
                  </p>
                </li>
              );
            })}
          </ul>
          {data.eventsArePast && (
            <a href={LINKS.facebook} className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-4 font-bold hover:bg-[var(--act)] transition-colors">
              <Facebook size={18} aria-hidden /> Être prévenu de la prochaine soirée
            </a>
          )}
        </div>
      </section>

      {/* Bibliothèque */}
      <section className="py-20 bg-[var(--mist)]">
        <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-[1fr_1.4fr] gap-12">
          <div>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight">Comprendre, à son rythme</h2>
            <p className="mt-4 text-lg text-[var(--ink-2)]">
              {data.articles.length ? `${data.articles.length} articles` : 'Des articles'} écrits par l'association : les troubles expliqués simplement,
              le dossier MDPH pas à pas, des retours d'ateliers.
            </p>
            <Link to="/articles" className="mt-6 inline-flex items-center gap-2 font-bold text-[var(--act)] underline">
              Ouvrir la bibliothèque <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <ul className="grid sm:grid-cols-2 gap-6">
            {latest.map((a) => (
              <li key={a.slug}>
                <Link to={`/articles/${a.slug}`} className="group block">
                  <img src={a.image_url} alt="" loading="lazy" className="w-full aspect-[3/2] object-cover rounded-3xl" />
                  <p className="mt-3 text-sm font-bold text-[var(--ink-2)]">{categoryLabel(a.category)}</p>
                  <h3 className="text-lg font-semibold leading-snug group-hover:text-[var(--act)]">{cleanTitle(a.title)}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Familles */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-2 gap-14">
          {TESTIMONIALS.map((t, i) => (
            <figure key={t.author} className="relative">
              <div className="mb-4"><Sparkle fill={i ? '#E9806A' : '#F2A65A'} size={34} /></div>
              <blockquote className="display text-2xl leading-snug font-medium">«&nbsp;{t.text}&nbsp;»</blockquote>
              <figcaption className="mt-4 font-bold">{t.author}, <span className="font-normal text-[var(--ink-2)]">{t.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Soutenir : l'aube */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg,#FFFFFF 0%,#FBE3D8 100%)' }}>
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight text-center">Faire grandir l'association</h2>
          <div className="mt-12 grid md:grid-cols-2 rounded-[2rem] bg-white shadow-[0_24px_50px_-28px_rgba(31,36,87,.45)] overflow-hidden">
            <div className="p-8 sm:p-10">
              <h3 className="text-2xl font-semibold">Adhérer</h3>
              <p className="display mt-2 text-5xl font-semibold tabular-nums">5 € <span className="text-xl font-medium">par an</span></p>
              <p className="mt-4 text-[var(--ink-2)]">Accès prioritaire aux ateliers, participation à la vie de l'association et le soutien des autres parents.</p>
              <a href={LINKS.adhesion} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-3.5 font-bold hover:bg-[var(--act)] transition-colors">
                J'adhère sur HelloAsso
              </a>
            </div>
            <div className="p-8 sm:p-10 border-t md:border-t-0 md:border-l border-[#E6E4F6]">
              <h3 className="text-2xl font-semibold">Donner</h3>
              <p className="display mt-2 text-5xl font-semibold">Libre</p>
              <p className="mt-4 text-[var(--ink-2)]">Votre don finance du matériel pédagogique et des intervenants spécialisés pour les ateliers.</p>
              <a href={LINKS.don} className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] px-6 py-3 font-bold hover:bg-[var(--mist)]">
                <Heart size={18} aria-hidden /> Je fais un don
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* La nuit tombe : pied de page */}
      <footer className="relative bg-[var(--night)] text-[#EEF0FF] overflow-hidden">
        {DUST.map(([x, y], i) => (
          <span key={i} aria-hidden className="absolute h-[3px] w-[3px] rounded-full bg-white/60" style={{ left: `${(x * 1.3) % 100}%`, top: `${y}%` }} />
        ))}
        <div className="relative mx-auto max-w-6xl px-4 py-16 grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center h-12 w-12 rounded-full bg-white">
                <img src="/logo-indigo.png" alt="" width={44} height={44} className="h-11 w-11" />
              </span>
              <p className="display text-2xl font-semibold">Association Indigo</p>
            </div>
            <p className="mt-4 text-[#C9CCF2]">Accompagner les particularités, valoriser les singularités. Association loi 1901.</p>
            <p className="mt-4 flex items-center gap-2 font-bold"><MapPin size={18} aria-hidden /> Préseau (59990), Hauts-de-France</p>
            <a href={`mailto:${LINKS.email}`} className="mt-2 flex items-center gap-2 font-bold underline"><Mail size={18} aria-hidden /> {LINKS.email}</a>
          </div>
          <div>
            <p className="display text-lg font-medium">Ils nous soutiennent</p>
            <ul className="mt-5 flex flex-wrap gap-4">
              {PARTNERS.map((p) => (
                <li key={p.name}>
                  <a href={p.url} title={p.name} className="flex items-center justify-center h-[72px] w-[72px] overflow-hidden rounded-full bg-white p-3 hover:scale-105 transition-transform">
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-contain" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative border-t border-white/15">
          <div className="mx-auto max-w-6xl px-4 py-5 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-[#C9CCF2]">
            <span>© {new Date().getFullYear()} Association Indigo</span>
            <Link to="/mentions-legales" className="underline">Mentions légales</Link>
            <Link to="/politique-confidentialite" className="underline">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
