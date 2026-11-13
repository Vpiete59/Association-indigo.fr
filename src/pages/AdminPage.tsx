// Espace bénévoles « L'atelier » : articles (Comprendre), rendez-vous et fréquentation.
import { useEffect, useMemo, useState, lazy, Suspense, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Save, X, LogOut, Pencil, Trash2, ExternalLink, Search, FileText, CalendarDays, BarChart3,
  CheckCircle2, CircleDashed, ArrowLeft, Lightbulb, MapPin,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Article, type Event } from '../lib/supabase';
import SEO from '../components/SEO';
import { css, PAPER, PROFILE_PAPER, Tape } from '../atelier/kit';
import { PROFILES } from '../atelier/data';
import { articleText, wordCount } from '../atelier/articleBody';

// Recharts pèse ~200 Ko : chargé seulement à l'ouverture de l'onglet.
// Après une mise en ligne, l'ancien fichier n'existe plus : on recharge la page une fois.
const VisitorsPanel = lazy(() =>
  import('../components/admin/VisitorsPanel').catch(() => {
    if (!sessionStorage.getItem('indigo-admin-reloaded')) {
      sessionStorage.setItem('indigo-admin-reloaded', '1');
      window.location.reload();
    }
    return { default: () => <p className="font-semibold">Rechargez la page pour afficher les statistiques.</p> };
  }),
);

type Tab = 'articles' | 'events' | 'visitors';
const SHORT = 300; // en dessous, Google considère souvent la page comme trop mince
const GOOD = 600;

const CATEGORIES = [...PROFILES.map((p) => p.category), 'Autre'];

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// <input type="datetime-local"> attend l'heure locale, pas l'heure UTC
const toLocalInput = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const frDate = (iso: string, withTime = false) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    weekday: withTime ? 'long' : undefined,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });

const EMPTY_ARTICLE = {
  title: '', subtitle: '', slug: '', category: PROFILES[0].category,
  image_url: '', paragraph_1: '', poster_image_url: '', paragraph_2: '', image_2_url: '',
  cta_text: '', cta_link: '', meta_description: '', meta_keywords: '', published: false,
};
const EMPTY_EVENT = { title: '', description: '', image_url: '', event_date: '', location: '', registration_link: '', published: false };

type Notice = { kind: 'ok' | 'error'; text: string } | null;

/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const { user, loading } = useAuth();
  return (
    <div className="atelier min-h-screen">
      <style>{css}</style>
      <SEO title="Espace bénévoles" description="Espace réservé aux bénévoles de l'Association Indigo." canonical="/admin" noIndex />
      {loading ? <div className="mat min-h-screen" aria-busy="true" /> : user ? <Dashboard email={user.email || ''} /> : <Login />}
    </div>
  );
}

/* ------------------------------ Connexion ------------------------------ */

function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) setError(/invalid/i.test(error.message) ? 'Email ou mot de passe incorrect.' : `Connexion impossible : ${error.message}`);
  }

  return (
    <main className="mat grid min-h-screen place-items-center px-4 py-16">
      <div className="paper relative w-full max-w-md rotate-[-0.6deg] bg-white px-8 py-10 sm:px-10">
        <Tape color={PAPER.lilas} className="-top-3 left-1/2 -translate-x-1/2" />
        <div className="flex items-center gap-3">
          <img src="/logo-indigo.png" alt="" width={48} height={48} className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-extrabold leading-tight">Espace bénévoles</h1>
            <p className="text-sm font-semibold text-[var(--ink-2)]">Association Indigo</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-8 grid gap-5">
          <Field label="Email">
            <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
          </Field>
          <Field label="Mot de passe">
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required />
          </Field>
          {error && (
            <p role="alert" className="rounded-xl bg-[#FDE8E2] px-4 py-3 text-sm font-bold text-[#9A3A22]">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn-primary justify-center">
            {busy ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
        <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-extrabold underline">
          <ArrowLeft size={15} aria-hidden /> Retour au site
        </Link>
      </div>
      <AdminStyles />
    </main>
  );
}

/* ------------------------------ Tableau de bord ------------------------------ */

export function Dashboard({ email }: { email: string }) {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<Tab>(() => {
    const t = new URLSearchParams(window.location.search).get('onglet');
    return t === 'events' || t === 'visitors' ? t : 'articles';
  });
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  async function load() {
    const [a, e] = await Promise.all([
      supabase.from('articles').select('*').order('updated_at', { ascending: false }),
      supabase.from('events').select('*').order('event_date', { ascending: false }),
    ]);
    if (a.error || e.error) setNotice({ kind: 'error', text: `Chargement impossible : ${(a.error || e.error)!.message}` });
    setArticles(a.data || []);
    setEvents(e.data || []);
    setLoaded(true);
  }
  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('onglet', tab);
    window.history.replaceState(null, '', url);
  }, [tab]);

  useEffect(() => {
    if (!notice || notice.kind === 'error') return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const titles = useMemo(() => Object.fromEntries(articles.map((a) => [`/articles/${a.slug}`, a.title])), [articles]);
  const upcoming = events.filter((e) => new Date(e.event_date) >= new Date()).length;
  const toEnrich = articles.filter((a) => a.published && wordCount(articleText(a)) < SHORT).length;

  const TABS: { key: Tab; label: string; icon: ReactNode; count?: string }[] = [
    { key: 'articles', label: 'Articles', icon: <FileText size={18} aria-hidden />, count: loaded ? String(articles.length) : undefined },
    { key: 'events', label: 'Rendez-vous', icon: <CalendarDays size={18} aria-hidden />, count: loaded ? `${upcoming} à venir` : undefined },
    { key: 'visitors', label: 'Fréquentation', icon: <BarChart3 size={18} aria-hidden /> },
  ];

  return (
    <div className="mat min-h-screen pb-24">
      <header className="border-b-2 border-[var(--ink)] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4">
          <Link to="/" className="flex items-center gap-3" title="Voir le site">
            <img src="/logo-indigo.png" alt="" width={40} height={40} className="h-10 w-10" />
            <span className="leading-tight">
              <span className="display block text-lg font-extrabold">Espace bénévoles</span>
              <span className="block text-xs font-bold text-[var(--ink-2)]">{email}</span>
            </span>
          </Link>
          <nav aria-label="Sections" className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto px-1 [scrollbar-width:none] xl:order-none xl:mx-0 xl:w-auto xl:flex-1 xl:justify-center xl:px-0">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-current={tab === t.key ? 'page' : undefined}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-extrabold transition-colors ${
                  tab === t.key ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-2)] hover:bg-[var(--mat)]'
                }`}
              >
                {t.icon}
                {t.label}
                {t.count && <span className={`text-xs font-bold ${tab === t.key ? 'text-white/75' : 'text-[var(--ink-2)]/75'}`}>{t.count}</span>}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-extrabold hover:bg-[var(--mat)] md:inline-flex">
              <ExternalLink size={16} aria-hidden /> Voir le site
            </a>
            <button type="button" onClick={signOut} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-extrabold text-[#9A3A22] hover:bg-[#FDE8E2]">
              <LogOut size={16} aria-hidden /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-8">
        {notice && (
          <div
            role={notice.kind === 'error' ? 'alert' : 'status'}
            className="paper mb-6 flex items-start justify-between gap-4 bg-white px-5 py-4 font-bold"
            style={{ borderLeft: `6px solid ${notice.kind === 'ok' ? '#6BBF7A' : '#EE7A5F'}` }}
          >
            <span>{notice.text}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Fermer le message" className="shrink-0">
              <X size={18} aria-hidden />
            </button>
          </div>
        )}

        {tab === 'articles' && <ArticlesTab articles={articles} loaded={loaded} toEnrich={toEnrich} reload={load} notify={setNotice} />}
        {tab === 'events' && <EventsTab events={events} loaded={loaded} reload={load} notify={setNotice} />}
        {tab === 'visitors' && (
          <>
            <TabTitle title="Fréquentation du site" intro="Les visites des familles sur le site public, comptées de façon anonyme." />
            <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white/70" />}>
              <VisitorsPanel titles={titles} />
            </Suspense>
          </>
        )}
      </main>
      <AdminStyles />
    </div>
  );
}

/* ------------------------------ Articles ------------------------------ */

type Filter = 'all' | 'published' | 'draft' | 'short';

function ArticlesTab({
  articles, loaded, toEnrich, reload, notify,
}: { articles: Article[]; loaded: boolean; toEnrich: number; reload: () => Promise<void>; notify: (n: Notice) => void }) {
  const [editing, setEditing] = useState<Article | 'new' | null>(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const list = articles.filter((a) => {
    const words = wordCount(articleText(a));
    if (filter === 'published' && !a.published) return false;
    if (filter === 'draft' && a.published) return false;
    if (filter === 'short' && (words >= SHORT || !a.published)) return false;
    return !q || norm(`${a.title} ${a.category} ${a.slug}`).includes(norm(q));
  });

  async function remove(a: Article) {
    if (!window.confirm(`Supprimer définitivement « ${a.title} » ?\n\nL'adresse de la page disparaîtra aussi de Google. Pour la retirer sans la perdre, décochez plutôt « Publié ».`)) return;
    const { error } = await supabase.from('articles').delete().eq('id', a.id);
    if (error) notify({ kind: 'error', text: `Suppression impossible : ${error.message}` });
    else {
      notify({ kind: 'ok', text: 'Article supprimé.' });
      reload();
    }
  }

  if (editing)
    return (
      <ArticleEditor
        article={editing === 'new' ? null : editing}
        existingSlugs={articles.filter((a) => editing === 'new' || a.id !== editing.id).map((a) => a.slug)}
        onClose={() => setEditing(null)}
        onSaved={async (text) => {
          notify({ kind: 'ok', text });
          setEditing(null);
          await reload();
        }}
        notify={notify}
      />
    );

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Tous' },
    { key: 'published', label: 'Publiés' },
    { key: 'draft', label: 'Brouillons' },
    { key: 'short', label: `À étoffer${toEnrich ? ` (${toEnrich})` : ''}` },
  ];

  return (
    <>
      <TabTitle
        title="Articles « Comprendre »"
        intro="Les fiches de la bibliothèque. Un article publié apparaît sur le site et dans Google à la prochaine mise à jour du site."
        action={
          <button type="button" onClick={() => setEditing('new')} className="btn-primary">
            <Plus size={18} aria-hidden /> Nouvel article
          </button>
        }
      />

      {toEnrich > 0 && filter !== 'short' && (
        <button
          type="button"
          onClick={() => setFilter('short')}
          className="paper mb-6 flex w-full items-start gap-3 bg-white px-5 py-4 text-left font-semibold"
          style={{ backgroundColor: PAPER.beurre }}
        >
          <Lightbulb className="mt-0.5 shrink-0" size={20} aria-hidden />
          <span>
            <strong>{toEnrich} article{toEnrich > 1 ? 's' : ''} publié{toEnrich > 1 ? 's' : ''} font moins de {SHORT} mots.</strong> Google indexe mal les pages trop courtes : les compléter aide les familles à les trouver.
          </span>
        </button>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="relative min-w-[16rem] flex-1">
          <span className="sr-only">Rechercher un article</span>
          <Search size={18} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-2)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un titre…" className="input" style={{ paddingLeft: '2.9rem' }} />
        </label>
        <div role="group" aria-label="Filtrer" className="flex flex-wrap gap-1 rounded-full bg-white p-1 paper">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-extrabold ${filter === f.key ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-2)] hover:bg-[var(--mat)]'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {!loaded ? (
        <div className="h-64 animate-pulse rounded-2xl bg-white/70" />
      ) : list.length === 0 ? (
        <p className="paper bg-white p-10 text-center font-semibold text-[var(--ink-2)]">Aucun article ne correspond.</p>
      ) : (
        <ul className="paper divide-y-2 divide-[#EEECF5] bg-white">
          {list.map((a) => {
            const words = wordCount(articleText(a));
            const profile = PROFILES.find((p) => p.category === a.category);
            return (
              <li key={a.id} className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
                {a.image_url ? (
                  <img src={a.image_url} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: PAPER.lilas }}>
                    <FileText size={20} aria-hidden />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-extrabold">{a.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-[var(--ink-2)]">
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-[var(--ink)]" style={{ backgroundColor: profile ? PROFILE_PAPER[profile.key] : '#EEECF5' }}>
                      {a.category}
                    </span>
                    <span>Modifié le {frDate(a.updated_at)}</span>
                    <span className={words < SHORT ? 'font-extrabold text-[#B5521F]' : ''}>
                      {words} mots{words < SHORT ? ' · à étoffer' : ''}
                    </span>
                  </p>
                </div>
                <StatusPill published={a.published} />
                <div className="flex items-center gap-1">
                  {a.published && (
                    <a href={`/articles/${a.slug}`} target="_blank" rel="noopener noreferrer" className="icon-btn" title="Voir sur le site" aria-label={`Voir « ${a.title} » sur le site`}>
                      <ExternalLink size={18} aria-hidden />
                    </a>
                  )}
                  <button type="button" onClick={() => setEditing(a)} className="icon-btn" title="Modifier" aria-label={`Modifier « ${a.title} »`}>
                    <Pencil size={18} aria-hidden />
                  </button>
                  <button type="button" onClick={() => remove(a)} className="icon-btn text-[#9A3A22] hover:bg-[#FDE8E2]" title="Supprimer" aria-label={`Supprimer « ${a.title} »`}>
                    <Trash2 size={18} aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function ArticleEditor({
  article, existingSlugs, onClose, onSaved, notify,
}: {
  article: Article | null;
  existingSlugs: string[];
  onClose: () => void;
  onSaved: (msg: string) => void;
  notify: (n: Notice) => void;
}) {
  const [form, setForm] = useState(() =>
    article
      ? Object.fromEntries(Object.keys(EMPTY_ARTICLE).map((k) => [k, (article as unknown as Record<string, unknown>)[k] ?? (EMPTY_ARTICLE as Record<string, unknown>)[k]])) as typeof EMPTY_ARTICLE
      : EMPTY_ARTICLE,
  );
  const [slugTouched, setSlugTouched] = useState(!!article);
  useEffect(() => window.scrollTo({ top: 0 }), []);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const slug = slugTouched ? form.slug : generateSlug(form.title);
  const words = wordCount(articleText(form));
  const metaLen = form.meta_description.trim().length;
  const slugTaken = existingSlugs.includes(slug);
  const categories = CATEGORIES.includes(form.category) ? CATEGORIES : [form.category, ...CATEGORIES];

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!slug) return notify({ kind: 'error', text: "L'adresse de la page est vide : ajoutez un titre." });
    if (slugTaken) return notify({ kind: 'error', text: `L'adresse /articles/${slug} est déjà prise par un autre article.` });
    setSaving(true);
    const payload = { ...form, slug };
    const { error } = article
      ? await supabase.from('articles').update(payload).eq('id', article.id)
      : await supabase.from('articles').insert([payload]);
    setSaving(false);
    if (error) notify({ kind: 'error', text: `Enregistrement impossible : ${error.message}` });
    else onSaved(form.published ? 'Article enregistré et publié.' : 'Brouillon enregistré.');
  }

  return (
    <form onSubmit={save}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 font-extrabold underline">
          <ArrowLeft size={16} aria-hidden /> Tous les articles
        </button>
        <div className="flex items-center gap-3">
          {article?.published && (
            <a href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-extrabold underline">
              <ExternalLink size={15} aria-hidden /> Voir la page
            </a>
          )}
          <button type="submit" disabled={saving} className="btn-primary">
            <Save size={18} aria-hidden /> {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid gap-6">
          <Sheet title={article ? 'Modifier l’article' : 'Nouvel article'} paper={PAPER.lilas}>
            <Field label="Titre">
              <input value={form.title} onChange={(e) => set('title', e.target.value)} className="input text-lg font-bold" required />
            </Field>
            <Field
              label="Adresse de la page"
              hint={article ? 'Changer l’adresse d’un article déjà publié casse les liens existants et son référencement.' : 'Créée à partir du titre. Modifiable.'}
            >
              <div className="flex items-center rounded-xl border-2 border-[#D9D6E8] bg-[#F7F6FB] focus-within:border-[var(--act)]">
                <span className="pl-4 text-sm font-bold text-[var(--ink-2)]">/articles/</span>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set('slug', generateSlug(e.target.value));
                  }}
                  className="w-full bg-transparent py-3 pr-4 font-bold outline-none"
                  aria-invalid={slugTaken}
                />
              </div>
              {slugTaken && <p className="mt-1.5 text-sm font-bold text-[#9A3A22]">Cette adresse est déjà utilisée.</p>}
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Rubrique">
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input">
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Image du bandeau" hint="Lien de l'image (https://…)">
                <input value={form.image_url} onChange={(e) => set('image_url', e.target.value)} className="input" placeholder="https://" />
              </Field>
            </div>
            {form.image_url && <img src={form.image_url} alt="Aperçu du bandeau" className="h-28 w-auto rounded-lg border-2 border-[#EEECF5] object-cover" />}
            <Field label="Sous-titre" hint="Une phrase qui donne envie de lire.">
              <textarea value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} rows={2} className="input" />
            </Field>
          </Sheet>

          <Sheet title="Le texte" paper={PAPER.beurre}>
            <Field label="Introduction" hint="Le début de l'article, affiché en premier.">
              <textarea value={form.paragraph_1} onChange={(e) => set('paragraph_1', e.target.value)} rows={10} className="input leading-relaxed" />
            </Field>
            <Field label="Suite de l'article" hint="Affichée juste après l'introduction. C'est ici qu'on développe : intertitres, conseils, listes.">
              <textarea value={form.paragraph_2} onChange={(e) => set('paragraph_2', e.target.value)} rows={14} className="input leading-relaxed" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Affiche ou infographie" hint="Lien de l'image, affichée sous le texte.">
                <input value={form.poster_image_url} onChange={(e) => set('poster_image_url', e.target.value)} className="input" placeholder="https://" />
              </Field>
              <Field label="Image d'illustration" hint="Lien de l'image, en bas de l'article.">
                <input value={form.image_2_url} onChange={(e) => set('image_2_url', e.target.value)} className="input" placeholder="https://" />
              </Field>
            </div>
          </Sheet>

          <Sheet title="Bouton en bas de l'article" paper={PAPER.ciel}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Texte du bouton">
                <input value={form.cta_text} onChange={(e) => set('cta_text', e.target.value)} className="input" placeholder="Ex. : Rejoindre le groupe des parents" />
              </Field>
              <Field label="Lien du bouton">
                <input value={form.cta_link} onChange={(e) => set('cta_link', e.target.value)} className="input" placeholder="https://" />
              </Field>
            </div>
          </Sheet>

          <Sheet title="Dans Google" paper={PAPER.menthe}>
            <Field label="Résumé pour Google" hint="Le texte gris sous le titre dans les résultats de recherche.">
              <textarea value={form.meta_description} onChange={(e) => set('meta_description', e.target.value)} rows={3} className="input" />
              <p className={`mt-1.5 text-sm font-bold ${metaLen > 160 || (metaLen > 0 && metaLen < 110) ? 'text-[#B5521F]' : 'text-[var(--ink-2)]'}`}>
                {metaLen} caractères · idéal entre 110 et 160
              </p>
            </Field>
            <GooglePreview title={form.title} slug={slug} description={form.meta_description || form.subtitle || form.paragraph_1} />
            <Field label="Mots-clés" hint="Séparés par des virgules. Utile pour vous, Google ne s'en sert plus.">
              <input value={form.meta_keywords} onChange={(e) => set('meta_keywords', e.target.value)} className="input" />
            </Field>
          </Sheet>
        </div>

        <aside className="grid gap-6 lg:sticky lg:top-6">
          <div className="paper bg-white p-5">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span>
                <span className="block font-extrabold">Publié sur le site</span>
                <span className="block text-sm font-semibold text-[var(--ink-2)]">{form.published ? 'Visible par tous' : 'Brouillon, invisible'}</span>
              </span>
              <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="peer sr-only" />
              <span aria-hidden className="relative h-8 w-14 shrink-0 rounded-full bg-[#D9D6E8] transition-colors after:absolute after:left-1 after:top-1 after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-[#6BBF7A] peer-checked:after:translate-x-6 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-[var(--act)]" />
            </label>
          </div>

          <div className="paper bg-white p-5">
            <p className="font-extrabold">Longueur</p>
            <p className="display mt-1 text-3xl font-extrabold tabular-nums">{words} mots</p>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#EEECF5]">
              <div
                className="h-full rounded-full transition-[width]"
                style={{ width: `${Math.min(100, (words / GOOD) * 100)}%`, backgroundColor: words < SHORT ? '#F4A259' : '#6BBF7A' }}
              />
            </div>
            <p className="mt-2 text-sm font-semibold text-[var(--ink-2)]">
              {words < SHORT
                ? `Encore ${SHORT - words} mots pour que Google prenne la page au sérieux.`
                : words < GOOD
                  ? 'Correct. Vers 600 mots, la page répond vraiment aux questions des parents.'
                  : 'Belle fiche, bien fournie.'}
            </p>
          </div>

          <div className="paper p-5 text-[15px]" style={{ backgroundColor: PAPER.beurre }}>
            <p className="flex items-center gap-2 font-extrabold">
              <Lightbulb size={18} aria-hidden /> Mettre en forme
            </p>
            <dl className="mt-3 grid gap-3 font-semibold">
              <div>
                <dt className="font-extrabold">Un intertitre</dt>
                <dd>Une ligne seule, courte, sans point final. Ou une question : « Comment l'aider ? »</dd>
              </div>
              <div>
                <dt className="font-extrabold">Une liste</dt>
                <dd>Une ligne par élément, qui commence par « - » ou « • ».</dd>
              </div>
              <div>
                <dt className="font-extrabold">Un lien</dt>
                <dd>
                  <code className="rounded bg-white/70 px-1">[les troubles DYS](/articles/dys)</code>
                </dd>
              </div>
              <div>
                <dt className="font-extrabold">Un nouveau paragraphe</dt>
                <dd>Laissez une ligne vide.</dd>
              </div>
            </dl>
          </div>

          <button type="submit" disabled={saving} className="btn-primary justify-center">
            <Save size={18} aria-hidden /> {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </aside>
      </div>
    </form>
  );
}

function GooglePreview({ title, slug, description }: { title: string; slug: string; description: string }) {
  const desc = description.replace(/\s+/g, ' ').trim();
  return (
    <div className="rounded-xl border-2 border-[#EEECF5] bg-white p-4 font-sans">
      <p className="text-xs font-semibold text-[var(--ink-2)]">Aperçu dans Google</p>
      <p className="mt-2 truncate text-[13px] text-[#4D5156]">association-indigo.fr › articles › {slug || '…'}</p>
      <p className="truncate text-lg text-[#1A0DAB]">{title || 'Titre de l’article'} | Association Indigo</p>
      <p className="line-clamp-2 text-sm text-[#4D5156]">{desc.length > 158 ? `${desc.slice(0, 155)}…` : desc || 'Résumé de l’article…'}</p>
    </div>
  );
}

/* ------------------------------ Rendez-vous ------------------------------ */

function EventsTab({ events, loaded, reload, notify }: { events: Event[]; loaded: boolean; reload: () => Promise<void>; notify: (n: Notice) => void }) {
  const [editing, setEditing] = useState<Event | 'new' | null>(null);
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.event_date) >= now).sort((a, b) => +new Date(a.event_date) - +new Date(b.event_date));
  const past = events.filter((e) => new Date(e.event_date) < now);

  async function remove(ev: Event) {
    if (!window.confirm(`Supprimer définitivement « ${ev.title} » ?`)) return;
    const { error } = await supabase.from('events').delete().eq('id', ev.id);
    if (error) notify({ kind: 'error', text: `Suppression impossible : ${error.message}` });
    else {
      notify({ kind: 'ok', text: 'Rendez-vous supprimé.' });
      reload();
    }
  }

  if (editing)
    return (
      <EventEditor
        event={editing === 'new' ? null : editing}
        onClose={() => setEditing(null)}
        onSaved={async (text) => {
          notify({ kind: 'ok', text });
          setEditing(null);
          await reload();
        }}
        notify={notify}
      />
    );

  const Row = ({ ev }: { ev: Event }) => {
    const d = new Date(ev.event_date);
    return (
      <li className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl text-center leading-none" style={{ backgroundColor: PAPER.saumon }}>
          <span>
            <span className="display block text-2xl font-extrabold">{d.getDate()}</span>
            <span className="block text-xs font-extrabold uppercase">{d.toLocaleDateString('fr-FR', { month: 'short' })}</span>
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-extrabold">{ev.title}</p>
          <p className="mt-1 flex flex-wrap gap-x-3 text-sm font-semibold text-[var(--ink-2)]">
            <span className="capitalize">{frDate(ev.event_date, true)}</span>
            {ev.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} aria-hidden /> {ev.location}
              </span>
            )}
          </p>
        </div>
        <StatusPill published={ev.published} />
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setEditing(ev)} className="icon-btn" aria-label={`Modifier « ${ev.title} »`} title="Modifier">
            <Pencil size={18} aria-hidden />
          </button>
          <button type="button" onClick={() => remove(ev)} className="icon-btn text-[#9A3A22] hover:bg-[#FDE8E2]" aria-label={`Supprimer « ${ev.title} »`} title="Supprimer">
            <Trash2 size={18} aria-hidden />
          </button>
        </div>
      </li>
    );
  };

  return (
    <>
      <TabTitle
        title="Rendez-vous"
        intro="Groupes de parole, ateliers, conférences. Ils s'affichent sur la page Rendez-vous et sur l'accueil."
        action={
          <button type="button" onClick={() => setEditing('new')} className="btn-primary">
            <Plus size={18} aria-hidden /> Nouveau rendez-vous
          </button>
        }
      />
      {!loaded ? (
        <div className="h-64 animate-pulse rounded-2xl bg-white/70" />
      ) : (
        <div className="grid gap-10">
          <section>
            <h2 className="mb-3 text-xl font-extrabold">À venir</h2>
            {upcoming.length ? (
              <ul className="paper divide-y-2 divide-[#EEECF5] bg-white">{upcoming.map((ev) => <Row key={ev.id} ev={ev} />)}</ul>
            ) : (
              <p className="paper bg-white p-8 text-center font-semibold text-[var(--ink-2)]">
                Aucun rendez-vous à venir. La page du site invite alors les parents à suivre le groupe Facebook.
              </p>
            )}
          </section>
          {past.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-extrabold">Passés</h2>
              <ul className="paper divide-y-2 divide-[#EEECF5] bg-white opacity-90">{past.map((ev) => <Row key={ev.id} ev={ev} />)}</ul>
            </section>
          )}
        </div>
      )}
    </>
  );
}

function EventEditor({
  event, onClose, onSaved, notify,
}: { event: Event | null; onClose: () => void; onSaved: (msg: string) => void; notify: (n: Notice) => void }) {
  const [form, setForm] = useState(() =>
    event
      ? { title: event.title || '', description: event.description || '', image_url: event.image_url || '', event_date: event.event_date || '', location: event.location || '', registration_link: event.registration_link || '', published: !!event.published }
      : EMPTY_EVENT,
  );
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  useEffect(() => window.scrollTo({ top: 0 }), []);

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = event ? await supabase.from('events').update(form).eq('id', event.id) : await supabase.from('events').insert([form]);
    setSaving(false);
    if (error) notify({ kind: 'error', text: `Enregistrement impossible : ${error.message}` });
    else onSaved(form.published ? 'Rendez-vous enregistré et publié.' : 'Rendez-vous enregistré (non publié).');
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl">
      <button type="button" onClick={onClose} className="mb-6 inline-flex items-center gap-1.5 font-extrabold underline">
        <ArrowLeft size={16} aria-hidden /> Tous les rendez-vous
      </button>
      <Sheet title={event ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'} paper={PAPER.saumon}>
        <Field label="Titre">
          <input value={form.title} onChange={(e) => set('title', e.target.value)} className="input text-lg font-bold" required placeholder="Ex. : Groupe de parole des parents" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Date et heure">
            <input
              type="datetime-local"
              value={toLocalInput(form.event_date)}
              onChange={(e) => set('event_date', e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="input"
              required
            />
          </Field>
          <Field label="Lieu">
            <input value={form.location} onChange={(e) => set('location', e.target.value)} className="input" placeholder="Ex. : Salle la Verrière, Préseau" />
          </Field>
        </div>
        <Field label="Description" hint="Pour qui, ce qu'on y fait, comment s'inscrire.">
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={6} className="input leading-relaxed" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Image" hint="Lien de l'image (https://…)">
            <input value={form.image_url} onChange={(e) => set('image_url', e.target.value)} className="input" placeholder="https://" />
          </Field>
          <Field label="Lien d'inscription" hint="HelloAsso, formulaire… (facultatif)">
            <input value={form.registration_link} onChange={(e) => set('registration_link', e.target.value)} className="input" placeholder="https://" />
          </Field>
        </div>
        {form.image_url && <img src={form.image_url} alt="Aperçu" className="h-28 w-auto rounded-lg border-2 border-[#EEECF5] object-cover" />}
        <label className="flex cursor-pointer items-center gap-3 font-extrabold">
          <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="h-5 w-5 accent-[#3F49A6]" />
          Publier sur le site
        </label>
      </Sheet>
      <div className="mt-6 flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary">
          <Save size={18} aria-hidden /> {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------ Petites pièces ------------------------------ */

function TabTitle({ title, intro, action }: { title: string; intro: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[clamp(1.9rem,3.5vw,2.6rem)] font-extrabold leading-tight">{title}</h1>
        <p className="mt-1 max-w-2xl font-semibold text-[var(--ink-2)]">{intro}</p>
      </div>
      {action}
    </div>
  );
}

function Sheet({ title, paper, children }: { title: string; paper: string; children: ReactNode }) {
  return (
    <section className="paper relative bg-white px-5 pb-6 pt-7 sm:px-7">
      <span aria-hidden className="absolute inset-x-0 top-0 h-2" style={{ backgroundColor: paper }} />
      <h2 className="mb-5 text-xl font-extrabold">{title}</h2>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block font-extrabold">{label}</span>
      {hint && <span className="mb-2 block text-sm font-semibold text-[var(--ink-2)]">{hint}</span>}
      <span className={hint ? '' : 'mt-2 block'}>{children}</span>
    </label>
  );
}

function StatusPill({ published }: { published: boolean }) {
  return published ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDF2DF] px-3 py-1 text-sm font-extrabold text-[#2E6B3C]">
      <CheckCircle2 size={15} aria-hidden /> Publié
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEECF5] px-3 py-1 text-sm font-extrabold text-[var(--ink-2)]">
      <CircleDashed size={15} aria-hidden /> Brouillon
    </span>
  );
}

function AdminStyles() {
  return (
    <style>{`
      .atelier .input { width:100%; border:2px solid #D9D6E8; border-radius:.75rem; background:#fff; padding:.7rem 1rem; font-weight:600; color:var(--ink); outline:none; transition:border-color .15s; }
      .atelier .input:focus { border-color:var(--act); }
      .atelier .input::placeholder { color:#8F8CAB; font-weight:500; }
      .atelier .btn-primary { display:inline-flex; align-items:center; gap:.5rem; border-radius:999px; background:var(--ink); color:#fff; padding:.8rem 1.4rem; font-weight:800; transition:background-color .15s; }
      .atelier .btn-primary:hover { background:var(--act); }
      .atelier .btn-primary:disabled { opacity:.6; cursor:wait; }
      .atelier .icon-btn { display:inline-grid; place-items:center; height:2.5rem; width:2.5rem; border-radius:999px; transition:background-color .15s; }
      .atelier .icon-btn:hover { background:var(--mat); }
    `}</style>
  );
}
