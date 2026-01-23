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

  // Grouper les catégories pour les filtres
  const categories = Array.from(new Set(articles.map(a => a.category)));
  
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
      
      {/* En-tête avec formes douces */}
      <section className="bg-white pt-12 pb-16 rounded-b-[3rem] shadow-sm relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-peach-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-nature-primary/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-primary/10 text-indigo-primary font-bold text-sm mb-4 uppercase tracking-wide">
                Ressources
            </span>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-dark-text mb-6">
              Bibliothèque & Dossiers
            </h1>
            <p className="font-body text-lg text-dark-text/70 max-w-2xl mx-auto">
              Retrouvez ici tous nos articles, guides et fiches pratiques pour mieux comprendre et accompagner vos enfants.
            </p>

            {/* Filtres de catégorie */}
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-5 py-2 rounded-full font-heading font-bold text-sm transition-all duration-300 ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-primary text-white shadow-lg shadow-indigo-primary/30'
                      : 'bg-white text-dark-text/70 hover:bg-gray-50 border border-gray-100'
                  }`}
                >
                  Tout voir
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-full font-heading font-bold text-sm transition-all duration-300 capitalize ${
                      selectedCategory === cat
                        ? 'bg-peach-primary text-white shadow-lg shadow-peach-primary/30'
                        : 'bg-white text-dark-text/70 hover:bg-gray-50 border border-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
        </div>
      </section>

      {/* Grille des articles */}
      <div className="container mx-auto px-4">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1"
                >
                  {/* ZONE IMAGE (Affichage du Hero) */}
                  <div className="h-56 overflow-hidden relative bg-gray-100">
                    {article.image_url ? (
                      <img
                        src={article.image_url} // C'est ici que l'image du Hero est chargée
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      // Fallback si pas d'image : un fond coloré doux avec icône
                      <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-primary/5 text-indigo-primary/20 gap-2">
                        <ImageOff size={32} />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-50">Pas d'image</span>
                      </div>
                    )}
                    
                    {/* Badge Catégorie superposé sur l'image */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-primary uppercase tracking-wide shadow-sm">
                      {article.category}
                    </div>
                  </div>

                  {/* Contenu Texte de la carte */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="font-heading font-bold text-xl text-dark-text mb-3 group-hover:text-indigo-primary transition-colors leading-tight">
                      {article.title}
                    </h3>
                    
                    {/* On affiche le sous-titre s'il existe, sinon on coupe le premier paragraphe */}
                    <p className="font-body text-dark-text/70 mb-6 line-clamp-3 text-sm flex-grow leading-relaxed">
                      {article.subtitle || (article.paragraph_1 ? article.paragraph_1.substring(0, 100) + '...' : "Lire l'article pour en savoir plus.")}
                    </p>
                    
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-indigo-primary font-bold text-sm mt-auto">
                      <span>Lire le dossier</span>
                      <div className="w-8 h-8 rounded-full bg-indigo-primary/10 flex items-center justify-center group-hover:bg-indigo-primary group-hover:text-white transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* État vide si aucune recherche ne correspond */
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
              <div className="inline-flex p-4 rounded-full bg-gray-100 mb-4 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="font-heading font-bold text-xl text-dark-text mb-2">Aucun article trouvé</h3>
              <p className="text-dark-text/60">Nous n'avons pas encore de contenu pour cette catégorie.</p>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="mt-6 text-indigo-primary font-bold hover:underline"
              >
                Voir tous les articles
              </button>
            </div>
          )}
      </div>
    </div>
  );
}