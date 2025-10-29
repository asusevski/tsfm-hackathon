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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Team Model Chat
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Select a team and start chatting with their AI model
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Team Selector */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <label htmlFor="team-select" className="block text-sm font-semibold text-gray-700 mb-2">
            Select Team
          </label>
          <select
            id="team-select"
            value={selectedTeamId || ''}
            onChange={(e) => {
              setSelectedTeamId(Number(e.target.value) || null);
              setMessages([]);
              setError(null);
            }}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 font-medium shadow-sm hover:border-gray-300"
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
            <div className="mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs font-medium text-green-700">
                ✓ Endpoint: {selectedTeam.endpoint_url}
              </p>
            </div>
          )}
          {selectedTeam && !selectedTeam.endpoint_url && (
            <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-medium text-amber-700">
                ⚠ This team has not submitted an endpoint yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="text-center mt-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium">
                {selectedTeamId
                  ? 'Start a conversation by typing a message below'
                  : 'Select a team to start chatting'}
              </p>
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
                    className={`max-w-[75%] px-5 py-3.5 rounded-2xl shadow-md transition-all hover:shadow-lg ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] px-5 py-3.5 rounded-2xl bg-white border border-gray-200 shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <p className="text-sm text-gray-500 ml-1">Thinking...</p>
                    </div>
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
        <div className="bg-red-50/80 backdrop-blur-sm border-t border-red-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-red-700">Error: {error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-2xl">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex gap-3">
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
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-400 transition-all bg-white text-gray-900 shadow-sm"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!selectedTeamId || !input.trim() || loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
