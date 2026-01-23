import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  image_url?: string;
  poster_image_url: string;
  paragraph_1: string;
  image_2_url?: string;
  cta_text?: string;
  cta_link?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  event_date: string;
  location?: string;
  registration_link?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}
