import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await sql`
      SELECT
        c.competition_id,
        c.submission_a_id,
        c.submission_b_id,
        comp_a.text as completion_a,
        comp_b.text as completion_b
      FROM competitions c
      JOIN submissions s_a ON c.submission_a_id = s_a.submission_id
      JOIN submissions s_b ON c.submission_b_id = s_b.submission_id
      JOIN completions comp_a ON s_a.team_id = comp_a.team_id
      JOIN completions comp_b ON s_b.team_id = comp_b.team_id
      WHERE comp_a.prompt_id = comp_b.prompt_id
      ORDER BY RANDOM()
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'No competitions available' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching competition:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competition' },
      { status: 500 }
    );
  }
}
