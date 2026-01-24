import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Article } from '../lib/supabase';
import { ArrowRight, BookOpen, Search } from 'lucide-react';

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
          .order('created_at', { ascending: false });

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

  const categories = Array.from(new Set(articles.map(a => a.category)));
  
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-28 pb-24 md:pb-32 rounded-b-[3rem] overflow-hidden shadow-xl mb-12">
        
        {/* Image de fond */}
        <div className="absolute inset-0 z-0">
            <img 
                src="/connaissance.webp" 
                alt="Bibliothèque" 
                className="w-full h-full object-cover"
            />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            
            <div className="mb-10">
                {/* Badge Bulle de Verre */}
                <span className="inline-block py-2 px-6 rounded-full bg-white/30 backdrop-blur-md text-indigo-950 font-bold text-xs md:text-sm mb-6 uppercase tracking-widest border border-white/40 shadow-lg">
                    Ressources Éducatives
                </span>
                
                {/* Texte BLANC + OMBRE NOIRE */}
                <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                  Bibliothèque & Dossiers
                </h1>
                
                <p className="font-body text-lg md:text-xl text-white font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  Explorez nos guides, fiches pratiques et articles pour mieux comprendre le fonctionnement de vos enfants.
                </p>
            </div>

            {/* Filtres de catégorie : STYLE BULLES DE VERRE */}
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-6 py-2 md:py-3 rounded-full font-heading font-bold text-sm transition-all duration-300 shadow-lg backdrop-blur-md border ${
                    selectedCategory === 'all'
                      ? 'bg-peach-primary text-white border-peach-primary transform scale-105'
                      : 'bg-white/30 border-white/40 text-indigo-950 hover:bg-white/50 hover:scale-105'
                  }`}
                >
                  Tout voir
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 md:py-3 rounded-full font-heading font-bold text-sm transition-all duration-300 shadow-lg backdrop-blur-md border capitalize ${
                      selectedCategory === cat
                        ? 'bg-peach-primary text-white border-peach-primary transform scale-105'
                        : 'bg-white/30 border-white/40 text-indigo-950 hover:bg-white/50 hover:scale-105'
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
                  <div className="h-56 overflow-hidden relative bg-gray-100">
                    {article.image_url ? (
                      <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-primary/5 text-indigo-primary/20 gap-2"><BookOpen size={40} /></div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-primary uppercase tracking-wide shadow-sm">{article.category}</div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="font-heading font-bold text-xl text-dark-text mb-3 group-hover:text-indigo-primary transition-colors leading-tight">{article.title}</h3>
                    <p className="font-body text-dark-text/70 mb-6 line-clamp-3 text-sm flex-grow leading-relaxed">
                      {article.subtitle || (article.paragraph_1 ? article.paragraph_1.substring(0, 120) + '...' : "Découvrez cet article complet.")}
                    </p>
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-indigo-primary font-bold text-sm mt-auto">
                      <span>Lire le dossier</span>
                      <div className="w-10 h-10 rounded-full bg-indigo-primary/10 flex items-center justify-center group-hover:bg-indigo-primary group-hover:text-white transition-all duration-300"><ArrowRight size={18} /></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 max-w-2xl mx-auto">
              <div className="inline-flex p-6 rounded-full bg-gray-50 mb-6 text-gray-300"><Search size={40} /></div>
              <h3 className="font-heading font-bold text-2xl text-dark-text mb-2">Aucun résultat</h3>
              <button onClick={() => setSelectedCategory('all')} className="mt-4 px-8 py-3 bg-indigo-primary text-white font-bold rounded-full">Voir tout</button>
            </div>
          )}
      </div>
    </div>
  );
}