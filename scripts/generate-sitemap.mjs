import { createClient } from '@supabase/supabase-js';
import { config as dotenvConfig } from 'dotenv';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

dotenvConfig();

const BASE = 'https://association-indigo.fr';
const today = new Date().toISOString().slice(0, 10);

const staticUrls = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/articles', changefreq: 'weekly', priority: '0.9' },
  { loc: '/evenements', changefreq: 'weekly', priority: '0.8' },
  { loc: '/faq', changefreq: 'monthly', priority: '0.7' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
  { loc: '/mentions-legales', changefreq: 'yearly', priority: '0.2' },
  { loc: '/politique-confidentialite', changefreq: 'yearly', priority: '0.2' },
];

async function fetchArticles() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('published', true);
  return data || [];
}

function urlBlock({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${BASE}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const articles = await fetchArticles();
const blocks = [
  ...staticUrls.map((u) => urlBlock({ ...u, lastmod: today })),
  ...articles.map((a) =>
    urlBlock({
      loc: `/articles/${a.slug}`,
      lastmod: (a.updated_at || today).slice(0, 10),
      changefreq: 'monthly',
      priority: '0.8',
    })
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blocks.join('\n')}
</urlset>
`;

const out = resolve('public/sitemap.xml');
writeFileSync(out, xml);
console.log(`[sitemap] ${staticUrls.length + articles.length} URLs écrites dans ${out}`);
