'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BoxesPage() {
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <Link
              href="/"
              className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
            >
              Leaderboard
            </Link>
            <Link
              href="/voting"
              className="px-3 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600"
            >
              Start Voting
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Choose a Box</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1 */}
            <button
              onClick={() => setSelectedBox('box1')}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  Completion One
                </h2>
                <p className="text-gray-600">
                  *LLM completion one*
                </p>
              </div>
            </button>

            {/* Box 2 */}
            <button
              onClick={() => setSelectedBox('box2')}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  Completion Two
                </h2>
                <p className="text-gray-600">
                  *LLM completion two*
                </p>
              </div>
            </button>
          </div>

          {/* Selection Display */}
          {selectedBox && (
            <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-lg text-blue-900">
                You selected: <span className="font-bold">
                  {selectedBox === 'box1' ? 'Box One' : 'Box Two'}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
