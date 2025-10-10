-- Create the elo_table for storing team rankings
CREATE TABLE IF NOT EXISTS elo_table (
  id SERIAL PRIMARY KEY,
  model_id VARCHAR(100) NOT NULL UNIQUE,
  team_name VARCHAR(255) NOT NULL,
  elo INTEGER NOT NULL DEFAULT 1500,
  votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data (same as hardcoded data)
INSERT INTO elo_table (model_id, team_name, elo, votes) VALUES
  ('gpt-4', 'Team Alpha', 1523, 342),
  ('claude-3', 'Team Beta', 1487, 298),
  ('gemini-pro', 'Team Gamma', 1501, 315),
  ('llama-2', 'Team Delta', 1456, 267),
  ('mistral-7b', 'Team Epsilon', 1512, 289),
  ('gpt-5', 'Team Zeta', 9999, 289)
ON CONFLICT (model_id) DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_elo_desc ON elo_table(elo DESC);
