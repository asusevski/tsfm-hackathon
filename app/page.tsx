'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LossLandscape3D from './components/LossLandscape';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-black">
      {/* 3D Loss Landscape Background */}
      <div className="fixed inset-0 z-0">
        <LossLandscape3D scrollProgress={scrollProgress} />
      </div>

      {/* Content Sections */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-start justify-start px-8 pt-20">
          <div className="max-w-2xl">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
              <h1 className="text-7xl md:text-9xl font-black text-white mb-6 leading-none">
                TSFM
              </h1>
              <h2 className="text-3xl md:text-5xl font-light text-white/80 mb-8">
                HACKATHON
              </h2>
              <p className="text-lg text-white/60 mb-8 max-w-md">
              A week long hackathon to build, play and develop models from scratch.
              </p>
              <div className="text-sm text-white/40 uppercase tracking-wider">
                Scroll to explore
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="min-h-screen flex items-center justify-end px-8 py-20">
          <div className="max-w-2xl">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-5xl font-bold text-white mb-8">
                The Landscape
              </h2>
              <div className="space-y-6 text-white/80">
                <p className="text-lg leading-relaxed">
                  This rugged terrain represents the complex optimization landscape 
                  of machine learning. Each peak, valley, and ridge tells a story 
                  of convergence, divergence, and the search for global minima.
                </p>
                <p className="text-lg leading-relaxed">

                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Section */}
        <section className="min-h-screen flex items-start justify-start px-8 py-20">
          <div className="max-w-4xl">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-5xl font-bold text-white mb-12">
                Topics
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Pre-training</h3>
                    <p className="text-white/70">
         NA
                    </p>
                  </div>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Post-training</h3>
                    <p className="text-white/70">
                    NA
                    </p>
                  </div>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Evaluation</h3>
                    <p className="text-white/70">
                    NA
                    </p>
                  </div>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Inference</h3>
                    <p className="text-white/70">
NA
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Competition Section */}
        <section className="min-h-screen flex items-center justify-end px-8 py-20">
          <div className="max-w-2xl">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-5xl font-bold text-white mb-8">
                Competition
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">48 Hours</h3>
                  <p className="text-white/70 text-lg">
                    Intense coding, collaboration, and innovation. 
                    Navigate the landscape of possibilities.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Prizes</h3>
                  <p className="text-white/70 text-lg">
                    Substantial rewards for those who conquer the terrain. 
                    Cash, mentorship, and recognition await.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Community</h3>
                  <p className="text-white/70 text-lg">
                    Connect with fellow explorers. Build lasting 
                    relationships in the landscape of innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="min-h-screen flex items-start justify-start px-8 py-20">
          <div className="max-w-2xl">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-5xl font-bold text-white mb-8">
                Begin Your Journey
              </h2>
              <p className="text-lg text-white/80 mb-12 leading-relaxed">
                The landscape awaits. Every peak conquered, every valley navigated 
                brings you closer to the global minimum. Your optimization 
                journey starts here.
              </p>
              
              <div className="space-y-6">
                <Button 
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6 rounded-xl font-bold"
                  asChild
                >
                  <Link href="/chat">
                    Enter Competition
                  </Link>
                </Button>
                
                <div className="text-sm text-white/50">
                  Already navigating? 
                  <Link href="/login" className="text-white hover:text-white/80 ml-1 underline">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
