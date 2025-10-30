'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import FloatingTSFM from '../components/FloatingEmojiHTML';

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
  const [activeTab, setActiveTab] = useState<'chat' | 'catalog'>('chat');
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

  const getModelDescription = (team: Team) => {
    if (team.endpoint_url) {
      return `This model is live and reachable at ${team.endpoint_url}.`;
    }

    return 'This team has not published a model description yet. Check back soon!';
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col">
      <FloatingTSFM />

      <nav className="relative z-20 backdrop-blur-xl bg-black/20 border-b border-white/10 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <Link
              href="/dashboard"
              className="px-3 py-4 text-sm font-medium text-white/60 hover:text-white border-b-2 border-transparent hover:border-white/30 transition-colors backdrop-blur-sm"
            >
              Visual Field
            </Link>
            <Link
              href="/chat"
              className="px-3 py-4 text-sm font-medium text-white border-b-2 border-slate-400 backdrop-blur-sm"
            >
              Team Chat
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-20 flex-1 px-4 py-8">
        <div className="mx-auto flex h-full max-w-6xl flex-col gap-6">
          <header className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-3">Team Interface</p>
                <h1 className="text-4xl font-semibold leading-tight text-white">
                  Team Model Chat
                </h1>
                <p className="mt-3 max-w-xl text-sm text-white/70">
                  Coordinate with teammates, share endpoints, and keep a single thread for every model update.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                <p className="font-semibold text-white/80">Quick tip</p>
                <p className="mt-1 leading-relaxed">
                  Tab over to the catalog to preview every team&apos;s deployment status before diving into a chat.
                </p>
              </div>
            </div>
            <div className="mt-8 inline-flex rounded-full bg-white/10 p-1 shadow-inner shadow-black/10">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-5 py-2 text-xs font-semibold uppercase tracking-wide rounded-full transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white text-black shadow-lg shadow-black/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={`px-5 py-2 text-xs font-semibold uppercase tracking-wide rounded-full transition-all ${
                  activeTab === 'catalog'
                    ? 'bg-white text-black shadow-lg shadow-black/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Model Catalog
              </button>
            </div>
          </header>

          {activeTab === 'chat' && (
            <section className="flex flex-1 flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div>
                <label htmlFor="team-selector" className="block text-xs font-semibold uppercase tracking-wide text-white/60 mb-3">
                  Select a team
                </label>
                <select
                  id="team-selector"
                  value={selectedTeamId ?? ''}
                  onChange={(e) => setSelectedTeamId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                >
                  <option value="" className="text-black">Choose a team</option>
                  {teams.map((team) => (
                    <option key={team.team_id} value={team.team_id} className="text-black">
                      {team.team_name}
                      {!team.endpoint_url && ' (No submission)'}
                    </option>
                  ))}
                </select>
                {selectedTeam && selectedTeam.endpoint_url && (
                  <div className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-200">
                    ✓ Endpoint: {selectedTeam.endpoint_url}
                  </div>
                )}
                {selectedTeam && !selectedTeam.endpoint_url && (
                  <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-medium text-amber-200">
                    ⚠ This team has not submitted an endpoint yet
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <div className="h-full overflow-y-auto px-6 py-8">
                  {messages.length === 0 ? (
                    <div className="mt-20 text-center">
                      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <svg className="h-8 w-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-white/70">
                        {selectedTeamId
                          ? 'Start a conversation by typing a message below.'
                          : 'Select a team to start chatting.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-lg shadow-black/20 transition ${
                              msg.role === 'user'
                                ? 'bg-gradient-to-br from-indigo-500 to-blue-500 text-white'
                                : 'bg-white/10 text-white/90 border border-white/10'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="max-w-[75%] rounded-2xl border border-white/10 bg-white/10 px-5 py-3.5 text-sm text-white/70">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="h-2 w-2 animate-bounce rounded-full bg-white/50" style={{ animationDelay: '0ms' }} />
                                <div className="h-2 w-2 animate-bounce rounded-full bg-white/50" style={{ animationDelay: '150ms' }} />
                                <div className="h-2 w-2 animate-bounce rounded-full bg-white/50" style={{ animationDelay: '300ms' }} />
                              </div>
                              <p className="text-xs uppercase tracking-wide text-white/40">Thinking...</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  Error: {error}
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-black/60 p-4 shadow-[0_20px_60px_-30px_rgba(15,15,15,0.8)]">
                <div className="flex flex-col gap-3 sm:flex-row">
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
                    className="h-24 flex-1 resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/25 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/30"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!selectedTeamId || !input.trim() || loading}
                    className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-white/80 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'catalog' && (
            <section className="flex-1 space-y-10 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="text-center">
                <h2 className="text-3xl font-semibold text-white">Explore the hackathon models</h2>
                <p className="mt-2 text-sm text-white/60">
                  Browse each team&apos;s submission and jump straight into a conversation.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {teams.length === 0 ? (
                  <div className="sm:col-span-2">
                    <div className="rounded-2xl border border-dashed border-white/20 bg-black/50 p-8 text-center text-sm text-white/50">
                      Team information is loading. Please check back shortly.
                    </div>
                  </div>
                ) : (
                  teams.map((team) => (
                    <div
                      key={team.team_id}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/50 p-6 shadow-lg shadow-black/40 transition hover:border-white/30 hover:bg-black/40"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{team.team_name}</h3>
                          <p className="mt-1 text-xs text-white/40">Team #{team.team_id}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          team.endpoint_url ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/40' : 'bg-amber-400/20 text-amber-100 border border-amber-300/40'
                        }`}>
                          {team.endpoint_url ? 'Live' : 'Coming Soon'}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{getModelDescription(team)}</p>
                      <div className="mt-auto flex flex-wrap gap-2">
                        {team.endpoint_url && (
                          <a
                            href={team.endpoint_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                          >
                            View Endpoint
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTeamId(team.team_id);
                            setActiveTab('chat');
                          }}
                          className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-black transition hover:bg-white/80"
                        >
                          Chat with this model
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
