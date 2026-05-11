/*
  # Création de la table page_views (analytics anonymes)

  ## Objectif
  Stocker chaque vue de page de façon anonyme pour générer des statistiques
  visiteurs/pages vues dans l'admin.

  ## Table
  - id (uuid) — identifiant ligne
  - path (text) — chemin de la page visitée (ex: "/articles/tdah-tda")
  - visitor_id (text) — UUID anonyme généré côté client et stocké en localStorage
    (permet de compter les visiteurs uniques sans cookie tiers)
  - created_at (timestamptz) — date/heure de la visite

  ## RGPD
  - Aucune donnée personnelle stockée (pas d'IP, pas d'email, pas de nom)
  - visitor_id est un UUID aléatoire généré localement — anonyme
  - Considéré comme analytics first-party essentiels (CNIL : sans consentement requis)

  ## Sécurité
  - INSERT public anonyme (n'importe qui peut tracker une visite)
  - SELECT uniquement pour utilisateurs authentifiés (admin)
*/

CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  visitor_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour les requêtes par date (le plus fréquent)
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at DESC);

-- Index pour les requêtes par path (top pages)
CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views (path);

-- Index pour le comptage des visiteurs uniques
CREATE INDEX IF NOT EXISTS page_views_visitor_id_idx ON page_views (visitor_id);

-- Activation Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- INSERT : tout le monde (visiteur anonyme) peut tracker
CREATE POLICY "Anyone can insert page views"
  ON page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- SELECT : uniquement les utilisateurs authentifiés (admin)
CREATE POLICY "Authenticated users can read all page views"
  ON page_views FOR SELECT
  TO authenticated
  USING (true);
