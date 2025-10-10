export default function DataTable() {
  // Hardcoded data - replace with Vercel Postgres query later
  const data = [
    { id: 1, modelId: 'gpt-4', teamName: 'Team Alpha', elo: 1523, votes: 342 },
    { id: 2, modelId: 'claude-3', teamName: 'Team Beta', elo: 1487, votes: 298 },
    { id: 3, modelId: 'gemini-pro', teamName: 'Team Gamma', elo: 1501, votes: 315 },
    { id: 4, modelId: 'llama-2', teamName: 'Team Delta', elo: 1456, votes: 267 },
    { id: 5, modelId: 'mistral-7b', teamName: 'Team Epsilon', elo: 1512, votes: 289 },
    { id: 6, modelId: 'gpt-5', teamName: 'Team Zeta', elo: 9999, votes: 289 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-800">Data Table</h1>
            <p className="text-sm text-gray-600 mt-1">
              {data.length} total records
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ELO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    # Votes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.modelId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.modelId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.teamName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.elo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.votes.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
