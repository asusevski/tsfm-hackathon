import { NextResponse } from 'next/server';
import { TEAM_CONFIG } from '@/lib/teamConfig';

export async function GET() {
  const teams = TEAM_CONFIG.map((team) => ({
    team_id: team.teamId,
    team_name: team.teamName,
    model_name: team.modelName ?? null,
    endpoint_url: team.url,
  }));

  return NextResponse.json({ teams });
}
