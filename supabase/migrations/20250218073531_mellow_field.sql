/*
  # Add test results table

  1. New Tables
    - `test_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `test_id` (text)
      - `career_id` (text)
      - `score` (numeric)
      - `answers` (jsonb)
      - `completed_at` (timestamptz)
  
  2. Security
    - Enable RLS on `test_results` table
    - Add policies for authenticated users to:
      - Insert their own test results
      - Read their own test results
*/

CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  test_id text NOT NULL,
  career_id text NOT NULL,
  score numeric NOT NULL,
  answers jsonb NOT NULL,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own test results
CREATE POLICY "Users can insert their own test results"
  ON test_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to read their own test results
CREATE POLICY "Users can read their own test results"
  ON test_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_career_id ON test_results(career_id);