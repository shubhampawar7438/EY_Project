/*
  # Add Career Preferences and Resources Tables

  1. New Tables
    - `career_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `primary_career` (text)
      - `secondary_career` (text)
      - `primary_score` (numeric)
      - `secondary_score` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `completed_resources`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `resource_id` (text)
      - `completed_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Career Preferences Table
CREATE TABLE IF NOT EXISTS career_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  primary_career text NOT NULL,
  secondary_career text NOT NULL,
  primary_score numeric NOT NULL,
  secondary_score numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE career_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own career preferences"
  ON career_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own career preferences"
  ON career_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own career preferences"
  ON career_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Completed Resources Table
CREATE TABLE IF NOT EXISTS completed_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  resource_id text NOT NULL,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE completed_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their completed resources"
  ON completed_resources
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their completed resources"
  ON completed_resources
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger for career_preferences
CREATE TRIGGER update_career_preferences_updated_at
  BEFORE UPDATE ON career_preferences
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Add unique constraint to prevent duplicate resource completions
ALTER TABLE completed_resources
  ADD CONSTRAINT unique_user_resource
  UNIQUE (user_id, resource_id);