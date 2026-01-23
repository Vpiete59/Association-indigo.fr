import { useEffect, useState } from 'react';
import { supabase, Event } from '../lib/supabase';
import { Calendar, MapPin, ExternalLink, Clock, Users } from 'lucide-react';

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
          // On ne montre que les événements futurs ou d'aujourd'hui
          .gte('event_date', new Date().toISOString()) 
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

  // Fonction utilitaire pour formater la date
  const formatDateDetails = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('fr-FR', { month: 'short' }),
      fullDate: date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-primary border-t-transparent"></div>
          <p className="font-heading text-indigo-primary font-bold">Recherche des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg pb-20">
      
      {/* En-tête de page (Cohérent avec ArticlesListPage) */}
      <section className="bg-white pt-12 pb-16 rounded-b-[3rem] shadow-sm relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-peach-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-nature-primary/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-nature-primary/10 text-nature-primary font-bold text-sm mb-4 uppercase tracking-wide">
                Rencontres & Partage
            </span>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-dark-text mb-6">
              L'Agenda de l'Association
            </h1>
            <p className="font-body text-lg text-dark-text/70 max-w-2xl mx-auto">
              Retrouvez nos groupes de paroles, cafés des parents et ateliers. 
              Ces moments sont faits pour rompre l'isolement et créer du lien.
            </p>
        </div>
      </section>

      {/* Grille des événements */}
      <div className="container mx-auto px-4">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const { day, month, fullDate, time } = formatDateDetails(event.event_date);
              
              return (
                <div
                  key={event.id}
                  className="group bg-white rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1"
                >
                  {/* Image ou Dégradé par défaut */}
                  <div className="h-48 relative overflow-hidden">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-primary to-purple-400 flex items-center justify-center">
                         <Calendar size={48} className="text-white/30" />
                      </div>
                    )}
                    
                    {/* Badge Date (Style Calendrier) */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-2 text-center min-w-[60px] shadow-lg border border-white/50">
                      <span className="block font-heading font-bold text-xl text-indigo-primary leading-none">
                        {day}
                      </span>
                      <span className="block text-xs font-bold text-dark-text uppercase mt-1">
                        {month}
                      </span>
                    </div>
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-8 flex flex-col flex-grow">
                    
                    <div className="flex items-center gap-2 text-peach-primary font-bold text-sm mb-3">
                        <Clock size={16} />
                        <span>{time}</span>
                    </div>

                    <h3 className="font-heading font-bold text-2xl text-dark-text mb-4 leading-tight group-hover:text-indigo-primary transition-colors">
                      {event.title}
                    </h3>

                    {event.location && (
                      <div className="flex items-start gap-3 text-dark-text/70 mb-6 bg-gray-50 p-3 rounded-xl">
                        <MapPin size={18} className="flex-shrink-0 mt-1 text-indigo-primary" />
                        <span className="font-body text-sm leading-snug">{event.location}</span>
                      </div>
                    )}

                    <p className="font-body text-dark-text/70 mb-6 line-clamp-3 text-sm flex-grow">
                      {event.description}
                    </p>

                    {/* Bouton d'inscription */}
                    {event.registration_link ? (
                      <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-nature-primary text-white font-heading font-bold rounded-xl hover:bg-opacity-90 transition-all duration-300 shadow-md group-hover:shadow-nature-primary/30"
                      >
                        Je m'inscris
                        <ExternalLink size={18} />
                      </a>
                    ) : (
                       <div className="mt-auto w-full text-center py-3 bg-gray-100 text-gray-400 font-heading font-bold rounded-xl cursor-not-allowed text-sm">
                          Entrée libre / Sans inscription
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* État vide (Pas d'événements) */
          <div className="max-w-2xl mx-auto text-center py-20">
             <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-100">
                <div className="inline-flex p-5 rounded-full bg-peach-primary/10 text-peach-primary mb-6">
                    <Calendar size={48} />
                </div>
                <h3 className="font-heading font-bold text-2xl text-dark-text mb-4">
                    Aucun événement à venir
                </h3>
                <p className="font-body text-lg text-dark-text/70 mb-8">
                    Notre calendrier se remplit petit à petit. Pour ne rien rater, rejoignez notre groupe Facebook où nous annonçons toutes les nouveautés !
                </p>
                <a
                    href="https://www.facebook.com/groups/467126453152213"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-primary text-white font-bold rounded-full hover:bg-indigo-primary/90 transition-all shadow-lg"
                >
                    <Users size={20} />
                    Rejoindre la communauté
                </a>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}