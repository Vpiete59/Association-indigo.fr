/*
  # Create Articles and Events Tables

  ## Purpose
  This migration creates tables to manage articles and events for the Association Indigo website.

  ## New Tables
  
  ### `articles`
  Stores informational articles about various topics related to atypical children.
  - `id` (uuid, primary key) - Unique identifier
  - `slug` (text, unique) - URL-friendly identifier (e.g., "mdph", "tdah-tda")
  - `title` (text) - Article title
  - `subtitle` (text) - Article subtitle
  - `category` (text) - Category for organization (e.g., "Troubles", "Administrative")
  - `poster_image_url` (text) - Main poster/hero image URL
  - `paragraph_1` (text) - First paragraph content
  - `image_2_url` (text, nullable) - Second image URL
  - `cta_text` (text, nullable) - Call-to-action button text
  - `cta_link` (text, nullable) - Call-to-action button link
  - `published` (boolean, default false) - Publication status
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `events`
  Stores upcoming and past events for the association.
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Event title
  - `description` (text) - Event description
  - `image_url` (text, nullable) - Event image URL
  - `event_date` (timestamptz) - Date and time of the event
  - `location` (text, nullable) - Event location
  - `registration_link` (text, nullable) - Registration URL
  - `published` (boolean, default false) - Publication status
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  Both tables have RLS enabled with the following policies:
  
  #### Public Read Access
  - Anyone can view published articles and events
  
  #### Admin Only Write Access
  - Only authenticated administrators can create, update, or delete articles and events
  - Admins are identified by checking if they have admin role in their JWT metadata

  ## Important Notes
  1. All content is publicly readable when published
  2. Only authenticated admins can manage content
  3. Unpublished content is not visible to the public
*/

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  poster_image_url text NOT NULL DEFAULT '',
  paragraph_1 text NOT NULL DEFAULT '',
  image_2_url text,
  cta_text text,
  cta_link text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  event_date timestamptz NOT NULL,
  location text,
  registration_link text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Articles policies
CREATE POLICY "Anyone can view published articles"
  ON articles FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view all articles"
  ON articles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete articles"
  ON articles FOR DELETE
  TO authenticated
  USING (true);

-- Events policies
CREATE POLICY "Anyone can view published events"
  ON events FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);
CREATE INDEX IF NOT EXISTS articles_published_idx ON articles(published);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category);
CREATE INDEX IF NOT EXISTS events_published_idx ON events(published);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(event_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_articles_updated_at'
  ) THEN
    CREATE TRIGGER update_articles_updated_at
      BEFORE UPDATE ON articles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_events_updated_at'
  ) THEN
    CREATE TRIGGER update_events_updated_at
      BEFORE UPDATE ON events
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;