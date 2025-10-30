import { NextResponse } from 'next/server';

export async function GET() {
  const teams = [
    {
      team_id: 1,
      team_name: 'Team Alpha',
      endpoint_url: 'https://mock.team-alpha.dev/generate',
    },
    {
      team_id: 2,
      team_name: 'Team Beta',
      endpoint_url: 'https://mock.team-beta.dev/generate',
    },
    {
      team_id: 3,
      team_name: 'Team Gamma',
      endpoint_url: 'https://mock.team-gamma.dev/generate',
    },
  ];

  return NextResponse.json({ teams });
}
