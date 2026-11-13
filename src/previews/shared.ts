// Données partagées par les 3 maquettes de design (route /preview, DEV uniquement).
// Tout le contenu affiché vient soit du site actuel, soit de Supabase : rien n'est inventé.
import { useEffect, useState } from 'react';
import { supabase, type Article, type Event } from '../lib/supabase';

export const LINKS = {
  adhesion: 'https://www.helloasso.com/associations/indigo-preseau/paiements/adhesion-indigo-preseau',
  don: 'https://www.helloasso.com/associations/indigo-preseau/formulaires/1',
  facebook: 'https://www.facebook.com/groups/467126453152213',
  email: 'associationindigo59@gmail.com',
};

export type ProfileKey = 'tdah' | 'dys' | 'hpi' | 'phobie' | 'hyper';

export interface Profile {
  key: ProfileKey;
  name: string;
  short: string;
  summary: string;
  dossier: string; // slug du dossier principal
  category: string; // catégorie Supabase des articles liés
}

export const PROFILES: Profile[] = [
  {
    key: 'tdah',
    name: 'TDAH / TDA',
    short: 'Attention, impulsivité, hyperactivité',
    summary: "Comprendre le déficit de l'attention et l'hyperactivité, et trouver des repères concrets pour la maison et l'école.",
    dossier: 'tdah-tda',
    category: 'TDAH / TDA',
  },
  {
    key: 'dys',
    name: 'Troubles DYS',
    short: 'Dyslexie, dyspraxie, dysphasie…',
    summary: 'Dyslexie, dyspraxie, dysphasie, dysgraphie, dyscalculie : les troubles des apprentissages expliqués simplement.',
    dossier: 'dys',
    category: 'Troubles DYS',
  },
  {
    key: 'hpi',
    name: 'Haut potentiel',
    short: 'HPI, HPE, zèbres',
    summary: "HPI, HPE, « zèbres » : vivre avec l'intensité, l'ennui à l'école et l'hypersensibilité qui l'accompagne souvent.",
    dossier: 'haut-potentiel',
    category: 'Haut Potentiel',
  },
  {
    key: 'phobie',
    name: 'Phobie scolaire',
    short: 'Refus scolaire anxieux',
    summary: "Quand aller à l'école devient impossible : accompagner le refus scolaire anxieux avec douceur, sans culpabiliser.",
    dossier: 'phobie-scolaire',
    category: 'Phobie Scolaire',
  },
  {
    key: 'hyper',
    name: 'Hypersensibilité',
    short: 'Tout est ressenti plus fort',
    summary: "Bruits, émotions, regards : quand un enfant ressent tout plus fort, il a besoin qu'on l'aide à apprivoiser ce qu'il vit.",
    dossier: 'lhypersensibilite-chez-lenfant',
    category: 'Hypersensibilité',
  },
];

// Témoignages déjà présents sur la page d'accueil actuelle
export const TESTIMONIALS = [
  {
    text: "Grâce à Indigo, nous avons enfin compris que notre fils n'était pas « difficile », mais qu'il percevait le monde différemment. Un soulagement immense.",
    author: 'Sophie',
    role: 'maman de Léo (TDAH)',
  },
  {
    text: "L'association a été une bouffée d'oxygène. Rencontrer d'autres parents qui vivent la même chose permet de se sentir moins seule.",
    author: 'Marc',
    role: 'papa de Julie (HPI)',
  },
];

export const PARTNERS = [
  { name: 'Ville de Préseau', url: 'https://www.preseau.fr/', image: '/Preseau.webp' },
  { name: 'STAJ Nord Artois', url: 'https://staj-nordartois.com/', image: '/staj.png' },
  { name: 'BYcoach', url: 'https://www.facebook.com/yohan.bauduin.52', image: '/Bauduin.webp' },
  { name: 'Cabinet MERCI', url: 'https://www.facebook.com/yohanbauduin.cabinet.MERCI', image: '/merci.webp' },
  { name: 'Le Baragraphe', url: 'https://www.facebook.com/lebaragraphe.fr', image: '/baragraphe.webp' },
  { name: 'Study avec Julie', url: 'https://www.facebook.com/people/Studyavecjulie/61567019326778/', image: '/studyavecjulie.webp' },
  { name: 'Kinevir', url: 'https://kinevir.com', image: '/kinevir-logo.webp' },
];

export type LiteArticle = Pick<Article, 'slug' | 'title' | 'subtitle' | 'category' | 'image_url' | 'created_at'>;

export interface PreviewData {
  loading: boolean;
  articles: LiteArticle[]; // tous les articles publiés, plus récents d'abord
  events: Event[]; // à venir si il y en a, sinon les derniers passés
  eventsArePast: boolean;
}

export function usePreviewData(): PreviewData {
  const [state, setState] = useState<PreviewData>({ loading: true, articles: [], events: [], eventsArePast: false });

  useEffect(() => {
    let alive = true;
    (async () => {
      const now = new Date().toISOString();
      const [a, up, past] = await Promise.all([
        supabase
          .from('articles')
          .select('slug,title,subtitle,category,image_url,created_at')
          .eq('published', true)
          .order('created_at', { ascending: false }),
        supabase.from('events').select('*').eq('published', true).gte('event_date', now).order('event_date').limit(3),
        supabase.from('events').select('*').eq('published', true).lt('event_date', now).order('event_date', { ascending: false }).limit(3),
      ]);
      if (!alive) return;
      const upcoming = up.data || [];
      setState({
        loading: false,
        articles: a.data || [],
        events: upcoming.length ? upcoming : past.data || [],
        eventsArePast: upcoming.length === 0,
      });
    })();
    return () => {
      alive = false;
    };
  }, []);

  return state;
}

export function articlesFor(profile: Profile, all: LiteArticle[]) {
  return all.filter((a) => a.category === profile.category && a.slug !== profile.dossier);
}

// "Mon titre 🧠 avec emoji" -> "Mon titre avec emoji" (les emojis ne servent pas d'icônes dans les maquettes)
export function cleanTitle(t: string) {
  return t.replace(/\p{Extended_Pictographic}️?/gu, '').replace(/\s{2,}/g, ' ').trim();
}

export function eventDay(iso: string) {
  const d = new Date(iso);
  return {
    weekday: ((w) => w.charAt(0).toUpperCase() + w.slice(1))(d.toLocaleDateString('fr-FR', { weekday: 'long' })),
    day: d.toLocaleDateString('fr-FR', { day: 'numeric' }),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''),
    monthLong: d.toLocaleDateString('fr-FR', { month: 'long' }),
    year: d.getFullYear(),
    time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h'),
  };
}

// Les catégories techniques de la base ("Autre", "Troubles") ne sont pas faites pour être lues
export function categoryLabel(c: string) {
  if (c === 'Autre') return 'Vie de famille & ateliers';
  if (c === 'Troubles') return 'Dossier';
  return c;
}
