// Routes /preview/* : chargées uniquement en développement (voir App.tsx), jamais dans le build de production.
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DirectionA from './DirectionA';
import DirectionB from './DirectionB';
import HomeAtelier from './atelier/HomeAtelier';
import ArticleAtelier from './atelier/ArticleAtelier';

const DIRECTIONS = [
  {
    id: 'a',
    name: 'Le classeur',
    pitch: "Les intercalaires de la liste de fournitures. Chaque profil est un onglet : le parent choisit celui de son enfant, toute la page prend sa couleur.",
    fonts: 'Lexend + Atkinson Hyperlegible (polices conçues pour la lecture, adaptées aux DYS)',
    swatches: ['#D9DDFB', '#FFD9C7', '#FBEBB5', '#CFEBD0', '#CFE6F6', '#23264A'],
  },
  {
    id: 'b',
    name: 'Ciel indigo',
    pitch: "L'heure indigo au-dessus des champs de Préseau. Les étincelles du logo deviennent une constellation : une étoile par profil, la page passe du crépuscule à la nuit.",
    fonts: 'Fredoka + Nunito Sans (formes rondes, comme les personnages du logo)',
    swatches: ['#B9BEEE', '#CDC8F1', '#FBD6C5', '#B6DDB6', '#F2A65A', '#252A63'],
  },
  {
    id: 'c',
    name: "L'atelier",
    pitch: "La table des ateliers vue de dessus : tapis de découpe, guirlande d'étiquettes, papier découpé, scotch washi. Version approfondie, avec la page article.",
    fonts: 'Grandstander + Nunito (une écriture d’enfant, mais lisible)',
    swatches: ['#D7EEDD', '#CBD1FA', '#FFC7B2', '#FFE69E', '#BFE3F7', '#2A284E'],
  },
];

function Switcher() {
  const item = 'px-3.5 py-2 rounded-full text-sm font-bold transition-colors';
  return (
    <nav
      aria-label="Changer de maquette"
      className="fixed bottom-4 right-4 z-[100] flex items-center gap-1 rounded-full bg-[#1d1f3a] p-1.5 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)]"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <Link to="/preview" className={`${item} hover:bg-white/15`}>Comparer</Link>
      {DIRECTIONS.map((d) => (
        <NavLink key={d.id} to={`/preview/${d.id}`} end={false} className={({ isActive }) => `${item} ${isActive ? 'bg-white text-[#1d1f3a]' : 'hover:bg-white/15'}`}>
          {d.id.toUpperCase()}
        </NavLink>
      ))}
      <Link to="/" className={`${item} hover:bg-white/15`}>Site actuel</Link>
    </nav>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-[#F5F5FA] text-[#1d1f3a] px-4 py-14" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <Helmet>
        <title>Maquettes · Association Indigo</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <img src="/logo-indigo.png" alt="" className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Association Indigo : 3 directions de design</h1>
        </div>
        <p className="mt-3 max-w-3xl text-lg text-[#4a4c6a]">
          Page d'accueil complète, avec les vrais articles et événements de la base. Même contenu, même logo, trois mondes différents.
          Aperçu local uniquement : ces pages n'existent pas dans le build de production.
        </p>
        <ul className="mt-10 grid md:grid-cols-3 gap-6">
          {DIRECTIONS.map((d) => (
            <li key={d.id}>
              <Link to={`/preview/${d.id}`} className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 hover:ring-[#4553B8]">
                <div className="flex h-16 overflow-hidden rounded-xl">
                  {d.swatches.map((c) => <span key={c} className="flex-1" style={{ backgroundColor: c }} />)}
                </div>
                <h2 className="mt-5 text-2xl font-bold">{d.id.toUpperCase()} · {d.name}</h2>
                <p className="mt-2 flex-1 text-[#4a4c6a] leading-relaxed">{d.pitch}</p>
                <p className="mt-4 text-sm text-[#4a4c6a]">{d.fonts}</p>
                <span className="mt-5 font-bold text-[#4553B8] group-hover:underline">Ouvrir la maquette →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default function PreviewRouter() {
  return (
    <>
      <Routes>
        <Route index element={<Index />} />
        <Route path="a" element={<DirectionA />} />
        <Route path="b" element={<DirectionB />} />
        <Route path="c" element={<HomeAtelier />} />
        <Route path="c/articles/:slug" element={<ArticleAtelier />} />
      </Routes>
      <Switcher />
    </>
  );
}
