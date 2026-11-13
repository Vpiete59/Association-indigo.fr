// Direction C — « L'atelier » : papier découpé, scotch washi et vraies affiches, posés sur le tapis de découpe.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ArrowUpRight, Facebook, MapPin, Clock, Mail, Menu, X, Heart } from 'lucide-react';
import {
  PROFILES, TESTIMONIALS, PARTNERS, LINKS, usePreviewData, articlesFor, cleanTitle, eventDay, type ProfileKey,
} from './shared';

const PAPER: Record<ProfileKey, string> = {
  tdah: '#CBD1FA',
  dys: '#FFC7B2',
  hpi: '#FFE69E',
  phobie: '#BFE3F7',
  hyper: '#E3CCF5',
};
const TILT = [-3, 2, -1.5, 3, -2];

const css = `
.dirC { --ink:#2A284E; --ink-2:#4D4A75; --act:#3F49A6; --mat:#D7EEDD; --grid:#BFDFC8;
  font-family:'Nunito',system-ui,sans-serif; color:var(--ink); background:#fff; }
.dirC h1,.dirC h2,.dirC h3,.dirC .display { font-family:'Grandstander',system-ui,sans-serif; text-wrap:balance; }
.dirC ::selection { background:#FFE69E; color:var(--ink); }
.dirC :focus-visible { outline:3px solid var(--act); outline-offset:3px; border-radius:8px; }
.dirC a { text-underline-offset:4px; text-decoration-thickness:2px; }
.dirC .mat { background-color:var(--mat);
  background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 40px 40px; background-position: -1px -1px; }
.dirC .paper { box-shadow: 0 1px 1px rgba(42,40,78,.08), 0 8px 18px -8px rgba(42,40,78,.28); }
.dirC .tape { position:absolute; height:28px; width:96px; opacity:.82;
  -webkit-mask: conic-gradient(from -45deg at left, #0000 25%, #000 0) left/50.5% 8px repeat-y, conic-gradient(from 135deg at right, #0000 25%, #000 0) right/50.5% 8px repeat-y;
          mask: conic-gradient(from -45deg at left, #0000 25%, #000 0) left/50.5% 8px repeat-y, conic-gradient(from 135deg at right, #0000 25%, #000 0) right/50.5% 8px repeat-y; }
.dirC .ticket { -webkit-mask: radial-gradient(14px at 0 50%, #0000 98%, #000) left/51% 100% no-repeat, radial-gradient(14px at 100% 50%, #0000 98%, #000) right/51% 100% no-repeat;
          mask: radial-gradient(14px at 0 50%, #0000 98%, #000) left/51% 100% no-repeat, radial-gradient(14px at 100% 50%, #0000 98%, #000) right/51% 100% no-repeat; }
.dirC .pin { transition: transform .45s cubic-bezier(.16,1,.3,1); }
.dirC .pin:hover, .dirC .pin:focus-within { transform: rotate(0deg) translateY(-4px) !important; }
@media (prefers-reduced-motion: reduce){ .dirC .pin, .dirC [data-drift] { transition:none; transform:none !important } }
`;

// Formes de papier découpé (tracées à la main, pas des cercles parfaits)
const BLOB = 'M60 8c38-14 92-6 118 22s30 74 6 104-70 44-108 34S4 128 2 92 22 22 60 8Z';
const CLOUD = 'M24 70c-18 0-24-24-8-32-2-20 22-30 34-16 8-20 40-18 44 4 18-4 30 16 18 30 6 14-6 24-20 20-10 12-30 12-38 2-12 8-30 2-30-8Z';

function useDrift() {
  // Les formes de papier glissent légèrement au défilement (désactivé si mouvement réduit)
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ref.current?.querySelectorAll<HTMLElement>('[data-drift]').forEach((el) => {
          const k = Number(el.dataset.drift);
          el.style.transform = `translate3d(0, ${window.scrollY * k}px, 0)`;
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return ref;
}

export default function DirectionC() {
  const data = usePreviewData();
  const [menu, setMenu] = useState(false);
  const root = useDrift();
  const next = data.events[0];
  const latest = data.articles.filter((a) => a.image_url).slice(0, 3);

  return (
    <div className="dirC" ref={root}>
      <Helmet>
        <title>Maquette C · L'atelier | Association Indigo</title>
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Grandstander:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap"
        />
      </Helmet>
      <style>{css}</style>

      {/* En-tête */}
      <header className="bg-white border-b-2 border-[var(--ink)]">
        <div className="mx-auto max-w-6xl px-4 h-[76px] flex items-center justify-between gap-4">
          <Link to="/preview/c" className="flex items-center gap-3">
            <img src="/logo-indigo.png" alt="" width={48} height={48} className="h-12 w-12" />
            <span className="display text-xl font-extrabold">Association Indigo</span>
          </Link>
          <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-1 font-extrabold">
            {['Comprendre', 'Ateliers', 'Questions', 'Contact'].map((l) => (
              <a key={l} href="#" className="px-4 py-2.5 rounded-full hover:bg-[var(--mat)]">{l}</a>
            ))}
            <a href={LINKS.adhesion} className="ml-2 rounded-full bg-[var(--ink)] text-white px-5 py-3 hover:bg-[var(--act)] transition-colors">Adhérer · 5 €</a>
          </nav>
          <button className="lg:hidden p-3 rounded-full hover:bg-[var(--mat)]" aria-expanded={menu} aria-label="Menu" onClick={() => setMenu(!menu)}>
            {menu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {menu && (
          <nav aria-label="Navigation mobile" className="lg:hidden border-t border-[var(--grid)] px-4 py-3 grid gap-1 font-extrabold">
            {['Comprendre', 'Ateliers', 'Questions', 'Contact'].map((l) => (
              <a key={l} href="#" className="px-3 py-3 rounded-xl hover:bg-[var(--mat)]">{l}</a>
            ))}
            <a href={LINKS.adhesion} className="px-3 py-3 rounded-xl bg-[var(--ink)] text-white text-center">Adhérer · 5 € par an</a>
          </nav>
        )}
      </header>

      {/* Hero : la table de l'atelier */}
      <section className="mat relative overflow-hidden">
        <svg data-drift="-0.06" className="absolute -left-20 bottom-6 w-56 opacity-90 hidden md:block" viewBox="0 0 120 100" aria-hidden><path d={CLOUD} fill="#FFE69E" /></svg>
        <svg data-drift="0.08" className="absolute right-[-60px] bottom-[-40px] w-72" viewBox="0 0 200 180" aria-hidden><path d={BLOB} fill="#FFC7B2" /></svg>

        <div className="relative mx-auto max-w-6xl px-4 py-14 lg:py-20 grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
          <div>
            <h1 className="font-extrabold text-[clamp(2.5rem,5.4vw,4.4rem)] leading-[1.02] tracking-[-0.01em]">
              Ici, on grandit avec sa différence
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-[var(--ink-2)] max-w-[34rem]">
              L'Association Indigo accueille à Préseau, près de Valenciennes, les familles d'enfants atypiques :
              groupes de parole pour les parents, ateliers pour les enfants, et des dossiers pour comprendre.
            </p>

            <p className="display mt-9 text-lg font-bold">Je cherche des infos sur…</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {PROFILES.map((p, i) => (
                <li key={p.key}>
                  <Link
                    to={`/articles/${p.dossier}`}
                    className="paper pin relative inline-flex items-center gap-2 rounded-lg pl-7 pr-4 py-2.5 font-extrabold"
                    style={{ backgroundColor: PAPER[p.key], transform: `rotate(${TILT[i] / 2}deg)` }}
                  >
                    <span aria-hidden className="absolute left-2.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-white ring-2 ring-[var(--ink)]/30" />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* La photo collée, avec le prochain atelier épinglé */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <svg className="absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)]" viewBox="0 0 200 180" preserveAspectRatio="none" aria-hidden>
              <path d={BLOB} fill="#CBD1FA" />
            </svg>
            <figure className="paper relative bg-white p-3 pb-12 rotate-[-2.5deg]">
              <span className="tape -top-3 left-8 rotate-[-8deg]" style={{ background: '#FFC7B2' }} aria-hidden />
              <span className="tape -top-3 right-6 rotate-[6deg]" style={{ background: '#BFE3F7' }} aria-hidden />
              <img
                src="/gemini_generated_image_enqzn8enqzn8enqz.webp"
                alt="Un petit garçon avec une cape souffle sur un pissenlit dans un jardin"
                width={1000} height={545}
                className="w-full aspect-[4/3] object-cover object-[30%_50%]"
              />
              <figcaption className="display absolute bottom-3 right-4 text-lg font-bold">Souffler, s'envoler, grandir</figcaption>
            </figure>
            {next && (
              <div className="ticket paper absolute -bottom-10 -left-4 sm:-left-10 w-[250px] bg-[#FFE69E] px-7 py-4 rotate-[3deg]">
                <p className="text-sm font-extrabold">{data.eventsArePast ? 'Dernier atelier' : 'Prochain atelier'}</p>
                <p className="display text-lg font-bold leading-tight mt-0.5">{next.title}</p>
                <p className="mt-1 text-sm font-bold text-[var(--ink-2)] capitalize">
                  {eventDay(next.event_date).weekday} {eventDay(next.event_date).day} {eventDay(next.event_date).monthLong}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="h-10" />
      </section>

      {/* Les ateliers : les affiches punaisées */}
      <section id="ateliers" className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight">
                {data.eventsArePast ? 'Retour sur nos derniers ateliers' : 'Les prochains ateliers'}
              </h2>
              <p className="mt-3 text-lg text-[var(--ink-2)]">
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
            {data.loading && [0, 1, 2].map((i) => <li key={i} className="aspect-[3/4] bg-[var(--mat)] animate-pulse" />)}
            {data.events.map((e, i) => {
              const d = eventDay(e.event_date);
              return (
                <li key={e.id} className="pin paper relative bg-white p-3 pb-5" style={{ transform: `rotate(${TILT[i]}deg)` }}>
                  <span className="tape -top-3 left-1/2 -translate-x-1/2" style={{ background: Object.values(PAPER)[i % 5] }} aria-hidden />
                  {e.image_url && <img src={e.image_url} alt={`Affiche : ${e.title}`} loading="lazy" className="w-full aspect-[3/4] object-cover" />}
                  <h3 className="display mt-4 text-xl font-bold leading-snug">{e.title}</h3>
                  <p className="mt-1.5 text-[15px] font-bold text-[var(--ink-2)] flex flex-wrap gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1.5 capitalize"><Clock size={15} aria-hidden /> {d.weekday} {d.day} {d.month} · {d.time}</span>
                    {e.location && <span className="inline-flex items-center gap-1.5"><MapPin size={15} aria-hidden /> {e.location}</span>}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Bibliothèque : une pochette par profil */}
      <section className="mat py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight">La bibliothèque des parents</h2>
          <p className="mt-3 text-lg text-[var(--ink-2)] max-w-2xl">
            {data.articles.length ? `${data.articles.length} articles` : 'Des articles'} écrits par l'association, rangés par profil.
          </p>
          <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {PROFILES.map((p, i) => {
              const n = articlesFor(p, data.articles).length + 1;
              return (
                <li key={p.key}>
                  <Link
                    to={`/articles/${p.dossier}`}
                    className="pin paper group relative flex flex-col h-full rounded-[4px_18px_4px_4px] p-5 pt-8"
                    style={{ backgroundColor: PAPER[p.key], transform: `rotate(${TILT[(i + 2) % 5] / 2}deg)` }}
                  >
                    <span aria-hidden className="absolute -top-4 left-0 h-5 w-24 rounded-t-lg" style={{ backgroundColor: PAPER[p.key] }} />
                    <h3 className="display text-xl font-extrabold leading-tight">{p.name}</h3>
                    <p className="mt-2 text-[15px] leading-snug flex-1">{p.short}</p>
                    <p className="mt-4 font-extrabold inline-flex items-center gap-1.5">
                      {data.loading ? '…' : `${n} article${n > 1 ? 's' : ''}`} <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
          {latest.length > 0 && (
            <div className="mt-16">
              <p className="display text-xl font-bold">Derniers ajouts</p>
              <ul className="mt-4 grid md:grid-cols-3 gap-6">
                {latest.map((a) => (
                  <li key={a.slug}>
                    <Link to={`/articles/${a.slug}`} className="paper group flex gap-4 items-center bg-white p-3 rounded-md">
                      <img src={a.image_url} alt="" loading="lazy" className="h-16 w-16 object-cover rounded shrink-0" />
                      <span className="font-extrabold leading-snug group-hover:text-[var(--act)]">{cleanTitle(a.title)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/articles" className="mt-6 inline-flex items-center gap-2 font-extrabold underline">
                Toute la bibliothèque <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Les mots des familles : post-it */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight text-center">Les mots des familles</h2>
          <div className="mt-14 grid md:grid-cols-2 gap-12">
            {TESTIMONIALS.map((t, i) => (
              <figure key={t.author} className="pin paper relative p-8 pt-10" style={{ backgroundColor: i ? '#FFC7B2' : '#FFE69E', transform: `rotate(${i ? 2 : -2}deg)` }}>
                <span className="tape -top-3 left-1/2 -translate-x-1/2" style={{ background: i ? '#CBD1FA' : '#BFE3F7' }} aria-hidden />
                <blockquote className="display text-xl sm:text-2xl leading-snug font-bold">«&nbsp;{t.text}&nbsp;»</blockquote>
                <figcaption className="mt-5 font-extrabold">{t.author}, <span className="font-semibold">{t.role}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Soutenir : deux tickets */}
      <section className="mat py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight text-center">Prendre part à l'aventure</h2>
          <div className="mt-12 grid md:grid-cols-2 gap-10">
            <div className="ticket paper bg-white px-10 py-9 rotate-[-1deg]">
              <h3 className="text-2xl font-extrabold">Adhérer</h3>
              <p className="display mt-1 text-5xl font-extrabold tabular-nums">5 € <span className="text-xl">par an</span></p>
              <p className="mt-4 text-[var(--ink-2)]">Accès prioritaire aux ateliers, une voix dans la vie de l'association, et des parents qui comprennent.</p>
              <a href={LINKS.adhesion} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-3.5 font-extrabold hover:bg-[var(--act)] transition-colors">
                J'adhère <ArrowUpRight size={18} aria-hidden />
              </a>
            </div>
            <div className="ticket paper bg-[#FFE69E] px-10 py-9 rotate-[1deg]">
              <h3 className="text-2xl font-extrabold">Donner</h3>
              <p className="display mt-1 text-5xl font-extrabold">Libre</p>
              <p className="mt-4 text-[var(--ink-2)]">Du matériel pédagogique, des intervenants spécialisés, plus de familles accueillies.</p>
              <a href={LINKS.don} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-3.5 font-extrabold hover:bg-[var(--act)] transition-colors">
                <Heart size={18} aria-hidden /> Je fais un don
              </a>
            </div>
          </div>
          <a href={LINKS.facebook} className="mt-12 mx-auto flex w-fit items-center gap-2 font-extrabold underline">
            <Facebook size={18} aria-hidden /> Rejoindre le groupe privé des parents
          </a>
        </div>
      </section>

      {/* Pied de page : papier déchiré */}
      <footer className="relative" style={{ backgroundColor: PAPER.tdah }}>
        <svg className="absolute -top-[18px] left-0 w-full h-[20px]" viewBox="0 0 1440 20" preserveAspectRatio="none" aria-hidden>
          <path d="M0 20V9l40 5 38-9 46 7 30-6 52 8 34-10 48 9 40-6 36 8 52-9 30 7 44-8 40 9 36-5 50 6 32-9 46 8 38-6 42 9 40-8 34 6 50-7 36 9 44-8 40 6 34-9 48 8 40-5 30 7 44-9 38 8 46-6 40 9 36-7 44 6 40-8 34 9 30-6 42 8V20Z" fill={PAPER.tdah} />
        </svg>
        <div className="mx-auto max-w-6xl px-4 py-14 grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo-indigo.png" alt="" width={52} height={52} className="h-12 w-12" />
              <p className="display text-2xl font-extrabold">Association Indigo</p>
            </div>
            <p className="mt-4 text-[var(--ink-2)] font-semibold">Accompagner les particularités, valoriser les singularités. Association loi 1901.</p>
            <p className="mt-4 flex items-center gap-2 font-extrabold"><MapPin size={18} aria-hidden /> Préseau (59990), Hauts-de-France</p>
            <a href={`mailto:${LINKS.email}`} className="mt-2 flex items-center gap-2 font-extrabold underline"><Mail size={18} aria-hidden /> {LINKS.email}</a>
          </div>
          <div>
            <p className="display text-xl font-bold">Ils nous soutiennent</p>
            <ul className="mt-5 flex flex-wrap gap-4">
              {PARTNERS.map((p, i) => (
                <li key={p.name}>
                  <a href={p.url} title={p.name} className="pin paper flex items-center justify-center h-20 w-20 overflow-hidden rounded-full bg-white p-3" style={{ transform: `rotate(${TILT[i % 5] * 2}deg)` }}>
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-contain" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t-2 border-[var(--ink)]/15">
          <div className="mx-auto max-w-6xl px-4 py-5 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold">
            <span>© {new Date().getFullYear()} Association Indigo</span>
            <Link to="/mentions-legales" className="underline">Mentions légales</Link>
            <Link to="/politique-confidentialite" className="underline">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
