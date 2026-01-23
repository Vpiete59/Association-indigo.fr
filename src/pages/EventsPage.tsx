import { useEffect, useState } from 'react';
import { supabase, Event } from '../lib/supabase';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('published', true)
          .order('event_date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-primary mx-auto"></div>
          <p className="mt-4 text-dark-text">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-dark-text mb-4">
            Nos Événements
          </h1>
          <p className="font-body text-xl text-dark-text/80 max-w-2xl mx-auto">
            Découvrez tous les événements organisés par l'Association Indigo
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-dark-text/60">
              Aucun événement à venir pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {event.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-2xl text-dark-text mb-3">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-2 text-indigo-primary mb-2">
                    <Calendar size={18} />
                    <span className="font-body text-sm">
                      {formatDate(event.event_date)}
                    </span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2 text-dark-text/70 mb-4">
                      <MapPin size={18} />
                      <span className="font-body text-sm">{event.location}</span>
                    </div>
                  )}

                  <p className="font-body text-dark-text/80 mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  {event.registration_link && (
                    <a
                      href={event.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-primary text-white font-body font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
                    >
                      S'inscrire
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
