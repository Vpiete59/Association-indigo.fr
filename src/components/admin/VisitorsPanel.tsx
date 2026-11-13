// Fréquentation du site (table page_views, visites anonymes hors /admin).
// Supabase renvoie au plus 1 000 lignes par requête : on récupère tout, page par page,
// sinon les jours récents disparaissent dès que le site dépasse 1 000 pages vues sur la période.
import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { supabase } from '../../lib/supabase';
import { PAPER } from '../../atelier/kit';

type Period = 7 | 30 | 90 | 365;
const PERIODS: { days: Period; label: string }[] = [
  { days: 7, label: '7 jours' },
  { days: 30, label: '30 jours' },
  { days: 90, label: '3 mois' },
  { days: 365, label: '1 an' },
];
const PAGE = 1000;

interface PageView {
  path: string;
  visitor_id: string;
  created_at: string;
}

// Jour local (Europe/Paris côté navigateur), pas le jour UTC
const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

async function fetchAllSince(since: Date): Promise<PageView[]> {
  const first = await supabase
    .from('page_views')
    .select('path, visitor_id, created_at', { count: 'exact' })
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true })
    .range(0, PAGE - 1);
  if (first.error) throw first.error;
  const rows = [...(first.data || [])];
  const total = first.count ?? rows.length;
  const pages: Promise<PageView[]>[] = [];
  for (let from = PAGE; from < total; from += PAGE) {
    pages.push(
      (async () => {
        const { data, error } = await supabase
        .from('page_views')
        .select('path, visitor_id, created_at')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: true })
          .range(from, from + PAGE - 1);
        if (error) throw error;
        return (data || []) as PageView[];
      })(),
    );
  }
  for (const p of await Promise.all(pages)) rows.push(...p);
  return rows;
}

function pageLabel(path: string, titles: Record<string, string>) {
  if (path === '/') return 'Accueil';
  if (titles[path]) return titles[path];
  const named: Record<string, string> = {
    '/articles': 'Bibliothèque (Comprendre)',
    '/evenements': 'Rendez-vous',
    '/faq': 'Questions fréquentes',
    '/contact': 'Contact',
    '/mentions-legales': 'Mentions légales',
    '/politique-confidentialite': 'Politique de confidentialité',
  };
  return named[path] || path;
}

export default function VisitorsPanel({ titles = {} }: { titles?: Record<string, string> }) {
  const [period, setPeriod] = useState<Period>(30);
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      // On charge aussi la période précédente, pour comparer
      const since = new Date();
      since.setHours(0, 0, 0, 0);
      since.setDate(since.getDate() - (period * 2 - 1));
      try {
        const rows = await fetchAllSince(since);
        if (!cancelled) setViews(rows);
      } catch (e) {
        const err = e as { message?: string; code?: string };
        console.error('[analytics] fetch error:', err);
        if (!cancelled) {
          setViews([]);
          setError(
            /jwt|expired|401|PGRST30/i.test(`${err.code} ${err.message}`)
              ? 'Votre session a expiré. Déconnectez-vous puis reconnectez-vous.'
              : /does not exist|PGRST205|42P01/i.test(`${err.code} ${err.message}`)
                ? "La table des visites n'existe pas dans la base. La migration « create_page_views » doit être appliquée dans Supabase."
                : `Les statistiques n'ont pas pu être chargées (${err.message || 'erreur inconnue'}).`,
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [period, reload]);

  const stats = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (period - 1));
    const current = views.filter((v) => new Date(v.created_at) >= start);
    const previous = views.filter((v) => new Date(v.created_at) < start);

    const uniq = (list: PageView[]) => new Set(list.map((v) => v.visitor_id)).size;
    const evolution = (now: number, before: number) => (before === 0 ? null : Math.round(((now - before) / before) * 100));

    // Regroupement par jour (≤ 90 jours) ou par semaine (1 an)
    const byWeek = period === 365;
    const buckets = new Map<string, { label: string; views: number; visitors: Set<string> }>();
    const step = byWeek ? 7 : 1;
    for (let i = period - 1; i >= 0; i -= step) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      buckets.set(dayKey(d), {
        label: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        views: 0,
        visitors: new Set(),
      });
    }
    const keys = [...buckets.keys()];
    for (const v of current) {
      const k = dayKey(new Date(v.created_at));
      // Semaine : on range la visite dans le dernier seau qui commence avant elle
      const target = byWeek ? [...keys].reverse().find((key) => key <= k) : k;
      const b = target ? buckets.get(target) : undefined;
      if (b) {
        b.views++;
        b.visitors.add(v.visitor_id);
      }
    }
    const series = [...buckets.values()].map((b) => ({ label: b.label, views: b.views, visitors: b.visitors.size }));

    const pages = new Map<string, { views: number; visitors: Set<string> }>();
    for (const v of current) {
      const e = pages.get(v.path) || { views: 0, visitors: new Set<string>() };
      e.views++;
      e.visitors.add(v.visitor_id);
      pages.set(v.path, e);
    }
    const topPages = [...pages.entries()]
      .map(([path, e]) => ({ path, views: e.views, visitors: e.visitors.size }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 12);

    const today = dayKey(new Date());
    const todayViews = current.filter((v) => dayKey(new Date(v.created_at)) === today);

    return {
      views: current.length,
      visitors: uniq(current),
      viewsEvo: evolution(current.length, previous.length),
      visitorsEvo: evolution(uniq(current), uniq(previous)),
      perVisitor: uniq(current) ? (current.length / uniq(current)).toFixed(1).replace('.', ',') : '0',
      todayVisitors: uniq(todayViews),
      series,
      topPages,
      byWeek,
    };
  }, [views, period]);

  const periodLabel = PERIODS.find((p) => p.days === period)!.label;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Période" className="flex flex-wrap gap-1 rounded-full bg-white p-1 paper">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              type="button"
              onClick={() => setPeriod(p.days)}
              aria-pressed={period === p.days}
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
                period === p.days ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-2)] hover:bg-[var(--mat)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setReload((n) => n + 1)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold text-[var(--ink-2)] hover:bg-white"
        >
          <RefreshCw size={16} aria-hidden className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      {error && (
        <div role="alert" className="paper flex gap-3 bg-white p-5 font-semibold" style={{ borderLeft: '6px solid #EE7A5F' }}>
          <AlertTriangle className="shrink-0 text-[#C2492F]" aria-hidden />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/70" />
          ))}
        </div>
      ) : (
        !error && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi label="Visiteurs" value={stats.visitors} evo={stats.visitorsEvo} paper={PAPER.lilas} hint={`sur ${periodLabel}`} />
              <Kpi label="Pages vues" value={stats.views} evo={stats.viewsEvo} paper={PAPER.saumon} hint={`sur ${periodLabel}`} />
              <Kpi label="Pages par visiteur" value={stats.perVisitor} paper={PAPER.beurre} hint="en moyenne" />
              <Kpi label="Visiteurs aujourd'hui" value={stats.todayVisitors} paper={PAPER.menthe} hint="depuis minuit" />
            </div>

            <section className="paper bg-white p-5 sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-extrabold">Évolution {stats.byWeek ? 'semaine par semaine' : 'jour par jour'}</h2>
                <p className="flex gap-4 text-sm font-bold text-[var(--ink-2)]">
                  <span className="inline-flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-[#5361C9]" /> Pages vues</span>
                  <span className="inline-flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-[#F4A259]" /> Visiteurs</span>
                </p>
              </div>
              {stats.views === 0 ? (
                <p className="py-14 text-center font-semibold text-[var(--ink-2)]">Aucune visite enregistrée sur cette période.</p>
              ) : (
                <div className="mt-5 h-72">
                  <ResponsiveContainer>
                    <BarChart data={stats.series} margin={{ top: 4, right: 4, left: -18, bottom: 0 }} barGap={2}>
                      <CartesianGrid vertical={false} stroke="#E8E6F2" />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#4B4873' }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={18} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#4B4873' }} tickLine={false} axisLine={false} />
                      <Tooltip
                        cursor={{ fill: 'rgba(83,97,201,.08)' }}
                        contentStyle={{ borderRadius: 12, border: '2px solid #2A284E', fontWeight: 700 }}
                        formatter={(value, name) => [value as number, name === 'views' ? 'Pages vues' : 'Visiteurs']}
                      />
                      <Bar dataKey="views" fill="#5361C9" radius={[4, 4, 0, 0]} maxBarSize={28} />
                      <Bar dataKey="visitors" fill="#F4A259" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className="paper bg-white p-5 sm:p-7">
              <h2 className="text-xl font-extrabold">Pages les plus lues</h2>
              {stats.topPages.length === 0 ? (
                <p className="py-8 text-center font-semibold text-[var(--ink-2)]">Rien pour l'instant.</p>
              ) : (
                <ol className="mt-4 grid gap-3">
                  {stats.topPages.map((p) => (
                    <li key={p.path} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5">
                      <a href={p.path} target="_blank" rel="noopener noreferrer" className="truncate font-bold hover:underline" title={p.path}>
                        {pageLabel(p.path, titles)}
                      </a>
                      <span className="text-right text-sm font-extrabold tabular-nums">
                        {p.views} <span className="font-semibold text-[var(--ink-2)]">vues · {p.visitors} visiteurs</span>
                      </span>
                      <span className="col-span-2 h-2 overflow-hidden rounded-full bg-[#EEF0FB]">
                        <span className="block h-full rounded-full bg-[#5361C9]" style={{ width: `${(p.views / stats.topPages[0].views) * 100}%` }} />
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <p className="text-sm font-semibold text-[var(--ink-2)]">
              Comptage anonyme et sans cookie : un visiteur = un navigateur. Les robots (Google, Facebook…) et vos passages dans l'espace bénévoles ne sont pas comptés.
            </p>
          </>
        )
      )}
    </div>
  );
}

function Kpi({ label, value, evo, paper, hint }: { label: string; value: number | string; evo?: number | null; paper: string; hint: string }) {
  return (
    <div className="paper relative overflow-hidden bg-white p-5">
      <span aria-hidden className="absolute inset-x-0 top-0 h-2" style={{ backgroundColor: paper }} />
      <p className="text-sm font-extrabold text-[var(--ink-2)]">{label}</p>
      <p className="display mt-1 text-4xl font-extrabold tabular-nums">{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--ink-2)]">
        {hint}
        {evo !== undefined && evo !== null && (
          <span className={`ml-2 font-extrabold ${evo >= 0 ? 'text-[#2E7D4F]' : 'text-[#C2492F]'}`}>
            {evo > 0 ? '+' : ''}
            {evo} % vs période précédente
          </span>
        )}
      </p>
    </div>
  );
}
