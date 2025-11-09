import { NextRequest, NextResponse } from 'next/server';
import { getTeamConfigById } from '@/lib/teamConfig';

const extractResponseText = (payload: unknown): string => {
  if (typeof payload === 'string') {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, unknown>;
    const candidate =
      (typeof data.response === 'string' && data.response) ||
      (typeof data.text === 'string' && data.text) ||
      (typeof data.generated_text === 'string' && data.generated_text);

    if (candidate) {
      return candidate;
    }
  }

  return JSON.stringify(payload ?? {});
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, prompt } = body;

    if (!teamId || !prompt) {
      return NextResponse.json(
        { error: 'teamId and prompt are required' },
        { status: 400 }
      );
    }

    const trimmedPrompt = String(prompt).trim();

    if (!trimmedPrompt) {
      return NextResponse.json(
        { error: 'Prompt cannot be empty' },
        { status: 400 }
      );
    }

    const config = getTeamConfigById(Number(teamId));

    if (!config) {
      return NextResponse.json(
        { error: 'No endpoint configured for this team' },
        { status: 404 }
      );
    }

    const upstreamResponse = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: trimmedPrompt,
        model: config.modelName ?? config.teamName,
      }),
      cache: 'no-store',
    });

    if (!upstreamResponse.ok) {
      const errorPayload = await upstreamResponse
        .text()
        .catch(() => 'Unknown upstream error');
      return NextResponse.json(
        {
          error: 'Upstream model endpoint returned an error',
          details: errorPayload,
        },
        { status: upstreamResponse.status }
      );
    }

    const contentType = upstreamResponse.headers.get('content-type') ?? '';
    let upstreamPayload: unknown;

    if (contentType.includes('application/json')) {
      upstreamPayload = await upstreamResponse.json();
    } else {
      upstreamPayload = await upstreamResponse.text();
    }

    const responseText = extractResponseText(upstreamPayload);

    return NextResponse.json({
      response: responseText,
      teamName: config.teamName,
      modelName: config.modelName ?? config.teamName,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request', details: String(error) },
      { status: 500 }
    );
  }
}
