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
          .gte('event_date', new Date().toISOString()) 
          .order('event_date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error('Erreur chargement événements:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-28 pb-20 md:pb-28 rounded-b-[3rem] overflow-hidden shadow-xl mb-12">
        
        {/* Image de fond */}
        <div className="absolute inset-0 z-0">
            <img 
                src="/indigocolor.webp" 
                alt="Rencontres et Partage" 
                className="w-full h-full object-cover opacity-90"
            />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            
            {/* Badge en verre givré */}
            <span className="inline-block py-1.5 px-5 rounded-full bg-white/40 backdrop-blur-md text-indigo-900 font-bold text-xs md:text-sm mb-6 uppercase tracking-widest border border-white/50 shadow-md">
                Agenda de l'association
            </span>
            
            {/* Titre foncé avec halo blanc */}
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-indigo-950 mb-6 drop-shadow-[0_2px_15px_rgba(255,255,255,0.8)]">
              Rencontres & Partage
            </h1>
            
            <p className="font-body text-lg md:text-xl text-indigo-950/90 font-bold max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_10px_rgba(255,255,255,0.9)]">
              Cafés des parents, groupes de parole, conférences... Ne restez plus seuls.
            </p>
        </div>
      </section>

      {/* --- GRILLE DES ÉVÉNEMENTS --- */}
      <div className="container mx-auto px-4">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const { day, month, time } = formatDateDetails(event.event_date);
              
              return (
                <div
                  key={event.id}
                  className="group bg-white rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-nature-primary/10 transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-2"
                >
                  <div className="h-48 relative overflow-hidden">
                    {event.image_url ? (
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-nature-primary to-emerald-600 flex items-center justify-center"><Calendar size={48} className="text-white/30" /></div>
                    )}
                    
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-2 text-center min-w-[70px] shadow-lg border border-white/50">
                      <span className="block font-heading font-bold text-2xl text-nature-primary leading-none">{day}</span>
                      <span className="block text-xs font-bold text-dark-text uppercase mt-1">{month}</span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-peach-primary font-bold text-sm mb-3"><Clock size={16} /><span>{time}</span></div>
                    <h3 className="font-heading font-bold text-2xl text-dark-text mb-4 leading-tight group-hover:text-nature-primary transition-colors">{event.title}</h3>
                    {event.location && (
                      <div className="flex items-start gap-3 text-dark-text/70 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <MapPin size={18} className="flex-shrink-0 mt-0.5 text-nature-primary" />
                        <span className="font-body text-sm leading-snug">{event.location}</span>
                      </div>
                    )}
                    <p className="font-body text-dark-text/70 mb-6 line-clamp-3 text-sm flex-grow">{event.description}</p>
                    {event.registration_link ? (
                      <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="mt-auto w-full inline-flex justify-center items-center gap-2 px-6 py-4 bg-nature-primary text-white font-heading font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-md">Je m'inscris <ExternalLink size={18} /></a>
                    ) : (
                       <div className="mt-auto w-full text-center py-4 bg-gray-100 text-gray-400 font-heading font-bold rounded-xl cursor-not-allowed text-sm">Entrée libre</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto text-center py-20">
             <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-100 relative">
                <div className="inline-flex p-6 rounded-full bg-peach-primary/10 text-peach-primary mb-6"><Calendar size={48} /></div>
                <h3 className="font-heading font-bold text-2xl text-dark-text mb-4">Aucun événement à venir</h3>
                <p className="font-body text-lg text-dark-text/70 mb-8">Rejoignez notre groupe Facebook pour les actus !</p>
                <a href="https://www.facebook.com/groups/467126453152213" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1877F2] text-white font-bold rounded-full hover:bg-[#166FE5] shadow-lg"><Users size={20} /> Facebook</a>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}