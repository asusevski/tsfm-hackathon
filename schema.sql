-- ============================
--  Base Tables
-- ============================

CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE submissions (
    submission_id SERIAL PRIMARY KEY,
    team_id INT NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    link TEXT NOT NULL
);

CREATE TABLE prompts (
    prompt_id SERIAL PRIMARY KEY,
    text TEXT NOT NULL
);

CREATE TABLE completions (
    completion_id SERIAL PRIMARY KEY,
    prompt_id INT NOT NULL REFERENCES prompts(prompt_id) ON DELETE CASCADE,
    text TEXT NOT NULL
);

-- ============================
--  Competition & Voting
-- ============================

CREATE TABLE competitions (
    competition_id SERIAL PRIMARY KEY,
    submission_a_id INT NOT NULL REFERENCES submissions(submission_id) ON DELETE CASCADE,
    submission_b_id INT NOT NULL REFERENCES submissions(submission_id) ON DELETE CASCADE,
    CONSTRAINT no_duplicate_pair UNIQUE (
        LEAST(submission_a_id, submission_b_id),
        GREATEST(submission_a_id, submission_b_id)
    ),
    CHECK (submission_a_id <> submission_b_id)
);

-- One vote per team per competition
CREATE TABLE votes (
    competition_id INT NOT NULL REFERENCES competitions(competition_id) ON DELETE CASCADE,
    team_id INT NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    vote_result INT NOT NULL CHECK (vote_result IN (1, -1, 0)), -- 1 = A wins, -1 = B wins, 0 = tie
    PRIMARY KEY (competition_id, team_id)
);

-- ============================
--  ELO Ratings
-- ============================

CREATE TABLE elo_ratings (
    team_id INT PRIMARY KEY REFERENCES teams(team_id) ON DELETE CASCADE,
    rating FLOAT NOT NULL DEFAULT 1000,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- ============================
--  Useful Indices
-- ============================

CREATE INDEX idx_votes_team ON votes(team_id);
CREATE INDEX idx_votes_competition ON votes(competition_id);
CREATE INDEX idx_elo_rating ON elo_ratings(rating DESC);

-- ============================
--  Example ELO Update Function
-- ============================

-- Simple ELO formula: R' = R + K * (S - E)
-- S = actual score (1 win, 0.5 tie, 0 loss)
-- E = expected score (1 / (1 + 10^((R_opp - R_self)/400)))

CREATE OR REPLACE FUNCTION update_elo(
    winner_team INT,
    loser_team INT,
    is_tie BOOLEAN DEFAULT FALSE,
    k_factor FLOAT DEFAULT 32
)
RETURNS VOID AS $$
DECLARE
    rating_winner FLOAT;
    rating_loser FLOAT;
    expected_winner FLOAT;
    expected_loser FLOAT;
    score_winner FLOAT;
    score_loser FLOAT;
BEGIN
    SELECT rating INTO rating_winner FROM elo_ratings WHERE team_id = winner_team;
    SELECT rating INTO rating_loser FROM elo_ratings WHERE team_id = loser_team;

    expected_winner := 1 / (1 + POWER(10, (rating_loser - rating_winner) / 400));
    expected_loser  := 1 / (1 + POWER(10, (rating_winner - rating_loser) / 400));

    IF is_tie THEN
        score_winner := 0.5;
        score_loser := 0.5;
    ELSE
        score_winner := 1.0;
        score_loser := 0.0;
    END IF;

    UPDATE elo_ratings
    SET rating = rating + k_factor * (score_winner - expected_winner),
        last_updated = NOW()
    WHERE team_id = winner_team;

    UPDATE elo_ratings
    SET rating = rating + k_factor * (score_loser - expected_loser),
        last_updated = NOW()
    WHERE team_id = loser_team;
END;
$$ LANGUAGE plpgsql;
