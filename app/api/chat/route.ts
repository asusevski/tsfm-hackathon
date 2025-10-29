import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, prompt, max_new_tokens } = body;

    if (!teamId || !prompt) {
      return NextResponse.json(
        { error: 'teamId and prompt are required' },
        { status: 400 }
      );
    }

    // Fetch the team's endpoint URL
    const result = await sql`
      SELECT s.link as endpoint_url
      FROM submissions s
      WHERE s.team_id = ${teamId}
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'No submission found for this team' },
        { status: 404 }
      );
    }

    const endpointUrl = result.rows[0].endpoint_url;

    // Ensure the URL ends with /generate
    const generateUrl = endpointUrl.endsWith('/generate')
      ? endpointUrl
      : `${endpointUrl.replace(/\/$/, '')}/generate`;

    // Make request to team's endpoint
    const requestBody: { prompt: string; max_new_tokens?: number } = { prompt };
    if (max_new_tokens !== undefined) {
      requestBody.max_new_tokens = max_new_tokens;
    }

    const response = await fetch(generateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Team endpoint error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request', details: String(error) },
      { status: 500 }
    );
  }
}
