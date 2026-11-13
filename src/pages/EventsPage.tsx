// Rendez-vous « L'atelier » : tickets pour les dates à venir, affiches punaisées pour les derniers ateliers.
import { useEffect, useState } from 'react';
import { MapPin, Clock, ArrowUpRight, Facebook, CalendarDays } from 'lucide-react';
import { supabase, type Event } from '../lib/supabase';
import SEO from '../components/SEO';
import { LINKS, eventDay } from '../atelier/data';
import { PageHeader, Tape, Stamp, PAPER } from '../atelier/kit';

const SEO_PROPS = {
  title: 'Ateliers, groupes de parole et cafés parents',
  description:
    "Cafés des parents, groupes de parole, ateliers créatifs... Retrouvez les prochains événements de l'Association Indigo à Preseau et dans le Valenciennois.",
  canonical: '/evenements',
};
const TICKET_PAPERS = [PAPER.beurre, PAPER.ciel, PAPER.saumon, PAPER.lilas];

export default function EventsPage() {
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const now = new Date().toISOString();
        const [up, before] = await Promise.all([
          supabase.from('events').select('*').eq('published', true).gte('event_date', now).order('event_date', { ascending: true }),
          supabase.from('events').select('*').eq('published', true).lt('event_date', now).order('event_date', { ascending: false }).limit(6),
        ]);
        if (up.error) throw up.error;
        setUpcoming(up.data || []);
        setPast(before.data || []);
      } catch (err) {
        console.error('Erreur chargement événements:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const eventsStructuredData = upcoming.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Événements Association Indigo',
        itemListElement: upcoming.map((event, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Event',
            name: event.title,
            description: event.description,
            startDate: event.event_date,
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: { '@type': 'Place', name: event.location || 'Preseau, Nord', address: 'Preseau, 59990, FR' },
            organizer: { '@type': 'Organization', name: 'Association Indigo', url: 'https://association-indigo.fr' },
            image: event.image_url || 'https://association-indigo.fr/og-image.webp',
            url: event.registration_link || 'https://association-indigo.fr/evenements',
          },
        })),
      }
    : undefined;

  return (
    <div>
      <SEO {...SEO_PROPS} structuredData={eventsStructuredData} />

      <PageHeader
        title="Les rendez-vous de l'association"
        paper={PAPER.beurre}
        intro={
          <>
            Groupes de parole pour les parents, ateliers pour les enfants, conférences : on se retrouve le plus souvent
            <strong className="text-[var(--ink)]"> salle la Verrière, à Préseau</strong>. Pas besoin de diagnostic pour venir.
          </>
        }
      />

      {/* À venir */}
      <section className="bg-white py-16 sm:py-20" aria-busy={loading}>
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold">Prochaines dates</h2>

          {loading ? (
            <div className="mt-8 h-40 animate-pulse bg-[var(--mat)]" />
          ) : upcoming.length ? (
            <ul className="mt-10 grid gap-8">
              {upcoming.map((e, i) => {
                const d = eventDay(e.event_date);
                return (
                  <li key={e.id} className="ticket paper grid gap-6 px-8 py-7 sm:grid-cols-[110px_1fr_auto] sm:items-center sm:px-12" style={{ backgroundColor: TICKET_PAPERS[i % 4] }}>
                    <div className="text-center sm:border-r-2 sm:border-dashed sm:border-[var(--ink)]/25 sm:pr-6">
                      <span className="block text-sm font-extrabold uppercase">{d.weekday}</span>
                      <span className="display block text-6xl font-extrabold leading-none tabular-nums">{d.day}</span>
                      <span className="block font-extrabold">{d.monthLong} {d.year}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-extrabold leading-snug">{e.title}</h3>
                      <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-bold text-[var(--ink-2)]">
                        <span className="inline-flex items-center gap-1.5"><Clock size={16} aria-hidden /> {d.time}</span>
                        {e.location && <span className="inline-flex items-center gap-1.5"><MapPin size={16} aria-hidden /> {e.location}</span>}
                      </p>
                      {e.description && <p className="mt-3 max-w-2xl font-semibold leading-relaxed text-[var(--ink-2)] whitespace-pre-line">{e.description}</p>}
                    </div>
                    {e.registration_link ? (
                      <a
                        href={e.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 font-extrabold text-white hover:bg-[var(--act)]"
                      >
                        Je m'inscris <ArrowUpRight size={18} aria-hidden />
                      </a>
                    ) : (
                      <span className="font-extrabold">Entrée libre</span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-10 grid items-center gap-10 md:grid-cols-[1fr_auto]">
              <div className="paper relative rotate-[-1deg] bg-[#FFF9E3] p-8 sm:p-10">
                <Tape color={PAPER.lilas} className="-top-3 left-12 rotate-[-6deg]" />
                <p className="display text-2xl font-extrabold">Pas de nouvelle date annoncée pour l'instant</p>
                <p className="mt-3 max-w-xl text-lg font-semibold leading-relaxed text-[var(--ink-2)]">
                  Les prochains rendez-vous sont publiés en premier sur le groupe Facebook des parents. Rejoignez-le pour être prévenu.
                </p>
                <a
                  href={LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 font-extrabold text-white hover:bg-[var(--act)]"
                >
                  <Facebook size={18} aria-hidden /> Rejoindre le groupe des parents
                </a>
              </div>
              <Stamp className="mx-auto h-40 w-40 rotate-[10deg] text-[15px]">Avec ou sans diagnostic, bienvenue</Stamp>
            </div>
          )}
        </div>
      </section>

      {/* Les derniers ateliers */}
      {past.length > 0 && (
        <section className="mat py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold">Retour sur les derniers ateliers</h2>
            <ul className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e, i) => {
                const d = eventDay(e.event_date);
                return (
                  <li key={e.id} className="paper paper-lift relative bg-white p-3 pb-5" style={{ transform: `rotate(${[-2.5, 1.5, -1, 2, -1.5, 1][i % 6]}deg)` }}>
                    <Tape color={TICKET_PAPERS[i % 4]} className="-top-3 left-1/2 -translate-x-1/2" />
                    {e.image_url && <img src={e.image_url} alt={`Affiche : ${e.title}`} loading="lazy" width={600} height={800} className="aspect-[3/4] w-full object-cover" />}
                    <h3 className="mt-4 text-xl font-bold leading-snug">{e.title}</h3>
                    <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[15px] font-bold text-[var(--ink-2)]">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} aria-hidden /> {d.weekday} {d.day} {d.monthLong} {d.year}</span>
                      {e.location && <span className="inline-flex items-center gap-1.5"><MapPin size={15} aria-hidden /> {e.location}</span>}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
