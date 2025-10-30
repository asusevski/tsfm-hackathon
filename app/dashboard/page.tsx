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
