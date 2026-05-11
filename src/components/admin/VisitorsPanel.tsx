import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Eye, TrendingUp, Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

type Period = 7 | 30 | 90;

interface PageView {
  path: string;
  visitor_id: string;
  created_at: string;
}

export default function VisitorsPanel() {
  const [period, setPeriod] = useState<Period>(7);
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchViews() {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - period);
      const { data, error } = await supabase
        .from('page_views')
        .select('path, visitor_id, created_at')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: true });
      if (error) {
        console.error('[analytics] fetch error:', error);
        setViews([]);
      } else {
        setViews(data || []);
      }
      setLoading(false);
    }
    fetchViews();
  }, [period]);

  // Calculs dérivés
  const stats = useMemo(() => {
    const totalViews = views.length;
    const uniqueVisitors = new Set(views.map((v) => v.visitor_id)).size;

    // Vues par jour
    const dailyMap = new Map<string, { date: string; views: number; visitors: Set<string> }>();
    for (let i = period - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyMap.set(key, { date: key, views: 0, visitors: new Set() });
    }
    for (const v of views) {
      const key = v.created_at.slice(0, 10);
      const entry = dailyMap.get(key);
      if (entry) {
        entry.views++;
        entry.visitors.add(v.visitor_id);
      }
    }
    const daily = Array.from(dailyMap.values()).map((d) => ({
      date: d.date,
      label: new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      views: d.views,
      visitors: d.visitors.size,
    }));

    // Top 10 pages
    const pathCount = new Map<string, { views: number; visitors: Set<string> }>();
    for (const v of views) {
      const entry = pathCount.get(v.path) || { views: 0, visitors: new Set() };
      entry.views++;
      entry.visitors.add(v.visitor_id);
      pathCount.set(v.path, entry);
    }
    const topPages = Array.from(pathCount.entries())
      .map(([path, { views, visitors }]) => ({ path, views, visitors: visitors.size }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Tendance vs période précédente (approximation : on prend la moitié récente vs moitié ancienne)
    const mid = Math.floor(daily.length / 2);
    const recentViews = daily.slice(mid).reduce((s, d) => s + d.views, 0);
    const oldViews = daily.slice(0, mid).reduce((s, d) => s + d.views, 0);
    const trend = oldViews === 0 ? 0 : Math.round(((recentViews - oldViews) / oldViews) * 100);

    return { totalViews, uniqueVisitors, daily, topPages, trend };
  }, [views, period]);

  return (
    <div className="space-y-6">
      {/* Sélecteur de période */}
      <div className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-100 w-fit">
        <Calendar size={18} className="text-gray-400 ml-2" />
        {([7, 30, 90] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              period === p
                ? 'bg-indigo-primary text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {p} jours
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard
              icon={<Eye size={24} />}
              label="Pages vues"
              value={stats.totalViews.toLocaleString('fr-FR')}
              color="indigo"
            />
            <KpiCard
              icon={<Users size={24} />}
              label="Visiteurs uniques"
              value={stats.uniqueVisitors.toLocaleString('fr-FR')}
              color="peach"
            />
            <KpiCard
              icon={<TrendingUp size={24} />}
              label="Tendance"
              value={`${stats.trend > 0 ? '+' : ''}${stats.trend}%`}
              color={stats.trend >= 0 ? 'nature' : 'red'}
              hint="recent vs début période"
            />
          </div>

          {/* Graphique */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-heading font-bold text-lg text-dark-text mb-4">
              Évolution des visites
            </h3>
            {stats.totalViews === 0 ? (
              <div className="text-center py-12 text-gray-400 italic">
                Aucune donnée pour cette période.
              </div>
            ) : (
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={stats.daily} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      }}
                      formatter={(value, name) => [
                        value as number,
                        name === 'views' ? 'Pages vues' : 'Visiteurs',
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#7689DE"
                      strokeWidth={3}
                      dot={{ fill: '#7689DE', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke="#F8A88A"
                      strokeWidth={3}
                      dot={{ fill: '#F8A88A', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-primary"></span>
                    <span className="text-dark-text/70">Pages vues</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-peach-primary"></span>
                    <span className="text-dark-text/70">Visiteurs uniques</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Top pages */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-heading font-bold text-lg text-dark-text mb-4">
              Pages les plus visitées
            </h3>
            {stats.topPages.length === 0 ? (
              <div className="text-center py-8 text-gray-400 italic">
                Aucune donnée pour cette période.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-xs uppercase text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="p-3 w-12">#</th>
                      <th className="p-3">Page</th>
                      <th className="p-3 text-right">Vues</th>
                      <th className="p-3 text-right">Visiteurs uniques</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.topPages.map((page, i) => {
                      const maxViews = stats.topPages[0].views;
                      const barPct = (page.views / maxViews) * 100;
                      return (
                        <tr key={page.path} className="hover:bg-gray-50">
                          <td className="p-3 text-gray-400 font-bold">{i + 1}</td>
                          <td className="p-3 max-w-md">
                            <div className="font-bold text-dark-text truncate">
                              {page.path === '/' ? 'Accueil' : page.path}
                            </div>
                            <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-primary rounded-full transition-all"
                                style={{ width: `${barPct}%` }}
                              />
                            </div>
                          </td>
                          <td className="p-3 text-right font-bold text-indigo-primary">
                            {page.views}
                          </td>
                          <td className="p-3 text-right text-gray-500">
                            {page.visitors}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  color,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'indigo' | 'peach' | 'nature' | 'red';
  hint?: string;
}) {
  const colorClasses = {
    indigo: 'bg-indigo-primary/10 text-indigo-primary',
    peach: 'bg-peach-primary/10 text-peach-primary',
    nature: 'bg-nature-primary/10 text-nature-primary',
    red: 'bg-red-50 text-red-500',
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">{label}</span>
        <div className={`p-2 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      </div>
      <div className="font-heading font-bold text-3xl text-dark-text">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}
