'use client';

import { useState, useEffect, useRef } from 'react';

interface Team {
  team_id: number;
  team_name: string;
  endpoint_url: string | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch teams on mount
  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => {
        setTeams(data.teams || []);
      })
      .catch(err => {
        console.error('Failed to fetch teams:', err);
        setError('Failed to load teams');
      });
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedTeam = teams.find(t => t.team_id === selectedTeamId);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedTeamId || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: selectedTeamId,
          prompt: input,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      // Handle different response formats - adjust based on what teams return
      let assistantContent = '';
      if (typeof data === 'string') {
        assistantContent = data;
      } else if (data.response) {
        assistantContent = data.response;
      } else if (data.text) {
        assistantContent = data.text;
      } else if (data.generated_text) {
        assistantContent = data.generated_text;
      } else {
        assistantContent = JSON.stringify(data);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantContent,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">Team Model Chat</h1>
          <p className="text-sm text-gray-600 mt-1">
            Select a team and start chatting with their model
          </p>
        </div>
      </header>

      {/* Team Selector */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <label htmlFor="team-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Team:
          </label>
          <select
            id="team-select"
            value={selectedTeamId || ''}
            onChange={(e) => {
              setSelectedTeamId(Number(e.target.value) || null);
              setMessages([]);
              setError(null);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select a team --</option>
            {teams.map((team) => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
                {!team.endpoint_url && ' (No submission)'}
              </option>
            ))}
          </select>
          {selectedTeam && selectedTeam.endpoint_url && (
            <p className="text-xs text-gray-500 mt-1">
              Endpoint: {selectedTeam.endpoint_url}
            </p>
          )}
          {selectedTeam && !selectedTeam.endpoint_url && (
            <p className="text-xs text-red-500 mt-1">
              This team has not submitted an endpoint yet.
            </p>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-12">
              {selectedTeamId
                ? 'Start a conversation by typing a message below.'
                : 'Select a team to start chatting.'}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-3 rounded-lg bg-white border border-gray-200">
                    <p className="text-sm text-gray-500">Thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-t border-red-200">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <p className="text-sm text-red-600">Error: {error}</p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                selectedTeamId
                  ? 'Type your message... (Press Enter to send)'
                  : 'Select a team first'
              }
              disabled={!selectedTeamId || loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-100"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!selectedTeamId || !input.trim() || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
