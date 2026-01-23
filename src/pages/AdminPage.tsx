import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase, Article, Event } from '../lib/supabase';
import { 
  Trash2, Edit, Plus, Save, X, LogOut, 
  LayoutDashboard, Calendar, FileText, CheckCircle, XCircle, Image as ImageIcon, Type
} from 'lucide-react';

type Tab = 'articles' | 'events';

// Générateur de Slug automatique (reste inchangé)
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default function AdminPage() {
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('articles');

  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data States
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // --- FORMULAIRE ARTICLE SIMPLIFIÉ ---
  const [articleForm, setArticleForm] = useState({
    title: '',
    subtitle: '',
    slug: '',
    category: 'TDAH / TDA',
    image_url: '',          // Image du Hero (Bandeau)
    paragraph_1: '',        // Premier bloc de texte
    poster_image_url: '',   // L'Affiche (leur délire)
    paragraph_2: '',        // Deuxième bloc de texte
    image_2_url: '',        // Image illustration finale
    cta_text: '',
    cta_link: '',
    published: false,
  });

  // Formulaire Événement
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
    if (user) fetchData();
  }, [user, activeTab]);

  async function fetchData() {
    setLoadingData(true);
    try {
      if (activeTab === 'articles') {
        const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
        setArticles(data || []);
      } else {
        const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoadingData(false);
    }
  }

  // Login handlers...
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try { await signIn(email, password); } 
    catch (error) { setLoginError('Email ou mot de passe incorrect.'); }
  };

  const handleLogout = async () => { await signOut(); navigate('/'); };

  // --- HANDLERS ARTICLES ---
  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setArticleForm({
      title: article.title,
      subtitle: article.subtitle || '',
      slug: article.slug,
      category: article.category,
      image_url: article.image_url || '',
      paragraph_1: article.paragraph_1 || '',
      poster_image_url: article.poster_image_url || '',
      paragraph_2: article.paragraph_2 || '',
      image_2_url: article.image_2_url || '',
      cta_text: article.cta_text || '',
      cta_link: article.cta_link || '',
      published: article.published,
    });
    setIsEditing(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('Supprimer cet article ?')) {
      await supabase.from('articles').delete().eq('id', id);
      fetchData();
    }
  };

  const handleSaveArticle = async (e: FormEvent) => {
    e.preventDefault();
    const slugToSave = articleForm.slug || generateSlug(articleForm.title);
    
    // On prépare l'objet à sauvegarder. 
    // Note: On n'utilise plus 'content' (HTML global), mais les champs séparés.
    const dataToSave = { ...articleForm, slug: slugToSave };

    try {
      if (selectedArticle) {
        await supabase.from('articles').update(dataToSave).eq('id', selectedArticle.id);
      } else {
        await supabase.from('articles').insert([dataToSave]);
      }
      setIsEditing(false);
      setSelectedArticle(null);
      resetArticleForm();
      fetchData();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const resetArticleForm = () => {
    setArticleForm({
      title: '', subtitle: '', slug: '', category: 'TDAH / TDA',
      image_url: '', paragraph_1: '', poster_image_url: '',
      paragraph_2: '', image_2_url: '', cta_text: '', cta_link: '',
      published: false,
    });
  };

  // --- HANDLERS EVENTS (Identique à avant) ---
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title, description: event.description || '', image_url: event.image_url || '',
      event_date: event.event_date, location: event.location || '', registration_link: event.registration_link || '',
      published: event.published,
    });
    setIsEditing(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Supprimer cet événement ?')) {
      await supabase.from('events').delete().eq('id', id);
      fetchData();
    }
  };

  const handleSaveEvent = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (selectedEvent) await supabase.from('events').update(eventForm).eq('id', selectedEvent.id);
      else await supabase.from('events').insert([eventForm]);
      setIsEditing(false);
      setSelectedEvent(null);
      setEventForm({ title: '', description: '', image_url: '', event_date: '', location: '', registration_link: '', published: false });
      fetchData();
    } catch (error) { console.error(error); }
  };

  if (!user) return ( /* Code Login identique à la version précédente */ 
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-4">
            <h1 className="text-2xl font-bold text-center text-indigo-primary">Connexion Admin</h1>
            {loginError && <p className="text-red-500 text-center">{loginError}</p>}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="w-full p-2 border rounded" />
            <button type="submit" className="w-full bg-indigo-primary text-white p-2 rounded">Se connecter</button>
        </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-body">
      {/* SIDEBAR - Identique à la version précédente */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-100 flex flex-col h-auto md:h-screen sticky top-0 z-40">
        <div className="p-6 border-b border-gray-100">
           <h2 className="font-heading font-bold text-lg text-indigo-primary">Admin Indigo</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => { setActiveTab('articles'); setIsEditing(false); }} className={`w-full text-left px-4 py-3 rounded-xl font-bold ${activeTab === 'articles' ? 'bg-indigo-primary/10 text-indigo-primary' : 'text-gray-500'}`}>Articles</button>
          <button onClick={() => { setActiveTab('events'); setIsEditing(false); }} className={`w-full text-left px-4 py-3 rounded-xl font-bold ${activeTab === 'events' ? 'bg-peach-primary/10 text-peach-primary' : 'text-gray-500'}`}>Événements</button>
        </nav>
        <div className="p-4"><button onClick={handleLogout} className="w-full px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl flex items-center gap-2"><LogOut size={20}/> Déconnexion</button></div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-dark-text capitalize">Gestion {activeTab}</h1>
            {!isEditing && (
              <button onClick={() => { 
                  activeTab === 'articles' ? resetArticleForm() : setEventForm({ title: '', description: '', image_url: '', event_date: '', location: '', registration_link: '', published: false });
                  setSelectedArticle(null); setSelectedEvent(null); setIsEditing(true); 
                }} 
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold shadow-lg ${activeTab === 'articles' ? 'bg-indigo-primary' : 'bg-peach-primary'}`}>
                <Plus size={20} /> Nouveau
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="font-heading font-bold text-xl">Édition</h2>
                 <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} className="text-gray-400" /></button>
              </div>

              {activeTab === 'articles' ? (
                /* --- FORMULAIRE ARTICLE PAS À PAS --- */
                <form onSubmit={handleSaveArticle} className="space-y-8">
                  
                  {/* BLOC 1 : L'ENTÊTE */}
                  <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-indigo-primary flex items-center gap-2"><Type size={18}/> 1. Informations Principales</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Titre de l'article</label>
                            <input type="text" value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                            <select value={articleForm.category} onChange={e => setArticleForm({...articleForm, category: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-white">
                                <option>TDAH / TDA</option><option>Troubles DYS</option><option>Phobie Scolaire</option><option>Haut Potentiel</option><option>Hypersensibilité</option><option>Autre</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Sous-titre (Accroche)</label>
                        <textarea value={articleForm.subtitle} onChange={e => setArticleForm({...articleForm, subtitle: e.target.value})} className="w-full px-4 py-2 border rounded-xl" rows={2} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Image du bandeau (Hero)</label>
                        <input type="text" value={articleForm.image_url} onChange={e => setArticleForm({...articleForm, image_url: e.target.value})} className="w-full px-4 py-2 border rounded-xl" placeholder="https://..." />
                    </div>
                  </div>

                  {/* BLOC 2 : CONTENU PRINCIPAL */}
                  <div className="space-y-4">
                     <h3 className="font-bold text-indigo-primary flex items-center gap-2"><FileText size={18}/> 2. Le Contenu</h3>
                     
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Premier Paragraphe (Intro)</label>
                        <p className="text-xs text-gray-400 mb-2">Décrivez la problématique ici.</p>
                        <textarea value={articleForm.paragraph_1} onChange={e => setArticleForm({...articleForm, paragraph_1: e.target.value})} className="w-full px-4 py-2 border rounded-xl" rows={6} />
                     </div>

                     <div className="p-4 bg-peach-primary/5 border border-peach-primary/20 rounded-xl">
                        <label className="block text-sm font-bold text-peach-primary mb-1 flex items-center gap-2"><ImageIcon size={16}/> L'Affiche (Optionnel)</label>
                        <p className="text-xs text-gray-500 mb-2">Collez ici le lien de leur affiche ou infographie.</p>
                        <input type="text" value={articleForm.poster_image_url} onChange={e => setArticleForm({...articleForm, poster_image_url: e.target.value})} className="w-full px-4 py-2 border border-peach-primary/30 rounded-xl focus:border-peach-primary" placeholder="https://..." />
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Deuxième Paragraphe (Développement)</label>
                        <p className="text-xs text-gray-400 mb-2">La suite de l'explication.</p>
                        <textarea value={articleForm.paragraph_2} onChange={e => setArticleForm({...articleForm, paragraph_2: e.target.value})} className="w-full px-4 py-2 border rounded-xl" rows={6} />
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Image d'illustration (Optionnel)</label>
                        <input type="text" value={articleForm.image_2_url} onChange={e => setArticleForm({...articleForm, image_2_url: e.target.value})} className="w-full px-4 py-2 border rounded-xl" placeholder="https://..." />
                     </div>
                  </div>

                  {/* BLOC 3 : APPEL A L'ACTION */}
                  <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-indigo-primary flex items-center gap-2">3. Bouton d'action (Bas de page)</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Texte du bouton</label>
                            <input type="text" value={articleForm.cta_text} onChange={e => setArticleForm({...articleForm, cta_text: e.target.value})} className="w-full px-4 py-2 border rounded-xl" placeholder="ex: Télécharger le guide" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Lien du bouton</label>
                            <input type="text" value={articleForm.cta_link} onChange={e => setArticleForm({...articleForm, cta_link: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <input type="checkbox" id="published" checked={articleForm.published} onChange={e => setArticleForm({...articleForm, published: e.target.checked})} className="w-5 h-5 text-indigo-primary rounded" />
                      <label htmlFor="published" className="font-bold text-dark-text cursor-pointer">Publier immédiatement</label>
                  </div>

                  <button type="submit" className="w-full py-3 bg-indigo-primary text-white font-bold rounded-xl hover:bg-indigo-primary/90 transition-all shadow-lg">Sauvegarder l'article</button>
                </form>
              ) : (
                /* FORMULAIRE EVENT (Simplifié aussi) */
                <form onSubmit={handleSaveEvent} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Titre</label>
                        <input type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                        <input type="datetime-local" value={eventForm.event_date ? new Date(eventForm.event_date).toISOString().slice(0, 16) : ''} onChange={e => setEventForm({...eventForm, event_date: new Date(e.target.value).toISOString()})} className="w-full px-4 py-2 border rounded-xl" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Lieu</label>
                        <input type="text" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl" rows={4} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                        <input type="text" value={eventForm.image_url} onChange={e => setEventForm({...eventForm, image_url: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Lien Inscription</label>
                        <input type="text" value={eventForm.registration_link} onChange={e => setEventForm({...eventForm, registration_link: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                        <input type="checkbox" id="ev-pub" checked={eventForm.published} onChange={e => setEventForm({...eventForm, published: e.target.checked})} className="w-5 h-5" />
                        <label htmlFor="ev-pub" className="font-bold">Publier</label>
                    </div>
                    <button type="submit" className="w-full py-3 bg-peach-primary text-white font-bold rounded-xl shadow-lg">Sauvegarder l'événement</button>
                </form>
              )}
            </div>
          ) : (
            /* LISTE DES ARTICLES / EVENTS (Reste propre) */
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr><th className="p-4">Titre</th><th className="p-4">Statut</th><th className="p-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {activeTab === 'articles' ? articles.map(a => (
                            <tr key={a.id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold">{a.title}</td>
                                <td className="p-4">{a.published ? <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold">Publié</span> : <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs font-bold">Brouillon</span>}</td>
                                <td className="p-4 text-right"><button onClick={() => handleEditArticle(a)} className="text-indigo-primary p-2 hover:bg-indigo-50 rounded"><Edit size={18}/></button><button onClick={() => handleDeleteArticle(a.id)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={18}/></button></td>
                            </tr>
                        )) : events.map(e => (
                             <tr key={e.id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold">{e.title}</td>
                                <td className="p-4">{e.published ? <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold">Publié</span> : <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs font-bold">Brouillon</span>}</td>
                                <td className="p-4 text-right"><button onClick={() => handleEditEvent(e)} className="text-peach-primary p-2 hover:bg-peach-50 rounded"><Edit size={18}/></button><button onClick={() => handleDeleteEvent(e.id)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={18}/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}