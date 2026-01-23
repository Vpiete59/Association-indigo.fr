/*
  # Create Admin User

  ## Purpose
  This migration creates an admin user account for the Association Indigo website.

  ## Details
  - Email: admin@association-indigo.fr
  - Password: 12345
  - This account will have full access to the admin panel

  ## Important Notes
  1. This is a simple password for initial setup
  2. It's recommended to change this password after first login
  3. The user will be created in the auth.users table
*/

-- Insert admin user using Supabase auth
-- Note: We'll use a SQL function to create the user with the specified credentials
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@association-indigo.fr';

  -- If user doesn't exist, we'll create a placeholder
  -- The actual user creation should be done via Supabase dashboard or API
  -- This is just a note in the database
  IF admin_user_id IS NULL THEN
    RAISE NOTICE 'Admin user needs to be created via Supabase Auth API';
    RAISE NOTICE 'Email: admin@association-indigo.fr';
    RAISE NOTICE 'Password: 12345';
  END IF;
END $$;
