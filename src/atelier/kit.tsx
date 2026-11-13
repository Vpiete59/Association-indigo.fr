// « L'atelier » : le kit commun (tokens, matières, en-tête, pied de page).
// Le monde : la table des ateliers vue de dessus. Tapis de découpe vert d'eau,
// papiers pastel découpés, scotch washi, étiquettes, tickets et tampons.
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, MapPin, Mail, Facebook, Scissors, Settings } from 'lucide-react';
import { LINKS, PARTNERS, type ProfileKey } from './data';

export const articleHref = (slug: string) => `/articles/${slug}`;

export const PAPER = {
  lilas: '#CBD1FA',
  saumon: '#FFC7B2',
  beurre: '#FFE69E',
  ciel: '#BFE3F7',
  mauve: '#E3CCF5',
  menthe: '#C9EBC4',
} as const;

export const PROFILE_PAPER: Record<ProfileKey, string> = {
  tdah: PAPER.lilas,
  dys: PAPER.saumon,
  hpi: PAPER.beurre,
  phobie: PAPER.ciel,
  hyper: PAPER.mauve,
};

// Couleurs des trois étincelles du logo, passées au papier
export const SPARK = { orange: '#F4A259', indigo: '#5361C9', rouge: '#EE7A5F' };

export const css = `
.atelier { --ink:#2A284E; --ink-2:#4B4873; --act:#3F49A6; --mat:#D5EDDC; --grid:#BEDFC8; --grid-strong:#A6D2B4;
  font-family:'Nunito',system-ui,sans-serif; color:var(--ink); background:#fff; -webkit-font-smoothing:antialiased; }
.atelier h1,.atelier h2,.atelier h3,.atelier .display { font-family:'Grandstander',system-ui,sans-serif; text-wrap:balance; }
.atelier p { text-wrap: pretty; }
.atelier ::selection { background:${PAPER.beurre}; color:var(--ink); }
.atelier :focus-visible { outline:3px solid var(--act); outline-offset:3px; border-radius:6px; }
.atelier a { text-underline-offset:4px; text-decoration-thickness:2px; }
html:has(.atelier) { scrollbar-color: #9FCDB0 var(--mat, #D5EDDC); }

/* Tapis de découpe : grille de 1 cm, trait renforcé tous les 5 cm, diagonale de coupe */
.atelier .mat { background-color:var(--mat);
  background-image:
    linear-gradient(var(--grid-strong) 1.5px, transparent 1.5px),
    linear-gradient(90deg, var(--grid-strong) 1.5px, transparent 1.5px),
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 200px 200px, 200px 200px, 40px 40px, 40px 40px;
  background-position: -1px -1px; }
.atelier .mat-diagonal { background: linear-gradient(-32deg, transparent calc(50% - 1px), rgba(122,184,144,.55) 50%, transparent calc(50% + 1px)); }

.atelier .paper { box-shadow: 0 1px 1px rgba(42,40,78,.07), 0 10px 22px -10px rgba(42,40,78,.32); }
.atelier .paper-lift { transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s cubic-bezier(.16,1,.3,1); }
.atelier .paper-lift:hover, .atelier .paper-lift:focus-visible { transform: rotate(0deg) translateY(-5px) !important;
  box-shadow: 0 2px 2px rgba(42,40,78,.06), 0 22px 34px -14px rgba(42,40,78,.38); }

/* Scotch washi : bords dentelés, légèrement translucide */
.atelier .tape { position:absolute; height:26px; width:92px; opacity:.85; z-index:2; pointer-events:none;
  -webkit-mask: conic-gradient(from -45deg at left,#0000 25%,#000 0) left/51% 7px repeat-y, conic-gradient(from 135deg at right,#0000 25%,#000 0) right/51% 7px repeat-y;
          mask: conic-gradient(from -45deg at left,#0000 25%,#000 0) left/51% 7px repeat-y, conic-gradient(from 135deg at right,#0000 25%,#000 0) right/51% 7px repeat-y; }

/* Ticket : deux encoches demi-rondes */
.atelier .ticket { -webkit-mask: radial-gradient(13px at 0 50%,#0000 98%,#000) left/51% 100% no-repeat, radial-gradient(13px at 100% 50%,#0000 98%,#000) right/51% 100% no-repeat;
          mask: radial-gradient(13px at 0 50%,#0000 98%,#000) left/51% 100% no-repeat, radial-gradient(13px at 100% 50%,#0000 98%,#000) right/51% 100% no-repeat; }

/* Étiquette : coins supérieurs coupés */
.atelier .tag { clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%, 0 16px); }

/* Les étiquettes de la guirlande se balancent au survol, accrochées par leur œillet */
.atelier .swing { transform-origin: 50% 0; transform: rotate(var(--r,0deg)); }
.atelier .swing:hover, .atelier .swing:focus-visible { animation: atelier-swing 1.1s cubic-bezier(.3,.7,.4,1); }
@keyframes atelier-swing { 0%{transform:rotate(var(--r,0deg))} 25%{transform:rotate(calc(var(--r,0deg) + 7deg))}
  50%{transform:rotate(calc(var(--r,0deg) - 4deg))} 75%{transform:rotate(calc(var(--r,0deg) + 2deg))} 100%{transform:rotate(var(--r,0deg))} }

/* Au chargement, les pièces se posent sur le tapis (elles restent visibles : seul le geste est animé) */
.atelier .settle { transform: rotate(var(--r,0deg)); animation: atelier-settle .9s cubic-bezier(.2,.85,.25,1.15) both; animation-delay: var(--d,0ms); }
@keyframes atelier-settle { from { transform: translateY(-22px) rotate(calc(var(--r,0deg) - 5deg)) scale(1.03); } to { transform: rotate(var(--r,0deg)); } }

.atelier details > summary { list-style:none; cursor:pointer; }
.atelier details > summary::-webkit-details-marker { display:none; }
.atelier details[open] .chev { transform: rotate(45deg); }

@media (prefers-reduced-motion: reduce) {
  .atelier .settle, .atelier .swing:hover, .atelier .swing:focus-visible { animation:none; }
  .atelier .paper-lift { transition:none; }
}
`;

export function Tape({ color, style, className = '' }: { color: string; style?: CSSProperties; className?: string }) {
  return <span aria-hidden className={`tape ${className}`} style={{ background: color, ...style }} />;
}

// Étincelle à 4 branches, découpée dans du papier (reprise du logo)
export function Sparkle({ color, size = 36, className = '', style }: { color: string; size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className={className} style={style}>
      <path
        d="M20 2c1.6 9.2 5.6 14.8 16.5 18-10.9 3.2-14.9 8.8-16.5 18-1.6-9.2-5.6-14.8-16.5-18C14.4 16.8 18.4 11.2 20 2Z"
        fill={color}
        style={{ filter: 'drop-shadow(0 2px 2px rgba(42,40,78,.22))' }}
      />
    </svg>
  );
}

// Pointillés de découpe, avec les ciseaux
export function CutLine({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-2 text-[var(--ink-2)] ${className}`}>
      <Scissors size={20} className="-scale-x-100 shrink-0" />
      <span className="h-0 flex-1 border-t-2 border-dashed border-current opacity-50" />
    </div>
  );
}

// Tampon encreur
export function Stamp({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`grid place-items-center rounded-full border-[3px] border-[var(--act)] text-[var(--act)] text-center ${className}`}
      style={{ boxShadow: 'inset 0 0 0 4px #fff, inset 0 0 0 6px var(--act)', ...style }}
    >
      <span className="display font-extrabold uppercase leading-tight tracking-[0.04em] px-4">{children}</span>
    </div>
  );
}

const NAV = [
  { label: 'Comprendre', to: '/articles' },
  { label: 'Rendez-vous', to: '/evenements' },
  { label: 'Questions', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

export function AtelierHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-30 bg-white border-b-2 border-[var(--ink)]">
      <div className="mx-auto max-w-6xl px-4 h-[76px] flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Association Indigo, retour à l'accueil">
          <img src="/logo-indigo.png" alt="" width={48} height={48} className="h-12 w-12" />
          <span className="display text-xl font-extrabold leading-none">Association Indigo</span>
        </Link>
        <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-1 font-extrabold">
          {NAV.map((n) => (
            <NavLink
              key={n.label}
              to={n.to}
              className={({ isActive }) => `px-4 py-2.5 rounded-full ${isActive ? 'bg-[var(--mat)] text-[var(--ink)] shadow-[inset_0_0_0_2px_var(--grid-strong)]' : 'hover:bg-[var(--mat)]'}`}
            >
              {n.label}
            </NavLink>
          ))}
          <a href={LINKS.adhesion} className="ml-2 rounded-full bg-[var(--ink)] text-white px-5 py-3 hover:bg-[var(--act)] transition-colors">
            Adhérer · 5 € par an
          </a>
          <Link to="/admin" title="Espace bénévoles" aria-label="Espace bénévoles (administration)" className="ml-1 grid h-11 w-11 place-items-center rounded-full text-[var(--ink-2)] hover:bg-[var(--mat)] hover:text-[var(--ink)]">
            <Settings size={20} aria-hidden />
          </Link>
        </nav>
        <button className="lg:hidden p-3 rounded-full hover:bg-[var(--mat)]" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav aria-label="Navigation mobile" className="lg:hidden border-t border-[var(--grid)] px-4 py-3 grid gap-1 font-extrabold">
          {NAV.map((n) => (
            <NavLink
              key={n.label}
              to={n.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `px-3 py-3 rounded-xl ${isActive ? 'bg-[var(--mat)]' : 'hover:bg-[var(--mat)]'}`}
            >
              {n.label}
            </NavLink>
          ))}
          <a href={LINKS.adhesion} className="mt-1 px-3 py-3 rounded-xl bg-[var(--ink)] text-white text-center">Adhérer · 5 € par an</a>
          <Link to="/admin" className="mt-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-[var(--ink-2)] hover:bg-[var(--mat)]">
            <Settings size={18} aria-hidden /> Espace bénévoles
          </Link>
        </nav>
      )}
    </header>
  );
}

const TILT = [-4, 3, -2, 5, -3, 2, -5];

export function AtelierFooter() {
  return (
    <footer className="relative mt-[22px]" style={{ backgroundColor: PAPER.lilas }}>
      {/* bord de papier déchiré */}
      <svg className="absolute -top-[20px] left-0 w-full h-[22px]" viewBox="0 0 1440 22" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0 22V10l38 5 41-9 44 7 32-6 50 8 36-10 46 9 42-6 34 8 54-9 28 7 46-8 38 9 38-5 48 6 34-9 44 8 40-6 40 9 42-8 32 6 52-7 34 9 46-8 38 6 36-9 46 8 42-5 28 7 46-9 36 8 48-6 38 9 38-7 42 6 42-8 32 9 32-6 40 8V22Z"
          fill={PAPER.lilas}
        />
      </svg>
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 grid gap-12 lg:grid-cols-[1.1fr_1.4fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo-indigo.png" alt="" width={52} height={52} className="h-12 w-12" />
            <p className="display text-2xl font-extrabold">Association Indigo</p>
          </div>
          <p className="mt-4 font-semibold text-[var(--ink-2)] max-w-sm">
            Accompagner les particularités, valoriser les singularités. Association loi 1901 de parents, à Préseau.
          </p>
          <p className="mt-5 flex items-center gap-2 font-extrabold"><MapPin size={18} aria-hidden /> Préseau (59990), Hauts-de-France</p>
          <a href={`mailto:${LINKS.email}`} className="mt-2 flex items-center gap-2 font-extrabold underline"><Mail size={18} aria-hidden /> {LINKS.email}</a>
          <a href={LINKS.facebook} className="mt-2 flex items-center gap-2 font-extrabold underline"><Facebook size={18} aria-hidden /> Le groupe privé des parents</a>
        </div>
        <div>
          <p className="display text-xl font-bold">Ils soutiennent l'association</p>
          <ul className="mt-5 flex flex-wrap gap-4">
            {PARTNERS.map((p, i) => (
              <li key={p.name}>
                <a
                  href={p.url}
                  title={p.name}
                  className="paper paper-lift flex items-center justify-center h-20 w-20 overflow-hidden rounded-full bg-white p-3"
                  style={{ transform: `rotate(${TILT[i]}deg)` }}
                >
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
          <Link to="/faq" className="underline">Questions fréquentes</Link>
          <Link to="/admin" className="underline">Espace bénévoles</Link>
        </div>
      </div>
    </footer>
  );
}

type SettleVars = CSSProperties & { '--r'?: string; '--d'?: string };

// En-tête des pages intérieures : le titre découpé dans une bande de papier, posé sur le tapis
export function PageHeader({
  title, intro, paper = '#FFFFFF', children, sparkles = true,
}: { title: string; intro?: ReactNode; paper?: string; children?: ReactNode; sparkles?: boolean }) {
  return (
    <section className="mat relative overflow-hidden">
      <div aria-hidden className="mat-diagonal pointer-events-none absolute inset-0" />
      {sparkles && (
        <div aria-hidden className="pointer-events-none absolute right-[6%] top-8 hidden md:block">
          <Sparkle color={SPARK.rouge} size={44} className="settle absolute right-10 top-0" style={{ '--r': '10deg', '--d': '300ms' } as SettleVars} />
          <Sparkle color={SPARK.indigo} size={32} className="settle absolute right-0 top-12" style={{ '--r': '-8deg', '--d': '380ms' } as SettleVars} />
          <Sparkle color={SPARK.orange} size={38} className="settle absolute right-16 top-16" style={{ '--r': '4deg', '--d': '460ms' } as SettleVars} />
        </div>
      )}
      <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-14 sm:pt-16 sm:pb-16">
        <h1
          className="settle paper w-fit max-w-full px-4 pt-2 pb-1.5 text-[clamp(2.2rem,5vw,3.9rem)] font-extrabold leading-[1.05]"
          style={{ backgroundColor: paper, clipPath: 'polygon(0 3%,100% 0,99.5% 97%,0.5% 100%)', '--r': '-1.2deg', '--d': '80ms' } as SettleVars}
        >
          {title}
        </h1>
        {intro && <div className="mt-6 max-w-[40rem] text-lg sm:text-xl font-semibold leading-relaxed text-[var(--ink-2)]">{intro}</div>}
        {children}
      </div>
    </section>
  );
}
