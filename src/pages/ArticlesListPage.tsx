import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Article } from '../lib/supabase';
import { ArrowRight } from 'lucide-react';

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('title', { ascending: true });

        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  const groupedArticles = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

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
            Nos Articles
          </h1>
          <p className="font-body text-xl text-dark-text/80 max-w-2xl mx-auto">
            Découvrez nos ressources et informations sur les enfants atypiques
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
            <div key={category}>
              <h2 className="font-heading font-semibold text-3xl text-indigo-primary mb-6">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/articles/${article.slug}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {article.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-heading font-semibold text-2xl text-dark-text mb-2">
                        {article.title}
                      </h3>
                      <p className="font-body text-dark-text/70 mb-4 line-clamp-2">
                        {article.subtitle}
                      </p>
                      <div className="flex items-center gap-2 text-indigo-primary font-semibold">
                        Lire l'article
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {articles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-dark-text/60">
                Aucun article disponible pour le moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
