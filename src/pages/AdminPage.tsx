import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase, Article, Event } from '../lib/supabase';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

type Tab = 'articles' | 'events';

export default function AdminPage() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('articles');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [articleForm, setArticleForm] = useState({
    title: '',
    subtitle: '',
    category: 'Troubles',
    image_url: '',
    poster_image_url: '',
    paragraph_1: '',
    image_2_url: '',
    cta_text: '',
    cta_link: '',
    published: false,
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    image_url: '',
    event_date: '',
    location: '',
    registration_link: '',
    published: false,
  });

  useEffect(() => {
    if (user) {
      fetchArticles();
      fetchEvents();
    }
  }, [user]);

  async function fetchArticles() {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    setArticles(data || []);
  }

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    setEvents(data || []);
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const { error } = await signIn(email, password);
    if (error) {
      setLoginError('Identifiants incorrects');
    }
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setArticleForm({
      title: article.title,
      subtitle: article.subtitle,
      category: article.category,
      image_url: article.image_url || '',
      poster_image_url: article.poster_image_url,
      paragraph_1: article.paragraph_1,
      image_2_url: article.image_2_url || '',
      cta_text: article.cta_text || '',
      cta_link: article.cta_link || '',
      published: article.published,
    });
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      image_url: event.image_url || '',
      event_date: event.event_date.slice(0, 16),
      location: event.location || '',
      registration_link: event.registration_link || '',
      published: event.published,
    });
  };

  const handleSaveArticle = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;

    const { error } = await supabase
      .from('articles')
      .update(articleForm)
      .eq('id', selectedArticle.id);

    if (!error) {
      fetchArticles();
      alert('Article mis à jour avec succès');
    } else {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleSaveEvent = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedEvent) {
      const { error } = await supabase
        .from('events')
        .update(eventForm)
        .eq('id', selectedEvent.id);

      if (!error) {
        fetchEvents();
        alert('Événement mis à jour avec succès');
      }
    } else {
      const { error } = await supabase
        .from('events')
        .insert([eventForm]);

      if (!error) {
        fetchEvents();
        setEventForm({
          title: '',
          description: '',
          image_url: '',
          event_date: '',
          location: '',
          registration_link: '',
          published: false,
        });
        alert('Événement créé avec succès');
      }
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet événement ?')) return;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchEvents();
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
    }
  };

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setEventForm({
      title: '',
      description: '',
      image_url: '',
      event_date: '',
      location: '',
      registration_link: '',
      published: false,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 className="font-heading font-bold text-3xl text-dark-text mb-6 text-center">
            Panneau d'administration
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-body text-dark-text mb-2 font-semibold">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block font-body text-dark-text mb-2 font-semibold">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:border-transparent"
                required
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-indigo-primary text-white font-body font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-heading font-bold text-4xl text-dark-text">
            Panneau d'administration
          </h1>
          <button
            onClick={() => signOut()}
            className="px-6 py-2 bg-red-500 text-white font-body rounded-full hover:bg-red-600 transition-all"
          >
            Déconnexion
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 font-body font-semibold rounded-full transition-all ${
              activeTab === 'articles'
                ? 'bg-indigo-primary text-white'
                : 'bg-white text-dark-text hover:bg-gray-100'
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-body font-semibold rounded-full transition-all ${
              activeTab === 'events'
                ? 'bg-indigo-primary text-white'
                : 'bg-white text-dark-text hover:bg-gray-100'
            }`}
          >
            Événements
          </button>
        </div>

        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-heading font-semibold text-2xl text-dark-text mb-4">
                Articles existants
              </h2>
              <div className="space-y-2">
                {articles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSelectArticle(article)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedArticle?.id === article.id
                        ? 'bg-indigo-primary text-white'
                        : 'bg-gray-100 text-dark-text hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-semibold">{article.title}</div>
                    <div className="text-sm opacity-80">
                      {article.published ? '✓ Publié' : '○ Brouillon'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              {selectedArticle ? (
                <>
                  <h2 className="font-heading font-semibold text-2xl text-dark-text mb-6">
                    Modifier l'article
                  </h2>
                  <form onSubmit={handleSaveArticle} className="space-y-6">
                    <div>
                      <label className="block font-body text-dark-text mb-2 font-semibold">
                        Titre
                      </label>
                      <input
                        type="text"
                        value={articleForm.title}
                        onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-body text-dark-text mb-2 font-semibold">
                        Sous-titre
                      </label>
                      <input
                        type="text"
                        value={articleForm.subtitle}
                        onChange={(e) => setArticleForm({ ...articleForm, subtitle: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-body text-dark-text mb-2 font-semibold">
                        Image hero (URL) - pour la page d'accueil et la liste
                      </label>
                      <input
                        type="url"
                        value={articleForm.image_url}
                        onChange={(e) => setArticleForm({ ...articleForm, image_url: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                        placeholder="https://example.com/hero-image.jpg"
                      />
                    </div>

                    <div>
                      <label className="block font-body text-dark-text mb-2 font-semibold">
                        Image d'affiche (URL) - pour la page détail
                      </label>
                      <input
                        type="url"
                        value={articleForm.poster_image_url}
                        onChange={(e) => setArticleForm({ ...articleForm, poster_image_url: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <label className="block font-body text-dark-text mb-2 font-semibold">
                        Paragraphe 1
                      </label>
                      <textarea
                        rows={8}
                        value={articleForm.paragraph_1}
                        onChange={(e) => setArticleForm({ ...articleForm, paragraph_1: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-body text-dark-text mb-2 font-semibold">
                        Image 2 (URL)
                      </label>
                      <input
                        type="url"
                        value={articleForm.image_2_url}
                        onChange={(e) => setArticleForm({ ...articleForm, image_2_url: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                        placeholder="https://example.com/image2.jpg"
                      />
                    </div>

                    <div>
                      <label className="block font-body text-dark-text mb-2 font-semibold">
                        Texte CTA
                      </label>
                      <input
                        type="text"
                        value={articleForm.cta_text}
                        onChange={(e) => setArticleForm({ ...articleForm, cta_text: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                        placeholder="En savoir plus"
                      />
                    </div>

                    <div>
                      <label className="block font-body text-dark-text mb-2 font-semibold">
                        Lien CTA
                      </label>
                      <input
                        type="url"
                        value={articleForm.cta_link}
                        onChange={(e) => setArticleForm({ ...articleForm, cta_link: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="published"
                        checked={articleForm.published}
                        onChange={(e) => setArticleForm({ ...articleForm, published: e.target.checked })}
                        className="w-5 h-5 text-indigo-primary rounded focus:ring-2 focus:ring-indigo-primary"
                      />
                      <label htmlFor="published" className="font-body text-dark-text font-semibold">
                        Publier l'article
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-4 bg-indigo-primary text-white font-body font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      Enregistrer
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-16 text-dark-text/60">
                  Sélectionnez un article à modifier
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading font-semibold text-2xl text-dark-text">
                  Événements
                </h2>
                <button
                  onClick={handleNewEvent}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all"
                  title="Nouvel événement"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`px-4 py-3 rounded-lg transition-all ${
                      selectedEvent?.id === event.id
                        ? 'bg-indigo-primary text-white'
                        : 'bg-gray-100 text-dark-text'
                    }`}
                  >
                    <button
                      onClick={() => handleSelectEvent(event)}
                      className="w-full text-left"
                    >
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-sm opacity-80">
                        {new Date(event.event_date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm opacity-80">
                        {event.published ? '✓ Publié' : '○ Brouillon'}
                      </div>
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="mt-2 p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-heading font-semibold text-2xl text-dark-text mb-6">
                {selectedEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
              </h2>
              <form onSubmit={handleSaveEvent} className="space-y-6">
                <div>
                  <label className="block font-body text-dark-text mb-2 font-semibold">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block font-body text-dark-text mb-2 font-semibold">
                    Description
                  </label>
                  <textarea
                    rows={6}
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-body text-dark-text mb-2 font-semibold">
                    Image (URL)
                  </label>
                  <input
                    type="url"
                    value={eventForm.image_url}
                    onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block font-body text-dark-text mb-2 font-semibold">
                    Date et heure
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.event_date}
                    onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block font-body text-dark-text mb-2 font-semibold">
                    Lieu
                  </label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                    placeholder="Preseau, Nord"
                  />
                </div>

                <div>
                  <label className="block font-body text-dark-text mb-2 font-semibold">
                    Lien d'inscription
                  </label>
                  <input
                    type="url"
                    value={eventForm.registration_link}
                    onChange={(e) => setEventForm({ ...eventForm, registration_link: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                    placeholder="https://example.com/inscription"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="event-published"
                    checked={eventForm.published}
                    onChange={(e) => setEventForm({ ...eventForm, published: e.target.checked })}
                    className="w-5 h-5 text-indigo-primary rounded focus:ring-2 focus:ring-indigo-primary"
                  />
                  <label htmlFor="event-published" className="font-body text-dark-text font-semibold">
                    Publier l'événement
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-indigo-primary text-white font-body font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {selectedEvent ? 'Mettre à jour' : 'Créer'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
