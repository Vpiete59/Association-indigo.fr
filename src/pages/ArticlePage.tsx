import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Article } from '../lib/supabase';
import { ArrowLeft, Facebook } from 'lucide-react';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setError('Article non trouvé');
        } else {
          setArticle(data);
        }
      } catch (err) {
        setError('Erreur lors du chargement de l\'article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

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

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-dark-text mb-4">{error || 'Article non trouvé'}</p>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-indigo-primary hover:underline"
          >
            <ArrowLeft size={20} />
            Retour aux articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec Titre et Sous-titre */}
      <section className="relative min-h-[60vh] flex items-end bg-gray-900">
        {article.poster_image_url && (
          <img
            src={article.poster_image_url}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative container mx-auto px-4 py-12 pb-16">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Retour aux articles
          </Link>
          
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4 max-w-4xl">
            {article.title}
          </h1>
          
          {article.subtitle && (
            <p className="font-body text-xl md:text-2xl text-white/90 max-w-3xl">
              {article.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Contenu Principal */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Paragraphe Principal */}
            {article.paragraph_1 && (
              <div className="prose prose-lg max-w-none mb-12">
                <div className="whitespace-pre-wrap font-body text-dark-text text-lg leading-relaxed">
                  {article.paragraph_1}
                </div>
              </div>
            )}

            {/* Image Secondaire */}
            {article.image_2_url && (
              <div className="my-12">
                <img
                  src={article.image_2_url}
                  alt="Illustration"
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
            )}

            {/* CTA personnalisé si disponible */}
            {article.cta_text && article.cta_link && (
              <div className="my-12 text-center">
                <a
                  href={article.cta_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-nature-primary text-white font-body font-semibold text-lg rounded-full hover:bg-opacity-90 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-nature-primary focus:ring-offset-2 shadow-lg"
                >
                  {article.cta_text}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Facebook - Toujours présent */}
      <section className="py-16 bg-light-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-dark-text mb-4">
              Rejoignez notre communauté
            </h2>
            <p className="font-body text-dark-text/80 mb-8">
              Échangez avec d'autres familles, partagez vos expériences et trouvez du soutien sur notre groupe Facebook.
            </p>
            <a
              href="https://www.facebook.com/groups/467126453152213"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#1877F2] text-white font-body font-semibold text-lg rounded-full hover:bg-[#166FE5] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#1877F2] focus:ring-offset-2 shadow-lg"
            >
              <Facebook size={24} />
              Rejoindre le groupe Facebook
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
