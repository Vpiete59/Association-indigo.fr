// Génère supabase/content/enrichissement-articles.sql à partir de contenu/articles-enrichis.txt.
// Chaque bloc « === slug » remplit paragraph_2 (suite de l'article) et, si fourni, meta_description.
// Par défaut, paragraph_2 n'est écrit que s'il est vide (on n'écrase pas un texte saisi entre-temps) ;
// « mode: replace » force le remplacement (textes en doublon d'un autre article).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = readFileSync(new URL('../contenu/articles-enrichis.txt', import.meta.url), 'utf8').replace(/\r/g, '');
const blocks = src.split(/^=== /m).slice(1);

// Chaînes SQL en « dollar quoting » : pas d'échappement des apostrophes à gérer
const quote = (s) => {
  let t = 'txt';
  while (s.includes(`$${t}$`)) t += 'x';
  return `$${t}$${s}$${t}$`;
};
const words = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

const out = [
  '-- Enrichissement des articles courts (généré par scripts/build-enrichissement-sql.mjs)',
  '-- À exécuter une fois dans Supabase > SQL Editor. Peut être relancé sans dégât.',
  'begin;',
  '',
];
const report = [];
for (const b of blocks) {
  const [head, ...rest] = b.split(/^---$/m);
  const lines = head.trim().split('\n');
  const slug = lines[0].trim();
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Slug invalide : ${slug}`);
  const meta = (lines.find((l) => l.startsWith('meta:')) || '').replace('meta:', '').trim();
  const replace = lines.some((l) => /^mode:\s*replace/.test(l));
  const body = rest.join('---').trim();
  const set = [
    `paragraph_2 = ${replace ? quote(body) : `case when coalesce(trim(paragraph_2), '') = '' then ${quote(body)} else paragraph_2 end`}`,
  ];
  if (meta) set.push(`meta_description = ${quote(meta)}`);
  set.push('updated_at = now()');
  out.push(`-- ${slug}`, `update articles set\n  ${set.join(',\n  ')}\nwhere slug = '${slug}';`, '');
  report.push(`${slug}: +${words(body)} mots, résumé ${meta.length} caractères${replace ? ' (remplace)' : ''}`);
}
out.push('commit;', '');

mkdirSync(new URL('../supabase/content/', import.meta.url), { recursive: true });
writeFileSync(new URL('../supabase/content/enrichissement-articles.sql', import.meta.url), out.join('\n'));
console.log(report.join('\n'));
console.log(`\n${blocks.length} articles -> supabase/content/enrichissement-articles.sql`);
