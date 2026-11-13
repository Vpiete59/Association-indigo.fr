// Transforme le texte brut d'un article (paragraph_1) en blocs structurés :
// intertitres (H2), paragraphes et listes. Les articles sont saisis dans l'admin
// sans mise en forme : un intertitre y est une ligne courte sans point final ou
// terminée par « ... », une puce commence par « • » ou « - ».

export type Block =
  | { type: 'lead'; text: string }
  | { type: 'h2'; text: string; id: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] };

const BULLET = /^\s*(?:[•\-–*·▪►✔✅👉]|\d+[.)])\s+/u;

function slugify(t: string) {
  return t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function looksLikeHeading(t: string) {
  const words = t.split(/\s+/).length;
  if (words < 2 || t.length > 110) return false;
  if (/(\.\.\.|…)$/.test(t)) return true; // « Le cerveau TDAH et le filtre verbal... »
  if (/\?$/.test(t)) return t.length <= 90; // « Comment l'aider ? »
  return !/[.!:;,]$/.test(t) && t.length <= 80;
}

function tidyHeading(t: string) {
  let h = t
    .replace(/[\p{Extended_Pictographic}⤴⤵️‼]/gu, '')
    .replace(/\s*(\.\.\.|…)$/, '')
    .trim();
  // « TROUBLES DE L'OPPOSITION » -> « Troubles de l'opposition »
  if (h === h.toUpperCase() && /[A-ZÀ-Ý]/.test(h)) h = h.charAt(0) + h.slice(1).toLowerCase();
  return h;
}

export function parseArticle(raw: string): Block[] {
  const lines = (raw || '').replace(/\r/g, '').split('\n').map((l) => l.trim());
  const groups: string[][] = [];
  let cur: string[] = [];
  for (const l of lines) {
    if (!l) {
      if (cur.length) groups.push(cur);
      cur = [];
    } else cur.push(l);
  }
  if (cur.length) groups.push(cur);

  const blocks: Block[] = [];
  const used = new Set<string>();
  for (const g of groups) {
    let para: string[] = [];
    let items: string[] = [];
    const flushP = () => {
      if (!para.length) return;
      const text = para.join(' ');
      if (para.length === 1 && looksLikeHeading(text)) {
        if (blocks.length === 0) blocks.push({ type: 'lead', text: tidyHeading(text) });
        else {
          const h = tidyHeading(text);
          let id = slugify(h) || 'partie';
          while (used.has(id)) id += '-2';
          used.add(id);
          blocks.push({ type: 'h2', text: h, id });
        }
      } else blocks.push({ type: 'p', text });
      para = [];
    };
    const flushL = () => {
      if (items.length) blocks.push({ type: 'ul', items });
      items = [];
    };
    for (const l of g) {
      if (BULLET.test(l)) {
        flushP();
        items.push(l.replace(BULLET, ''));
      } else {
        flushL();
        para.push(l);
      }
    }
    flushP();
    flushL();
  }
  return blocks;
}

export function readingMinutes(raw: string) {
  const words = (raw || '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
