import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await sql`
      SELECT
        t.team_id,
        t.team_name,
        s.link as endpoint_url
      FROM teams t
      LEFT JOIN submissions s ON t.team_id = s.team_id
      ORDER BY t.team_name ASC
    `;

    return NextResponse.json({ teams: result.rows });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}
