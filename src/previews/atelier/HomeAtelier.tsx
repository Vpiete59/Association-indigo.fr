// Accueil « L'atelier », version approfondie.
import { useEffect, type CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Facebook, MapPin, Clock, Heart, Plus } from 'lucide-react';
import { PROFILES, TESTIMONIALS, LINKS, usePreviewData, articlesFor, cleanTitle, eventDay, type LiteArticle } from '../shared';
import {
  css, AtelierHead, AtelierHeader, AtelierFooter, Tape, Sparkle, CutLine, Stamp,
  PAPER, PROFILE_PAPER, SPARK, articleHref,
} from './kit';

type Vars = CSSProperties & { '--r'?: string; '--d'?: string };
const v = (r: number, d = 0): Vars => ({ '--r': `${r}deg`, '--d': `${d}ms` });

// Courbe de la ficelle : y(t) = 10 + 96·t·(1−t), en px (SVG 0..1000 × 0..60)
const sag = (t: number) => 10 + 96 * t * (1 - t);
const GARLAND_T = [0.22, 0.38, 0.54, 0.7, 0.86];
const SWING_R = [-3, 2, -1.5, 3, -2.5];

// Questions reprises telles quelles de la page FAQ du site
const FAQ = [
  { q: 'Faut-il un diagnostic pour participer ?', a: 'Non. Indigo accueille les enfants avec ou sans diagnostic. Ce qui compte, ce sont les besoins, pas les étiquettes.' },
  { q: 'À partir de quel âge accompagnez-vous les enfants ?', a: "Nous intervenons généralement à partir de 3 ans et sans limite d'âge supérieure, avec des formats adaptés à chaque tranche d'âge." },
  { q: 'Les activités sont-elles payantes ?', a: "Certaines actions sont gratuites grâce au soutien de partenaires. D'autres sont proposées à tarif solidaire sur adhésion. Les informations précises sont indiquées sur chaque activité." },
  { q: 'Comment prendre contact ou s’inscrire à un atelier ?', a: 'Vous pouvez nous écrire via notre page contact, nous envoyer un email ou venir nous rencontrer lors de nos réunions. Nous vous guidons ensuite vers l’accompagnement et les professionnels les plus adaptés.' },
];

function Ruler() {
  // Graduations du tapis : un trait par cm (40 px), un chiffre tous les 5 cm
  return (
    <div aria-hidden className="relative h-6 overflow-hidden border-b border-[var(--grid-strong)]"
      style={{ backgroundImage: 'repeating-linear-gradient(90deg, var(--grid-strong) 0 1.5px, transparent 1.5px 40px)', backgroundSize: '40px 9px', backgroundRepeat: 'repeat-x', backgroundPosition: '-1px 0' }}>
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="absolute top-[7px] text-[11px] font-bold tabular-nums text-[#5E9A73]" style={{ left: `${(i + 1) * 200 + 4}px` }}>
          {(i + 1) * 5}
        </span>
      ))}
    </div>
  );
}

function ProfileTag({ p, i, hanging, compact }: { p: (typeof PROFILES)[number]; i: number; hanging?: boolean; compact?: boolean }) {
  return (
    <Link
      to={articleHref(p.dossier)}
      className="swing group block"
      style={{ '--r': `${SWING_R[i]}deg`, filter: 'drop-shadow(0 8px 10px rgba(42,40,78,.22))' } as Vars}
    >
      {hanging && <span aria-hidden className="mx-auto block h-5 w-[2px] bg-[var(--ink)]/50" />}
      <span className={`tag relative block ${compact ? 'w-full px-4 pt-7 pb-3' : 'w-[176px] px-5 pt-7 pb-4'}`} style={{ backgroundColor: PROFILE_PAPER[p.key] }}>
        <span aria-hidden className="absolute left-1/2 top-2.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-white ring-2 ring-[var(--ink)]/25" />
        <span className={`display block font-extrabold leading-tight ${compact ? 'text-[1.05rem]' : 'text-[1.2rem]'}`}>{p.name}</span>
        {!compact && <span className="mt-1 block text-[14px] font-semibold leading-snug text-[var(--ink-2)]">{p.short}</span>}
        <span className="mt-2 inline-flex items-center gap-1 text-[14px] font-extrabold">
          Lire le dossier <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </span>
    </Link>
  );
}

function Garland() {
  return (
    <>
      {/* Écran large : les étiquettes pendent à une ficelle tendue sur le tapis */}
      <div className="relative hidden lg:block h-[262px]">
        <svg className="absolute inset-x-0 top-0 h-[60px] w-full" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden>
          <path d="M0 10 Q500 106 1000 10" fill="none" stroke="var(--ink)" strokeOpacity=".55" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <span aria-hidden className="absolute -left-1.5 top-[4px] h-3.5 w-3.5 rounded-full bg-[var(--act)] ring-2 ring-white" />
        <span aria-hidden className="absolute -right-1.5 top-[4px] h-3.5 w-3.5 rounded-full bg-[var(--act)] ring-2 ring-white" />
        <div className="settle paper absolute left-0 top-[46px] w-[172px] bg-white px-4 py-3" style={v(-4, 60)}>
          <Tape color={PAPER.menthe} className="-top-3 left-6 !w-16 rotate-[-6deg]" />
          <p id="guirlande" className="display text-[1.05rem] font-bold leading-tight">Je cherche des infos sur…</p>
        </div>
        <ul aria-labelledby="guirlande">
          {PROFILES.map((p, i) => (
            <li key={p.key} className="absolute -translate-x-1/2" style={{ left: `${GARLAND_T[i] * 100}%`, top: `${sag(GARLAND_T[i])}px` }}>
              <ProfileTag p={p} i={i} hanging />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Pochette({ p, i, all }: { p: (typeof PROFILES)[number]; i: number; all: LiteArticle[] }) {
  const dossier = all.find((a) => a.slug === p.dossier);
  const inside = [dossier, ...articlesFor(p, all)].filter(Boolean) as LiteArticle[];
  // Les fiches qui dépassent : d'abord les articles liés (le dossier porte déjà le nom de la pochette)
  const others = inside.filter((a) => a.slug !== p.dossier);
  const slips = (others.length ? others : inside).slice(0, 2);
  return (
    <li className="relative pt-[70px]">
      {/* les fiches qui dépassent de la pochette */}
      {slips.map((a, k) => (
        <Link
          key={a.slug}
          to={articleHref(a.slug)}
          title={cleanTitle(a.title)}
          className="paper paper-lift absolute left-3 right-5 bg-white px-3 pt-2 pb-8 text-[13px] font-bold leading-snug hover:text-[var(--act)]"
          style={{ top: k === 0 ? 0 : 26, transform: `rotate(${k === 0 ? -3 + i : 2 - i / 2}deg)`, zIndex: k }}
        >
          <span className="line-clamp-1">{cleanTitle(a.title)}</span>
        </Link>
      ))}
      <Link
        to={articleHref(p.dossier)}
        className="paper group relative z-10 flex h-full min-h-[190px] flex-col rounded-[3px_16px_6px_6px] p-5 pt-6"
        style={{ backgroundColor: PROFILE_PAPER[p.key] }}
      >
        <span aria-hidden className="absolute -top-3.5 left-0 h-4 w-20 rounded-t-lg" style={{ backgroundColor: PROFILE_PAPER[p.key] }} />
        <h3 className="display text-[1.35rem] font-extrabold leading-tight">{p.name}</h3>
        <p className="mt-1.5 flex-1 text-[15px] font-semibold leading-snug text-[var(--ink-2)]">{p.short}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 font-extrabold">
          {inside.length ? `${inside.length} article${inside.length > 1 ? 's' : ''}` : 'Le dossier'}
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
        </p>
      </Link>
    </li>
  );
}

export default function HomeAtelier() {
  const data = usePreviewData();
  const { hash } = useLocation();
  const next = data.events[0];
  const latest = data.articles.filter((a) => a.image_url).slice(0, 3);

  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo(0, 0);
  }, [hash]);

  return (
    <div className="atelier">
      <AtelierHead title="Maquette C · L'atelier | Association Indigo" />
      <style>{css}</style>
      <AtelierHeader />

      {/* ——— La table de l'atelier ——— */}
      <section className="mat relative overflow-hidden">
        <Ruler />
        <div aria-hidden className="mat-diagonal pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4">
          <Garland />

          <div className="grid lg:grid-cols-[1.08fr_1fr] gap-12 lg:gap-10 items-center pt-10 lg:pt-2 pb-24">
            <div>
              <h1 className="font-extrabold leading-[0.98] tracking-[-0.01em] text-[clamp(2.3rem,5vw,4.25rem)]">
                <span className="settle paper block w-fit whitespace-nowrap bg-white px-4 pt-2 pb-1.5" style={{ ...v(-1.5, 120), clipPath: 'polygon(0 3%,100% 0,99.5% 97%,0.5% 100%)' }}>
                  Ici, on grandit
                </span>
                <span className="settle paper mt-2 ml-6 sm:ml-14 block w-fit whitespace-nowrap px-4 pt-2 pb-1.5" style={{ ...v(1.2, 200), backgroundColor: PAPER.beurre, clipPath: 'polygon(1% 0,100% 4%,99% 100%,0 96%)' }}>
                  avec sa
                </span>
                <span className="settle paper mt-2 block w-fit whitespace-nowrap px-4 pt-2 pb-1.5" style={{ ...v(-0.8, 280), backgroundColor: PAPER.saumon, clipPath: 'polygon(0 0,99% 3%,100% 100%,1% 97%)' }}>
                  différence
                </span>
              </h1>
              <p className="mt-8 text-lg sm:text-xl leading-relaxed text-[var(--ink-2)] max-w-[33rem]">
                L'Association Indigo accueille à Préseau, près de Valenciennes, les familles d'enfants atypiques :
                TDAH, troubles DYS, haut potentiel, hypersensibilité, phobie scolaire. Des groupes de parole pour les parents,
                des ateliers pour les enfants.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#ateliers" className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-4 font-extrabold hover:bg-[var(--act)] transition-colors">
                  Venir à un groupe de parole <ArrowRight size={18} aria-hidden />
                </a>
                <a href={LINKS.facebook} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-extrabold hover:bg-[#F3FAF5] border-2 border-[var(--ink)]">
                  <Facebook size={18} aria-hidden /> Le groupe des parents
                </a>
              </div>
              {/* Mobile : les étiquettes de la guirlande, posées sur le tapis */}
              <div className="lg:hidden mt-10">
                <p id="guirlande-mobile" className="display text-xl font-bold">Je cherche des infos sur…</p>
                <ul aria-labelledby="guirlande-mobile" className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
                  {PROFILES.map((p, i) => (
                    <li key={p.key}><ProfileTag p={p} i={i} compact /></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Collage : photo scotchée, étincelles du logo, ticket du dernier atelier */}
            <div className="relative mx-auto w-full max-w-[540px] h-[400px] sm:h-[460px]">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 180" preserveAspectRatio="none" aria-hidden>
                <path d="M58 10c40-16 96-4 122 26s26 78 0 106-74 40-110 30S6 132 4 94 18 26 58 10Z" fill={PAPER.lilas} />
              </svg>
              <Sparkle color={SPARK.rouge} size={46} className="settle absolute left-[2%] top-[2%] z-10" style={v(10, 420)} />
              <Sparkle color={SPARK.indigo} size={34} className="settle absolute left-[13%] top-[-3%] z-10" style={v(-8, 480)} />
              <Sparkle color={SPARK.orange} size={40} className="settle absolute left-[-3%] top-[17%] z-10" style={v(4, 540)} />
              <figure className="settle paper absolute left-[9%] right-[3%] top-[8%] bg-white p-3 pb-11" style={v(-2.5, 320)}>
                <Tape color={PAPER.saumon} className="-top-3 left-10 rotate-[-8deg]" />
                <Tape color={PAPER.ciel} className="-top-3 right-8 rotate-[7deg]" />
                <img
                  src="/gemini_generated_image_enqzn8enqzn8enqz.webp"
                  alt="Un petit garçon avec une cape souffle sur un pissenlit dans un jardin"
                  width={1000} height={545}
                  className="w-full aspect-[4/3] object-cover object-[30%_50%]"
                />
                <figcaption className="display absolute bottom-2.5 right-4 hidden sm:block text-lg font-bold">Souffler, s'envoler, grandir</figcaption>
              </figure>
              {next && (
                <a href="#ateliers" className="settle ticket paper absolute bottom-0 left-[-2%] sm:left-[-8%] z-10 w-[255px] bg-[#FFE69E] px-7 py-4" style={v(4, 600)}>
                  <span className="block text-sm font-extrabold">{data.eventsArePast ? 'Dernier atelier' : 'Prochain atelier'}</span>
                  <span className="display mt-0.5 block text-lg font-bold leading-tight">{next.title}</span>
                  <span className="mt-1 block text-sm font-bold text-[var(--ink-2)]">
                    {eventDay(next.event_date).weekday} {eventDay(next.event_date).day} {eventDay(next.event_date).monthLong} · {eventDay(next.event_date).time}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Première fois ? ——— */}
      <section className="relative bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-extrabold leading-tight max-w-xl">
              Première fois ? Voilà comment ça se passe
            </h2>
            <Stamp className="h-40 w-40 rotate-[-12deg] text-[15px] shrink-0">Avec ou sans diagnostic, bienvenue</Stamp>
          </div>
          <CutLine className="mt-10" />
          <ol className="mt-10 grid md:grid-cols-3 gap-8">
            {[
              { n: '1', t: 'Vous lisez', d: "Un dossier sur le profil de votre enfant, écrit simplement par l'association. Pour mettre des mots sur ce que vous vivez.", l: 'Choisir un dossier', h: '#bibliotheque', c: PAPER.lilas, r: -1.5 },
              { n: '2', t: 'Vous venez en parler', d: 'Un groupe de parole entre parents, salle la Verrière à Préseau, pendant que les enfants participent à leur atelier.', l: 'Voir les ateliers', h: '#ateliers', c: PAPER.beurre, r: 1 },
              { n: '3', t: 'On avance ensemble', d: "L'adhésion à 5 € par an donne un accès prioritaire aux ateliers. Les questions du quotidien se posent sur le groupe Facebook privé.", l: 'Adhérer', h: LINKS.adhesion, c: PAPER.menthe, r: -0.8 },
            ].map((s) => (
              <li key={s.n} className="paper relative p-7 pt-6" style={{ backgroundColor: s.c, transform: `rotate(${s.r}deg)` }}>
                <span aria-hidden className="display block text-[3.4rem] font-extrabold leading-none text-[var(--ink)]/85">{s.n}</span>
                <h3 className="display mt-3 text-2xl font-extrabold">{s.t}</h3>
                <p className="mt-2 leading-relaxed text-[var(--ink-2)] font-semibold">{s.d}</p>
                <a href={s.h} className="mt-5 inline-flex items-center gap-1.5 font-extrabold underline">
                  {s.l} <ArrowRight size={17} aria-hidden />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Les ateliers ——— */}
      <section id="ateliers" className="mat scroll-mt-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-extrabold leading-tight">
                {data.eventsArePast ? 'Retour sur nos derniers ateliers' : 'Les prochains ateliers'}
              </h2>
              <p className="mt-3 text-lg font-semibold text-[var(--ink-2)]">
                Salle la Verrière, à Préseau. Pendant que les parents échangent, les enfants créent, bougent et se font des copains.
              </p>
            </div>
            {data.eventsArePast && (
              <a href={LINKS.facebook} className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-3.5 font-extrabold hover:bg-[var(--act)] transition-colors">
                <Facebook size={18} aria-hidden /> Être prévenu du prochain
              </a>
            )}
          </div>
          <ul className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
            {data.loading && [0, 1, 2].map((i) => <li key={i} className="aspect-[3/4] bg-white/50 animate-pulse" />)}
            {data.events.map((e, i) => {
              const d = eventDay(e.event_date);
              const tapes = [PAPER.saumon, PAPER.ciel, PAPER.beurre];
              return (
                <li key={e.id} className="paper paper-lift relative bg-white p-3 pb-5" style={{ transform: `rotate(${[-2.5, 1.5, -1][i % 3]}deg)` }}>
                  <Tape color={tapes[i % 3]} className="-top-3 left-1/2 -translate-x-1/2" />
                  {e.image_url && <img src={e.image_url} alt={`Affiche : ${e.title}`} loading="lazy" className="w-full aspect-[3/4] object-cover" />}
                  <h3 className="display mt-4 text-xl font-bold leading-snug">{e.title}</h3>
                  <p className="mt-1.5 text-[15px] font-bold text-[var(--ink-2)] flex flex-wrap gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1.5"><Clock size={15} aria-hidden /> {d.weekday} {d.day} {d.month} · {d.time}</span>
                    {e.location && <span className="inline-flex items-center gap-1.5"><MapPin size={15} aria-hidden /> {e.location}</span>}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— La bibliothèque ——— */}
      <section id="bibliotheque" className="scroll-mt-4 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-extrabold leading-tight">La bibliothèque des parents</h2>
              <p className="mt-3 text-lg font-semibold text-[var(--ink-2)]">
                {data.articles.length ? `${data.articles.length} articles` : 'Des articles'} écrits par l'association, rangés par profil.
                Tirez une fiche, ou ouvrez la pochette.
              </p>
            </div>
            <Link to="/articles" className="inline-flex items-center gap-2 font-extrabold underline">
              Toute la bibliothèque <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10">
            {PROFILES.map((p, i) => <Pochette key={p.key} p={p} i={i} all={data.articles} />)}
          </ul>
          {latest.length > 0 && (
            <div className="mt-16">
              <CutLine />
              <p className="display mt-8 text-2xl font-bold">Derniers ajouts</p>
              <ul className="mt-5 grid md:grid-cols-3 gap-6">
                {latest.map((a) => (
                  <li key={a.slug}>
                    <Link to={articleHref(a.slug)} className="paper paper-lift group flex gap-4 items-center bg-[#F6FBF7] p-3 rounded-md">
                      <img src={a.image_url} alt="" loading="lazy" className="h-16 w-16 object-cover rounded shrink-0" />
                      <span className="font-extrabold leading-snug group-hover:text-[var(--act)]">{cleanTitle(a.title)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ——— Les questions ——— */}
      <section id="questions" className="mat scroll-mt-4 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <div className="paper relative bg-white px-6 sm:px-12 py-12">
            <Tape color={PAPER.mauve} className="-top-3 left-12 rotate-[-5deg]" />
            <Tape color={PAPER.beurre} className="-top-3 right-12 rotate-[4deg]" />
            <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold leading-tight">Les questions qu'on nous pose</h2>
            <div className="mt-8 divide-y-2 divide-dashed divide-[var(--grid-strong)] border-y-2 border-dashed border-[var(--grid-strong)]">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-1">
                  <summary className="flex items-center justify-between gap-4 py-4 text-lg font-extrabold">
                    {f.q}
                    <Plus size={22} className="chev shrink-0 transition-transform duration-300" aria-hidden />
                  </summary>
                  <p className="pb-5 pr-8 leading-relaxed font-semibold text-[var(--ink-2)]">{f.a}</p>
                </details>
              ))}
            </div>
            <Link to="/faq" className="mt-6 inline-flex items-center gap-2 font-extrabold underline">
              Toutes les questions <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ——— Les mots des familles ——— */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-extrabold leading-tight text-center">Les mots des familles</h2>
          <div className="mt-14 grid md:grid-cols-2 gap-12">
            {TESTIMONIALS.map((t, i) => (
              <figure key={t.author} className="paper relative p-8 pt-10" style={{ backgroundColor: i ? PAPER.saumon : PAPER.beurre, transform: `rotate(${i ? 2 : -2}deg)` }}>
                <Tape color={i ? PAPER.lilas : PAPER.ciel} className="-top-3 left-1/2 -translate-x-1/2" />
                <blockquote className="display text-xl sm:text-2xl leading-snug font-bold">«&nbsp;{t.text}&nbsp;»</blockquote>
                <figcaption className="mt-5 font-extrabold">{t.author}, <span className="font-semibold">{t.role}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Prendre part ——— */}
      <section className="mat py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-extrabold leading-tight text-center">Prendre part à l'aventure</h2>
          <p className="mt-3 text-center text-lg font-semibold text-[var(--ink-2)]">L'association vit grâce aux familles qui la rejoignent.</p>
          <div className="mt-12 grid md:grid-cols-2 gap-10">
            <div className="ticket paper bg-white px-10 py-9 rotate-[-1deg]">
              <h3 className="text-2xl font-extrabold">Adhérer</h3>
              <p className="display mt-1 text-5xl font-extrabold tabular-nums">5 € <span className="text-xl">par an</span></p>
              <p className="mt-4 font-semibold text-[var(--ink-2)]">Accès prioritaire aux ateliers, une voix dans la vie de l'association, et des parents qui comprennent.</p>
              <a href={LINKS.adhesion} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-3.5 font-extrabold hover:bg-[var(--act)] transition-colors">
                J'adhère sur HelloAsso <ArrowUpRight size={18} aria-hidden />
              </a>
            </div>
            <div className="ticket paper px-10 py-9 rotate-[1deg]" style={{ backgroundColor: PAPER.beurre }}>
              <h3 className="text-2xl font-extrabold">Donner</h3>
              <p className="display mt-1 text-5xl font-extrabold">Libre</p>
              <p className="mt-4 font-semibold text-[var(--ink-2)]">Du matériel pédagogique, des intervenants spécialisés, plus de familles accueillies.</p>
              <a href={LINKS.don} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-3.5 font-extrabold hover:bg-[var(--act)] transition-colors">
                <Heart size={18} aria-hidden /> Je fais un don
              </a>
            </div>
          </div>
        </div>
      </section>

      <AtelierFooter />
    </div>
  );
}

