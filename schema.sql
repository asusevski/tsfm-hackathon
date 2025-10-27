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
    team_id INT NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    text TEXT NOT NULL
);

-- ============================
--  Competition & Voting
-- ============================

CREATE TABLE competitions (
    competition_id SERIAL PRIMARY KEY,
    submission_a_id INT NOT NULL REFERENCES submissions(submission_id) ON DELETE CASCADE,
    submission_b_id INT NOT NULL REFERENCES submissions(submission_id) ON DELETE CASCADE,

    -- enforce unique unordered pairs
    submission_low  INT GENERATED ALWAYS AS (LEAST(submission_a_id, submission_b_id)) STORED,
    submission_high INT GENERATED ALWAYS AS (GREATEST(submission_a_id, submission_b_id)) STORED,

    CONSTRAINT unique_competition_pair UNIQUE (submission_low, submission_high),
    CHECK (submission_a_id <> submission_b_id)
);

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
--  ELO Update Function
-- ============================

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

-- ============================
--  Trigger Auto ELO Update
-- ============================

CREATE OR REPLACE FUNCTION trigger_update_elo_on_vote()
RETURNS TRIGGER AS $$
DECLARE
    sub_a_team INT;
    sub_b_team INT;
BEGIN
    -- get team ids that competed against each other
    SELECT s1.team_id, s2.team_id
    INTO sub_a_team, sub_b_team
    FROM competitions c
    JOIN submissions s1 ON c.submission_a_id = s1.submission_id
    JOIN submissions s2 ON c.submission_b_id = s2.submission_id
    WHERE c.competition_id = NEW.competition_id;

    IF NEW.vote_result = 1 THEN
        PERFORM update_elo(sub_a_team, sub_b_team, FALSE);
    ELSIF NEW.vote_result = -1 THEN
        PERFORM update_elo(sub_b_team, sub_a_team, FALSE);
    ELSE
        PERFORM update_elo(sub_a_team, sub_b_team, TRUE);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================
--  Trigger Declaration
-- ============================

CREATE TRIGGER trg_votes_elo_update
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION trigger_update_elo_on_vote();

-- ============================
--  Useful Indices
-- ============================

CREATE INDEX idx_votes_team ON votes(team_id);
CREATE INDEX idx_votes_competition ON votes(competition_id);
CREATE INDEX idx_elo_rating ON elo_ratings(rating DESC);

