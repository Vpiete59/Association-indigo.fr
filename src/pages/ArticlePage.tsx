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
        if (!data) setError('Article non trouvé');
        else setArticle(data);
      } catch (err) {
        setError("Erreur de chargement.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-light-bg"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-primary border-t-transparent"></div></div>;

  if (error || !article) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-bg px-4 text-center">
      <h1 className="font-heading font-bold text-2xl text-dark-text mb-4">Oups !</h1>
      <p className="text-dark-text/70 mb-8">{error || "Cet article n'existe pas."}</p>
      <Link to="/articles" className="px-6 py-3 bg-indigo-primary text-white rounded-full font-bold">Retour à la bibliothèque</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-light-bg pb-20">
      
      {/* Header Image */}
      <div className="h-64 md:h-96 w-full relative">
        {article.image_url ? (
           <>
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-indigo-950/40"></div>
           </>
        ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-primary to-peach-primary"></div>
        )}
        
        {/* Bouton Retour */}
        <div className="absolute top-24 left-4 md:left-8 z-10">
             <Link to="/articles" className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-sm font-bold text-indigo-primary hover:bg-white transition-all shadow-sm">
                <ArrowLeft size={16} /> Retour
            </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <article className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
            
            {/* TITRE ET INFOS */}
            <div className="p-8 md:p-12 border-b border-gray-100 text-center">
                <span className="inline-block px-4 py-1 mb-4 bg-indigo-primary/10 text-indigo-primary font-bold rounded-full uppercase tracking-wide text-sm">
                    {article.category}
                </span>
                <h1 className="font-heading font-bold text-3xl md:text-5xl text-dark-text mb-6 leading-tight">
                    {article.title}
                </h1>
                {article.subtitle && (
                    <p className="font-body text-xl text-dark-text/60 italic max-w-2xl mx-auto">
                        "{article.subtitle}"
                    </p>
                )}
            </div>

            {/* LE CORPS DE L'ARTICLE */}
            <div className="p-8 md:p-12 space-y-12">
                
                {/* 1. Premier Paragraphe (Principal) */}
                {article.paragraph_1 && (
                    <div className="prose prose-lg prose-indigo max-w-none text-dark-text/80 whitespace-pre-line">
                        {article.paragraph_1}
                    </div>
                )}

                {/* 2. L'AFFICHE (Mise en valeur spéciale) */}
                {article.poster_image_url && (
                    <div className="flex justify-center py-4">
                        <div className="relative group max-w-md w-full">
                            <div className="absolute -inset-1 bg-gradient-to-r from-peach-primary to-indigo-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <img 
                                src={article.poster_image_url} 
                                alt="Affiche événement" 
                                className="relative rounded-2xl shadow-2xl w-full object-cover transform transition duration-500 hover:scale-[1.02]" 
                            />
                        </div>
                    </div>
                )}

                {/* NOTE : Le Paragraphe 2 a été retiré car absent de la base de données */}

                {/* 3. Image Secondaire */}
                {article.image_2_url && (
                    <div className="rounded-3xl overflow-hidden shadow-lg">
                        <img 
                            src={article.image_2_url} 
                            alt="Illustration" 
                            className="w-full h-auto object-cover" 
                        />
                    </div>
                )}
            </div>

            {/* CTA BOUTON */}
            {(article.cta_text && article.cta_link) && (
                <div className="p-8 md:p-12 bg-gray-50 text-center border-t border-gray-100">
                    <a
                        href={article.cta_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-peach-primary text-white font-heading font-bold text-lg rounded-full hover:bg-peach-primary/90 transition-all shadow-lg hover:shadow-peach-primary/30 transform hover:-translate-y-1"
                    >
                        {article.cta_text}
                    </a>
                </div>
            )}
        </article>

        {/* Section Partage */}
        <div className="max-w-4xl mx-auto mt-12 mb-20 text-center">
            <p className="text-dark-text/60 mb-4 font-bold">Partager cette ressource</p>
            <div className="flex justify-center">
                 <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-white text-[#1877F2] font-bold rounded-full shadow-sm hover:shadow-md transition-all border border-gray-100"
                 >
                    <Facebook size={18} />
                    Sur Facebook
                 </a>
            </div>
        </div>

      </div>
    </div>
  );
}