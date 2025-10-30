import { NextRequest, NextResponse } from 'next/server';

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

    const TEAM_RESPONSES: Record<number, (userPrompt: string) => string> = {
      1: (userPrompt) => `drop the ${userPrompt}. its cleaner.`,
      2: () => 'whutzzittoya?',
      3: () => 'GO BLUE JAYS!!',
    };

    const generateResponse = TEAM_RESPONSES[Number(teamId)];

    if (!generateResponse) {
      return NextResponse.json(
        { error: 'No mock response configured for this team' },
        { status: 404 }
      );
    }

    const responseText = generateResponse(trimmedPrompt);
    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request', details: String(error) },
      { status: 500 }
    );
  }
}
