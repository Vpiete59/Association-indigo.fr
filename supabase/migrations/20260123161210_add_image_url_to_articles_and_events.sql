/*
  # Add image_url field to articles and events

  ## Purpose
  Add an image URL field to both articles and events tables to store hero images
  that will be displayed in list views and detail pages.

  ## Changes
  1. Add `image_url` column to `articles` table
     - Type: text
     - Nullable: true (existing articles may not have images)
     - Description: URL of the hero image for the article
  
  2. Add `image_url` column to `events` table
     - Type: text
     - Nullable: true (existing events may not have images)
     - Description: URL of the hero image for the event

  ## Notes
  - Images can be external URLs or paths to assets in the public folder
  - No default value set, allowing NULL for articles/events without images
*/

-- Add image_url column to articles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE articles ADD COLUMN image_url text;
  END IF;
END $$;

-- Add image_url column to events table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE events ADD COLUMN image_url text;
  END IF;
END $$;
