import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { competition_id, selected_box } = await request.json();

    // Validate input
    if (!competition_id || !selected_box) {
      return NextResponse.json(
        { error: 'Missing required fields: competition_id and selected_box' },
        { status: 400 }
      );
    }

    if (selected_box !== 'box1' && selected_box !== 'box2') {
      return NextResponse.json(
        { error: 'Invalid selected_box value. Must be "box1" or "box2"' },
        { status: 400 }
      );
    }

    // Convert selected_box to vote_result
    // box1 = completion_a wins = 1
    // box2 = completion_b wins = -1
    const vote_result = selected_box === 'box1' ? 1 : -1;

    // Hardcoded team_id for now (will be replaced with actual user authentication)
    const team_id = 1;

    // Insert vote into database
    await sql`
      INSERT INTO votes (competition_id, team_id, vote_result)
      VALUES (${competition_id}, ${team_id}, ${vote_result})
      ON CONFLICT (competition_id, team_id)
      DO UPDATE SET vote_result = ${vote_result}
    `;

    return NextResponse.json({
      success: true,
      message: 'Vote submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    );
  }
}
