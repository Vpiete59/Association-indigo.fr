import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Article } from '../lib/supabase';
import { ArrowRight, BookOpen, Search, ImageOff } from 'lucide-react';

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false }); // Les plus récents en premier

        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        console.error('Erreur chargement articles:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  // Création dynamique des filtres basés sur les articles existants
  const categories = Array.from(new Set(articles.map(a => a.category)));
  
  // Filtrage
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-primary border-t-transparent"></div>
          <p className="font-heading text-indigo-primary font-bold">Chargement de la bibliothèque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-28 rounded-b-[3rem] overflow-hidden shadow-xl mb-12">
        
        {/* Image de fond mise à jour */}
        <div className="absolute inset-0 z-0">
            <img 
                src="/connaissance.webp" 
                alt="Savoir et Connaissance" 
                className="w-full h-full object-cover"
            />
            {/* Filtre sombre Indigo pour la lisibilité */}
            <div className="absolute inset-0 bg-indigo-950/70 mix-blend-multiply"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block py-1 px-4 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-sm mb-6 uppercase tracking-widest border border-white/30">
                Ressources Éducatives
            </span>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 drop-shadow-lg">
              Bibliothèque & Dossiers
            </h1>
            <p className="font-body text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Explorez nos guides, fiches pratiques et articles pour mieux comprendre le fonctionnement de vos enfants et trouver des clés au quotidien.
            </p>

            {/* Filtres de catégorie */}
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mt-10">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-6 py-2 rounded-full font-heading font-bold text-sm transition-all duration-300 ${
                    selectedCategory === 'all'
                      ? 'bg-peach-primary text-white shadow-lg scale-105'
                      : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/30'
                  }`}
                >
                  Tout voir
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full font-heading font-bold text-sm transition-all duration-300 capitalize ${
                      selectedCategory === cat
                        ? 'bg-peach-primary text-white shadow-lg scale-105'
                        : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
        </div>
      </section>

      {/* --- GRILLE DES ARTICLES --- */}
      <div className="container mx-auto px-4">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-primary/10 transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-2"
                >
                  {/* ZONE IMAGE */}
                  <div className="h-56 overflow-hidden relative bg-gray-100">
                    {article.image_url ? (
                      <img
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      // Fallback si pas d'image
                      <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-primary/5 text-indigo-primary/20 gap-2">
                        <BookOpen size={40} />
                      </div>
                    )}
                    
                    {/* Badge Catégorie */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-primary uppercase tracking-wide shadow-sm">
                      {article.category}
                    </div>
                  </div>

                  {/* CONTENU TEXTE */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="font-heading font-bold text-xl text-dark-text mb-3 group-hover:text-indigo-primary transition-colors leading-tight">
                      {article.title}
                    </h3>
                    
                    <p className="font-body text-dark-text/70 mb-6 line-clamp-3 text-sm flex-grow leading-relaxed">
                      {article.subtitle || (article.paragraph_1 ? article.paragraph_1.substring(0, 120) + '...' : "Découvrez cet article complet pour en savoir plus.")}
                    </p>
                    
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-indigo-primary font-bold text-sm mt-auto">
                      <span>Lire le dossier</span>
                      <div className="w-10 h-10 rounded-full bg-indigo-primary/10 flex items-center justify-center group-hover:bg-indigo-primary group-hover:text-white transition-all duration-300">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* --- ÉTAT VIDE --- */
            <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 max-w-2xl mx-auto">
              <div className="inline-flex p-6 rounded-full bg-gray-50 mb-6 text-gray-300">
                <Search size={40} />
              </div>
              <h3 className="font-heading font-bold text-2xl text-dark-text mb-2">Aucun résultat</h3>
              <p className="text-dark-text/60 mb-8">Nous n'avons pas trouvé d'articles dans cette catégorie pour le moment.</p>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="px-8 py-3 bg-indigo-primary text-white font-bold rounded-full hover:bg-indigo-primary/90 transition-all shadow-lg"
              >
                Voir toute la bibliothèque
              </button>
            </div>
          )}
      </div>
    </div>
  );
}