'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to dashboard (leaderboard and voting)
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-white/60">
                Continue your journey through the landscape
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/80 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none transition-all text-white placeholder-white/40"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90 text-lg py-3 rounded-lg font-bold"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                New to the landscape?{' '}
                <Link href="/" className="text-white hover:text-white/80 font-medium">
                  Return to Homepage
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
