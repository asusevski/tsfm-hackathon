import Link from 'next/link';
import { sql } from '@vercel/postgres';
import FloatingTSFM from '../components/FloatingEmojiHTML';

interface EloData {
  id: number;
  model_id: string;
  team_name: string;
  elo: number;
  votes: number;
}

export default async function DataTable() {
  // Fetch data from Neon DB via Vercel Postgres
  const { rows } = await sql<EloData>`SELECT * FROM elo_ratings ORDER BY rating DESC`;

  // Map database fields to component props
  const data = rows.map(row => ({
    id: row.id,
    modelId: row.model_id,
    teamName: row.team_name,
    elo: row.elo,
    votes: row.votes,
  }));

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Floating TSFM Background */}
      <FloatingTSFM />
      
      {/* Navigation Tabs */}
      <nav className="relative z-20 backdrop-blur-xl bg-black/20 border-b border-white/10 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <Link
              href="/dashboard"
              className="px-3 py-4 text-sm font-medium text-white border-b-2 border-slate-400 backdrop-blur-sm"
            >
              Leaderboard
            </Link>
            <Link
              href="/voting"
              className="px-3 py-4 text-sm font-medium text-white/60 hover:text-white border-b-2 border-transparent hover:border-white/30 transition-colors backdrop-blur-sm"
            >
              Start Voting
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-20 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-5xl font-bold text-white mb-8">
              Leaderboard
            </h2>
            <p className="text-lg text-white/80 mb-8">
              {data.length} teams competing in the optimization landscape
            </p>
            
            {/* Glass Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Model ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Team Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      ELO Rating
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Votes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.map((row, index) => (
                    <tr key={row.modelId} className="hover:bg-white/5 transition-all duration-300">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-lg font-bold ${
                            index === 0 ? 'text-yellow-400' : 
                            index === 1 ? 'text-gray-300' : 
                            index === 2 ? 'text-amber-600' : 
                            'text-white/60'
                          }`}>
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono font-medium text-white/90">
                          {row.modelId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {row.teamName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-bold text-white">
                            {Math.round(row.elo)}
                          </span>
                          <div className="w-20 bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-slate-400 to-slate-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min((row.elo / 2000) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white/80">
                          {row.votes.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//import Link from 'next/link';
//import { sql } from '@vercel/postgres';
//import FloatingTSFM from '../components/FloatingEmojiHTML';
//
//import { useState, useEffect, useRef } from 'react';
//
//interface Team {
//  team_id: number;
//  team_name: string;
//  endpoint_url: string | null;
//}
//
//interface Message {
//  role: 'user' | 'assistant';
//  content: string;
//}
//
//export default function ChatPage() {
//  const [teams, setTeams] = useState<Team[]>([]);
//  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
//  const [messages, setMessages] = useState<Message[]>([]);
//  const [input, setInput] = useState('');
//  const [loading, setLoading] = useState(false);
//  const [error, setError] = useState<string | null>(null);
//  const messagesEndRef = useRef<HTMLDivElement>(null);
//
//  // Fetch teams on mount
//  useEffect(() => {
//    fetch('/api/teams')
//      .then(res => res.json())
//      .then(data => {
//        setTeams(data.teams || []);
//      })
//      .catch(err => {
//        console.error('Failed to fetch teams:', err);
//        setError('Failed to load teams');
//      });
//  }, []);
//
//  // Auto-scroll to bottom when messages change
//  useEffect(() => {
//    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//  }, [messages]);
//
//  const selectedTeam = teams.find(t => t.team_id === selectedTeamId);
//
//  const handleSendMessage = async () => {
//    if (!input.trim() || !selectedTeamId || loading) return;
//
//    const userMessage: Message = { role: 'user', content: input };
//    setMessages(prev => [...prev, userMessage]);
//    setInput('');
//    setLoading(true);
//    setError(null);
//
//    try {
//      const response = await fetch('/api/chat', {
//        method: 'POST',
//        headers: { 'Content-Type': 'application/json' },
//        body: JSON.stringify({
//          teamId: selectedTeamId,
//          prompt: input,
//        }),
//      });
//
//      if (!response.ok) {
//        const errorData = await response.json();
//        throw new Error(errorData.error || 'Failed to get response');
//      }
//
//      const data = await response.json();
//
//      // Handle different response formats - adjust based on what teams return
//      let assistantContent = '';
//      if (typeof data === 'string') {
//        assistantContent = data;
//      } else if (data.response) {
//        assistantContent = data.response;
//      } else if (data.text) {
//        assistantContent = data.text;
//      } else if (data.generated_text) {
//        assistantContent = data.generated_text;
//      } else {
//        assistantContent = JSON.stringify(data);
//      }
//
//      const assistantMessage: Message = {
//        role: 'assistant',
//        content: assistantContent,
//      };
//      setMessages(prev => [...prev, assistantMessage]);
//    } catch (err) {
//      console.error('Chat error:', err);
//      setError(err instanceof Error ? err.message : 'Failed to send message');
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  const handleKeyPress = (e: React.KeyboardEvent) => {
//    if (e.key === 'Enter' && !e.shiftKey) {
//      e.preventDefault();
//      handleSendMessage();
//    }
//  };
//
//  return (
//    <div className="relative min-h-screen bg-black overflow-hidden">
//      {/* Floating TSFM Background */}
//      <FloatingTSFM />
//
//      {/* Navigation Tabs */}
//      <nav className="relative z-20 backdrop-blur-xl bg-black/20 border-b border-white/10 shadow-lg">
//        <div className="max-w-6xl mx-auto px-4">
//          <div className="flex space-x-8">
//            <Link
//              href="/dashboard"
//              className="px-3 py-4 text-sm font-medium text-white border-b-2 border-slate-400 backdrop-blur-sm"
//            >
//              Leaderboard
//            </Link>
//            <Link
//              href="/voting"
//              className="px-3 py-4 text-sm font-medium text-white/60 hover:text-white border-b-2 border-transparent hover:border-white/30 transition-colors backdrop-blur-sm"
//            >
//              Start Voting
//            </Link>
//          </div>
//        </div>
//      </nav>
//
//      {/* Main Content */}
//      <div className="relative z-20 py-8 px-4">
//        <div className="max-w-6xl mx-auto">
//          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
//            <h2 className="text-5xl font-bold text-white mb-8">
//              Leaderboard
//            </h2>
//            <p className="text-lg text-white/80 mb-8">
//              {data.length} teams competing in the optimization landscape
//            </p>
//
//            {/* Glass Table */}
//            <div className="overflow-x-auto">
//              <table className="w-full">
//                <thead>
//                  <tr className="border-b border-white/10">
//                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
//                      Rank
//                    </th>
//                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
//                      Model ID
//                    </th>
//                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
//                      Team Name
//                    </th>
//                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
//                      ELO Rating
//                    </th>
//                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
//                      Votes
//                    </th>
//                  </tr>
//                </thead>
//                <tbody className="divide-y divide-white/5">
//                  {data.map((row, index) => (
//                    <tr key={row.modelId} className="hover:bg-white/5 transition-all duration-300">
//                      <td className="px-6 py-4 whitespace-nowrap">
//                        <div className="flex items-center">
//                          <span className={`text-lg font-bold ${
//                            index === 0 ? 'text-yellow-400' : 
//                            index === 1 ? 'text-gray-300' : 
//                            index === 2 ? 'text-amber-600' : 
//                            'text-white/60'
//                          }`}>
//                            #{index + 1}
//                          </span>
//                        </div>
//                      </td>
//                      <td className="px-6 py-4 whitespace-nowrap">
//                        <div className="text-sm font-mono font-medium text-white/90">
//                          {row.modelId}
//                        </div>
//                      </td>
//                      <td className="px-6 py-4 whitespace-nowrap">
//                        <div className="text-sm font-medium text-white">
//                          {row.teamName}
//                        </div>
//                      </td>
//                      <td className="px-6 py-4 whitespace-nowrap">
//                        <div className="flex items-center space-x-3">
//                          <span className="text-sm font-bold text-white">
//                            {Math.round(row.elo)}
//                          </span>
//                          <div className="w-20 bg-white/10 rounded-full h-2">
//                            <div 
//                              className="bg-gradient-to-r from-slate-400 to-slate-500 h-2 rounded-full transition-all duration-500"
//                              style={{ width: `${Math.min((row.elo / 2000) * 100, 100)}%` }}
//                            ></div>
//                          </div>
//                        </div>
//                      </td>
//                      <td className="px-6 py-4 whitespace-nowrap">
//                        <div className="text-sm font-medium text-white/80">
//                          {row.votes.toLocaleString()}
//                        </div>
//                      </td>
//                    </tr>
//                  ))}
//                </tbody>
//              </table>
//            </div>
//          )}
//          {selectedTeam && !selectedTeam.endpoint_url && (
//            <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
//              <p className="text-xs font-medium text-amber-700">
//                ⚠ This team has not submitted an endpoint yet
//              </p>
//            </div>
//          )}
//        </div>
//      </div>
//
//      {/* Chat Messages */}
//      <div className="flex-1 overflow-y-auto">
//        <div className="max-w-5xl mx-auto px-6 py-8">
//          {messages.length === 0 ? (
//            <div className="text-center mt-20">
//              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4">
//                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                </svg>
//              </div>
//              <p className="text-gray-600 text-lg font-medium">
//                {selectedTeamId
//                  ? 'Start a conversation by typing a message below'
//                  : 'Select a team to start chatting'}
//              </p>
//            </div>
//          ) : (
//            <div className="space-y-4">
//              {messages.map((msg, idx) => (
//                <div
//                  key={idx}
//                  className={`flex ${
//                    msg.role === 'user' ? 'justify-end' : 'justify-start'
//                  }`}
//                >
//                  <div
//                    className={`max-w-[75%] px-5 py-3.5 rounded-2xl shadow-md transition-all hover:shadow-lg ${
//                      msg.role === 'user'
//                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
//                        : 'bg-white border border-gray-200 text-gray-800'
//                    }`}
//                  >
//                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
//                  </div>
//                </div>
//              ))}
//              {loading && (
//                <div className="flex justify-start">
//                  <div className="max-w-[75%] px-5 py-3.5 rounded-2xl bg-white border border-gray-200 shadow-md">
//                    <div className="flex items-center gap-2">
//                      <div className="flex gap-1">
//                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//                      </div>
//                      <p className="text-sm text-gray-500 ml-1">Thinking...</p>
//                    </div>
//                  </div>
//                </div>
//              )}
//              <div ref={messagesEndRef} />
//            </div>
//          )}
//        </div>
//      </div>
//
//      {/* Error Display */}
//      {error && (
//        <div className="bg-red-50/80 backdrop-blur-sm border-t border-red-200 shadow-sm">
//          <div className="max-w-5xl mx-auto px-6 py-3">
//            <div className="flex items-center gap-2">
//              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//              </svg>
//              <p className="text-sm font-medium text-red-700">Error: {error}</p>
//            </div>
//          </div>
//        </div>
//      )}
//
//      {/* Input Area */}
//      <div className="bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-2xl">
//        <div className="max-w-5xl mx-auto px-6 py-5">
//          <div className="flex gap-3">
//            <textarea
//              value={input}
//              onChange={(e) => setInput(e.target.value)}
//              onKeyDown={handleKeyPress}
//              placeholder={
//                selectedTeamId
//                  ? 'Type your message... (Press Enter to send)'
//                  : 'Select a team first'
//              }
//              disabled={!selectedTeamId || loading}
//              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-400 transition-all bg-white text-gray-900 shadow-sm"
//              rows={2}
//            />
//            <button
//              onClick={handleSendMessage}
//              disabled={!selectedTeamId || !input.trim() || loading}
//              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none"
//            >
//              Send
//            </button>
//          </div>
//        </div>
//      </div>
//    </div>
//  );
//}
