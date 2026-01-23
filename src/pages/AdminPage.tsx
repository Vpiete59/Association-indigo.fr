import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase, Article, Event } from '../lib/supabase';
import { 
  Trash2, Edit, Plus, Save, X, LogOut, 
  LayoutDashboard, Calendar, FileText, CheckCircle, XCircle, 
  Image as ImageIcon, Type, Search
} from 'lucide-react';

type Tab = 'articles' | 'events';

// Générateur de Slug automatique (titre -> url)
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

// Fonction pour sécuriser le format de date pour l'input
const formatDateForInput = (dateString: string) => {
  try {
      if (!dateString) return '';
      return new Date(dateString).toISOString().slice(0, 16);
  } catch (e) {
      return '';
  }
};

export default function AdminPage() {
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('articles');

  // --- ÉTATS DE CONNEXION ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- ÉTATS DES DONNÉES ---
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // --- ÉTATS D'ÉDITION ---
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // --- FORMULAIRE ARTICLE COMPLET ---
  const [articleForm, setArticleForm] = useState({
    title: '',
    subtitle: '',
    slug: '',
    category: 'TDAH / TDA',
    image_url: '',          // Image du bandeau (Hero)
    paragraph_1: '',        // Intro
    poster_image_url: '',   // Affiche
    paragraph_2: '',        // Suite du texte
    image_2_url: '',        // Image illustration
    cta_text: '',           // Bouton bas de page
    cta_link: '',
    meta_description: '',   // SEO Google
    meta_keywords: '',      // SEO Mots-clés
    published: false,
  });

  // --- FORMULAIRE ÉVÉNEMENT ---
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    image_url: '',
    event_date: '',
    location: '',
    registration_link: '',
    published: false,
  });

  // Chargement des données au démarrage
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

  // --- GESTION LOGIN / LOGOUT ---
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try { await signIn(email, password); } 
    catch (error) { setLoginError('Email ou mot de passe incorrect.'); }
  };

  const handleLogout = async () => { await signOut(); navigate('/'); };

  // --- GESTION DES ARTICLES ---
  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setArticleForm({
      title: article.title || '',
      subtitle: article.subtitle || '',
      slug: article.slug || '',
      category: article.category || 'TDAH / TDA',
      image_url: article.image_url || '',
      paragraph_1: article.paragraph_1 || '',
      poster_image_url: article.poster_image_url || '',
      paragraph_2: article.paragraph_2 || '',
      image_2_url: article.image_2_url || '',
      cta_text: article.cta_text || '',
      cta_link: article.cta_link || '',
      meta_description: article.meta_description || '',
      meta_keywords: article.meta_keywords || '',
      published: article.published || false,
    });
    setIsEditing(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      await supabase.from('articles').delete().eq('id', id);
      fetchData();
    }
  };

  const handleSaveArticle = async (e: FormEvent) => {
    e.preventDefault();
    // Génération du slug si vide
    const slugToSave = articleForm.slug || generateSlug(articleForm.title);
    
    // On prépare l'objet complet
    const dataToSave = { ...articleForm, slug: slugToSave };

    try {
      if (selectedArticle) {
        const { error } = await supabase.from('articles').update(dataToSave).eq('id', selectedArticle.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('articles').insert([dataToSave]);
        if (error) throw error;
      }
      setIsEditing(false);
      setSelectedArticle(null);
      resetArticleForm();
      fetchData();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert("Erreur lors de la sauvegarde. Vérifiez que le titre est unique.");
    }
  };

  const resetArticleForm = () => {
    setArticleForm({
      title: '', subtitle: '', slug: '', category: 'TDAH / TDA',
      image_url: '', paragraph_1: '', poster_image_url: '',
      paragraph_2: '', image_2_url: '', cta_text: '', cta_link: '',
      meta_description: '', meta_keywords: '',
      published: false,
    });
  };

  // --- GESTION DES ÉVÉNEMENTS ---
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      image_url: event.image_url || '',
      event_date: event.event_date || '',
      location: event.location || '',
      registration_link: event.registration_link || '',
      published: event.published || false,
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
    } catch (error) { 
        console.error(error); 
        alert("Erreur lors de la sauvegarde de l'événement.");
    }
  };


  // --- ÉCRAN DE CONNEXION ---
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-primary via-white to-peach-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/50">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-indigo-primary mb-2">Espace Admin</h1>
            <p className="text-gray-500">Connectez-vous pour gérer le site</p>
          </div>
          {loginError && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center font-bold">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-primary focus:ring-2 focus:ring-indigo-primary/20 outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-primary focus:ring-2 focus:ring-indigo-primary/20 outline-none transition-all" required />
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-primary text-white font-bold rounded-xl hover:bg-indigo-primary/90 transition-transform active:scale-95 shadow-lg shadow-indigo-primary/30">
              Se connecter
            </button>
          </form>
        </div>
    </div>
  );

  // --- INTERFACE D'ADMINISTRATION ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-body">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-100 flex flex-col h-auto md:h-screen sticky top-0 z-40">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-primary text-white rounded-lg flex items-center justify-center">
            <LayoutDashboard size={20} />
          </div>
          <h2 className="font-heading font-bold text-lg text-dark-text">Admin Indigo</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => { setActiveTab('articles'); setIsEditing(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'articles' ? 'bg-indigo-primary/10 text-indigo-primary' : 'text-gray-500 hover:bg-gray-50'}`}>
            <FileText size={20} /> Articles
          </button>
          <button onClick={() => { setActiveTab('events'); setIsEditing(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'events' ? 'bg-peach-primary/10 text-peach-primary' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Calendar size={20} /> Événements
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-bold hover:bg-red-50 transition-all">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* ZONE PRINCIPALE */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="font-heading font-bold text-3xl text-dark-text capitalize">
                Gestion des {activeTab === 'articles' ? 'Articles' : 'Événements'}
              </h1>
              <p className="text-gray-500">
                {activeTab === 'articles' ? `${articles.length} articles publiés` : `${events.length} événements à venir`}
              </p>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => {
                  activeTab === 'articles' ? resetArticleForm() : setEventForm({ title: '', description: '', image_url: '', event_date: '', location: '', registration_link: '', published: false });
                  setSelectedArticle(null); setSelectedEvent(null); setIsEditing(true);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold shadow-lg transition-transform hover:-translate-y-1 ${activeTab === 'articles' ? 'bg-indigo-primary' : 'bg-peach-primary'}`}
              >
                <Plus size={20} /> Ajouter
              </button>
            )}
          </div>

          {loadingData ? (
             <div className="flex justify-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-primary border-t-transparent"></div>
             </div>
          ) : isEditing ? (
            
            /* --- ZONE D'ÉDITION --- */
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="font-heading font-bold text-xl text-dark-text">
                    {selectedArticle || selectedEvent ? 'Modifier' : 'Créer un nouveau'}
                 </h2>
                 <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} className="text-gray-400" />
                 </button>
              </div>

              {activeTab === 'articles' ? (
                /* ================= FORMULAIRE ARTICLE ================= */
                <form onSubmit={handleSaveArticle} className="space-y-8">
                  
                  {/* BLOC 1 : INFORMATIONS GÉNÉRALES */}
                  <div className="space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-indigo-primary flex items-center gap-2"><Type size={18}/> 1. Informations Principales</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Titre de l'article</label>
                            <input type="text" value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-indigo-primary focus:ring-2 focus:ring-indigo-primary/20 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                            <select value={articleForm.category} onChange={e => setArticleForm({...articleForm, category: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-white focus:border-indigo-primary outline-none">
                                <option>TDAH / TDA</option><option>Troubles DYS</option><option>Phobie Scolaire</option><option>Haut Potentiel</option><option>Hypersensibilité</option><option>Autre</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Sous-titre (Accroche)</label>
                        <textarea value={articleForm.subtitle} onChange={e => setArticleForm({...articleForm, subtitle: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-indigo-primary outline-none" rows={2} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Image du bandeau (Lien URL)</label>
                        <div className="flex gap-2">
                           <input type="text" value={articleForm.image_url} onChange={e => setArticleForm({...articleForm, image_url: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-indigo-primary outline-none" placeholder="https://..." />
                        </div>
                        {articleForm.image_url && <img src={articleForm.image_url} alt="Aperçu" className="h-20 w-auto mt-2 rounded-lg object-cover border" />}
                    </div>
                  </div>

                  {/* BLOC 2 : LE CONTENU (LEGO) */}
                  <div className="space-y-6">
                     <h3 className="font-bold text-indigo-primary flex items-center gap-2"><FileText size={18}/> 2. Le Contenu</h3>
                     
                     {/* Paragraphe 1 */}
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Introduction (Paragraphe 1)</label>
                        <p className="text-xs text-gray-400 mb-2">Décrivez la problématique ici.</p>
                        <textarea value={articleForm.paragraph_1} onChange={e => setArticleForm({...articleForm, paragraph_1: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-indigo-primary outline-none" rows={6} />
                     </div>

                     {/* L'Affiche */}
                     <div className="p-4 bg-peach-primary/5 border border-peach-primary/20 rounded-xl">
                        <label className="block text-sm font-bold text-peach-primary mb-1 flex items-center gap-2"><ImageIcon size={16}/> L'Affiche (Optionnel)</label>
                        <p className="text-xs text-gray-500 mb-2">Collez ici le lien de l'affiche ou de l'infographie.</p>
                        <input type="text" value={articleForm.poster_image_url} onChange={e => setArticleForm({...articleForm, poster_image_url: e.target.value})} className="w-full px-4 py-2 border border-peach-primary/30 rounded-xl focus:border-peach-primary focus:ring-2 focus:ring-peach-primary/20 outline-none" placeholder="https://..." />
                     </div>

                     {/* Paragraphe 2 */}
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Développement (Paragraphe 2)</label>
                        <p className="text-xs text-gray-400 mb-2">La suite de l'explication.</p>
                        <textarea value={articleForm.paragraph_2} onChange={e => setArticleForm({...articleForm, paragraph_2: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-indigo-primary outline-none" rows={6} />
                     </div>

                     {/* Image 2 */}
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Image d'illustration (Optionnel)</label>
                        <input type="text" value={articleForm.image_2_url} onChange={e => setArticleForm({...articleForm, image_2_url: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-indigo-primary outline-none" placeholder="https://..." />
                     </div>
                  </div>

                  {/* BLOC 3 : APPEL À L'ACTION */}
                  <div className="space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-indigo-primary flex items-center gap-2">3. Bouton d'action (Bas de page)</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Texte du bouton</label>
                            <input type="text" value={articleForm.cta_text} onChange={e => setArticleForm({...articleForm, cta_text: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-indigo-primary outline-none" placeholder="ex: Télécharger le guide" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Lien du bouton</label>
                            <input type="text" value={articleForm.cta_link} onChange={e => setArticleForm({...articleForm, cta_link: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-indigo-primary outline-none" />
                        </div>
                    </div>
                  </div>

                  {/* BLOC 4 : SEO (GOOGLE) */}
                  <div className="space-y-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <h3 className="font-bold text-blue-800 flex items-center gap-2">
                        <Search size={18}/> 4. Optimisation Google (SEO)
                    </h3>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Résumé pour Google (Meta Description)</label>
                        <p className="text-xs text-gray-500 mb-2">Ce texte apparaitra dans les résultats Google. Soyez accrocheur ! (Idéal : 150-160 caractères)</p>
                        <textarea value={articleForm.meta_description} onChange={e => setArticleForm({...articleForm, meta_description: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-blue-500 outline-none" rows={3} placeholder="Ex: Découvrez comment accompagner un enfant TDAH à l'école grâce à nos conseils..." />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Mots-clés (séparés par des virgules)</label>
                        <input type="text" value={articleForm.meta_keywords} onChange={e => setArticleForm({...articleForm, meta_keywords: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-blue-500 outline-none" placeholder="Ex: TDAH, école, troubles attention, Valenciennes" />
                    </div>
                  </div>

                  {/* PUBLICATION */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <input type="checkbox" id="published" checked={articleForm.published} onChange={e => setArticleForm({...articleForm, published: e.target.checked})} className="w-5 h-5 text-indigo-primary rounded focus:ring-indigo-primary" />
                      <label htmlFor="published" className="font-bold text-dark-text cursor-pointer select-none">Publier immédiatement sur le site</label>
                  </div>

                  <button type="submit" className="w-full py-4 bg-indigo-primary text-white font-bold text-lg rounded-xl hover:bg-indigo-primary/90 transition-all shadow-lg hover:shadow-indigo-primary/30 transform hover:-translate-y-1">
                      <Save className="inline-block mr-2" size={20} />
                      Sauvegarder l'article
                  </button>
                </form>
              ) : (
                /* ================= FORMULAIRE ÉVÉNEMENT ================= */
                <form onSubmit={handleSaveEvent} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Titre de l'événement</label>
                        <input type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-peach-primary outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Date et Heure</label>
                        <input type="datetime-local" value={formatDateForInput(eventForm.event_date)} onChange={e => setEventForm({...eventForm, event_date: new Date(e.target.value).toISOString()})} className="w-full px-4 py-2 border rounded-xl focus:border-peach-primary outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Lieu</label>
                        <input type="text" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-peach-primary outline-none" placeholder="ex: Salle des fêtes, Preseau" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-peach-primary outline-none" rows={4} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                        <input type="text" value={eventForm.image_url} onChange={e => setEventForm({...eventForm, image_url: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-peach-primary outline-none" placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Lien Inscription (HelloAsso...)</label>
                        <input type="text" value={eventForm.registration_link} onChange={e => setEventForm({...eventForm, registration_link: e.target.value})} className="w-full px-4 py-2 border rounded-xl focus:border-peach-primary outline-none" />
                    </div>
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <input type="checkbox" id="ev-pub" checked={eventForm.published} onChange={e => setEventForm({...eventForm, published: e.target.checked})} className="w-5 h-5 text-peach-primary rounded focus:ring-peach-primary" />
                        <label htmlFor="ev-pub" className="font-bold text-dark-text cursor-pointer select-none">Publier l'événement</label>
                    </div>

                    <button type="submit" className="w-full py-4 bg-peach-primary text-white font-bold text-lg rounded-xl hover:bg-peach-primary/90 transition-all shadow-lg hover:shadow-peach-primary/30 transform hover:-translate-y-1">
                      <Save className="inline-block mr-2" size={20} />
                      Sauvegarder l'événement
                    </button>
                </form>
              )}
            </div>
          ) : (
            
            /* --- LISTE DES ÉLÉMENTS (TABLEAU) --- */
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr><th className="p-4">Titre</th><th className="p-4">Statut</th><th className="p-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {activeTab === 'articles' ? articles.map(a => (
                            <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-dark-text">{a.title}</div>
                                    <div className="text-xs text-indigo-primary">{a.category}</div>
                                </td>
                                <td className="p-4">
                                    {a.published 
                                      ? <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle size={12}/> Publié</span> 
                                      : <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-bold"><XCircle size={12}/> Brouillon</span>
                                    }
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => handleEditArticle(a)} className="text-indigo-primary p-2 hover:bg-indigo-50 rounded-lg transition-colors" title="Modifier"><Edit size={18}/></button>
                                    <button onClick={() => handleDeleteArticle(a.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        )) : events.map(e => (
                             <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-dark-text">{e.title}</div>
                                    <div className="text-xs text-gray-400">{new Date(e.event_date).toLocaleDateString()}</div>
                                </td>
                                <td className="p-4">
                                    {e.published 
                                      ? <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle size={12}/> Publié</span> 
                                      : <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-bold"><XCircle size={12}/> Brouillon</span>
                                    }
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => handleEditEvent(e)} className="text-peach-primary p-2 hover:bg-peach-50 rounded-lg transition-colors" title="Modifier"><Edit size={18}/></button>
                                    <button onClick={() => handleDeleteEvent(e.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {((activeTab === 'articles' && articles.length === 0) || (activeTab === 'events' && events.length === 0)) && (
                    <div className="p-8 text-center text-gray-400 italic">Aucun élément trouvé.</div>
                )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}