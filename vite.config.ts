import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import prerender from '@prerenderer/rollup-plugin';
import { createClient } from '@supabase/supabase-js';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

// Routes statiques toujours prerendues
const STATIC_ROUTES = [
  '/',
  '/articles',
  '/evenements',
  '/faq',
  '/contact',
  '/mentions-legales',
  '/politique-confidentialite',
];

// Slugs de secours si Supabase n'est pas accessible au build
const FALLBACK_ARTICLE_SLUGS = [
  'tdah-tda',
  'dys',
  'phobie-scolaire',
  'haut-potentiel',
];

async function fetchArticleSlugs(): Promise<string[]> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('[prerender] Variables Supabase absentes -> utilisation des slugs fallback');
    return FALLBACK_ARTICLE_SLUGS;
  }
  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from('articles')
      .select('slug')
      .eq('published', true);
    if (error || !data) {
      console.warn('[prerender] Erreur fetch articles:', error?.message);
      return FALLBACK_ARTICLE_SLUGS;
    }
    const slugs = data.map((a: { slug: string }) => a.slug).filter(Boolean);
    console.log(`[prerender] ${slugs.length} articles trouvés dans Supabase`);
    return slugs.length > 0 ? slugs : FALLBACK_ARTICLE_SLUGS;
  } catch (e) {
    console.warn('[prerender] Exception fetch:', e);
    return FALLBACK_ARTICLE_SLUGS;
  }
}

export default defineConfig(async () => {
  const articleSlugs = await fetchArticleSlugs();
  const articleRoutes = articleSlugs.map((s) => `/articles/${s}`);
  const routes = [...STATIC_ROUTES, ...articleRoutes];
  console.log(`[prerender] ${routes.length} routes à prerendre`);

  return {
    plugins: [
      react(),
      prerender({
        routes,
        renderer: '@prerenderer/renderer-puppeteer',
        rendererOptions: {
          renderAfterTime: 8000,
          maxConcurrentRoutes: 1,
          headless: true,
        },
        postProcess(renderedRoute) {
          renderedRoute.html = renderedRoute.html.replace(
            /http:\/\/localhost:\d+/g,
            'https://association-indigo.fr'
          );
          return renderedRoute;
        },
      }) as any,
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
