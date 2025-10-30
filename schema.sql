-- ============================
--  Core Entities
-- ============================

CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name TEXT UNIQUE NOT NULL
);

CREATE TABLE submissions (
    submission_id SERIAL PRIMARY KEY,
    team_id INT NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    submission_name TEXT,
    submission_description TEXT,
    submission_url TEXT,
    CONSTRAINT unique_submission_per_team UNIQUE (team_id)
);

-- ============================
--  Helpful Indices
-- ============================

CREATE INDEX idx_submission_team_name ON submissions(submission_name)
    WHERE submission_name IS NOT NULL;
