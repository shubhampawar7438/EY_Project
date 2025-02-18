/*
  # Career Selection Tables

  1. New Tables
    - `career_selections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `selected_careers` (text array)
      - `selection_method` (text)
      - `preferences` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `career_selections` table
    - Add policies for users to manage their own selections
*/

CREATE TABLE IF NOT EXISTS career_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  selected_careers text[] NOT NULL,
  selection_method text NOT NULL CHECK (selection_method IN ('chatbot', 'manual')),
  preferences jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE career_selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own career selections"
  ON career_selections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own career selections"
  ON career_selections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own career selections"
  ON career_selections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);