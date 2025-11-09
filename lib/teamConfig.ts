export type TeamModelConfig = {
  teamId: number;
  teamName: string;
  modelName?: string;
  url: string;
};

export const TEAM_CONFIG: TeamModelConfig[] = [
  {
    teamId: 1,
    teamName: 'Aakaash Nigam',
    modelName: 'Aakaash Nigam',
    url: 'https://nigam-akaash--nanochat-inference-fastapi-app.modal.run/generate',
  },
  {
    teamId: 2,
    teamName: 'TinyBirdStories',
    modelName: 'Piotr Goral',
    url: 'https://piotrek-grl--nanochat-tinybirdstories-chat-web.modal.run/generate',
  },
  {
    teamId: 3,
    teamName: 'Tim',
    modelName: 'Tim',
    url: 'https://tymur-lysenko-nanochat4tsfm--nanochat4tsfm-serve.modal.run/generate',
  },
  {
    teamId: 4,
    teamName: 'gpt2',
    modelName: 'gpt2',
    url: 'https://modal.com/apps/asusevski/main/deployed/text-generation-api/generate',
  },
];

const TEAM_CONFIG_BY_ID = TEAM_CONFIG.reduce<Record<number, TeamModelConfig>>(
  (acc, team) => {
    acc[team.teamId] = team;
    return acc;
  },
  {}
);

export const getTeamConfigById = (teamId: number) => TEAM_CONFIG_BY_ID[teamId];
