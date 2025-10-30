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
                Hackathon
              </h2>
              <div className="space-y-4 text-white/70 text-lg">
                <p>
                  One week of creativity, code, and collaboration. Train an LLM from scratch,
                  experiment with multimodal and inference tools, and showcase your build to
                  the entire TSFM cohort.
                </p>
                <p className="text-white/50 text-sm uppercase tracking-wider">
                  Scroll to explore the challenge
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="min-h-screen flex items-center justify-end px-8 py-20">
          <div className="max-w-2xl">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-5xl font-bold text-white mb-8">
                Hackathon Overview
              </h2>
              <div className="space-y-6 text-white/80 text-lg leading-relaxed">
                <p>
                  Form teams of up to four (yes, friends outside TSFM are welcome) and start
                  from the nanochat baseline to complete a pre-training run entirely from
                  scratch. Push beyond the baseline if you are feeling ambitious—vision,
                  post-training, or additional modalities are all fair game, just coordinate
                  with the organizers so we can feature it properly.
                </p>
                <p>
                  Final submissions are due Sunday afternoon. We will gather on Sunday,
                  November 9th at New Stadium to demo every project and celebrate what each
                  team shipped.
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
                Core Requirements
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Baseline Run</h3>
                    <p className="text-white/70 text-base leading-relaxed">
                      Complete a pre-training run starting from the nanochat repo. Document
                      what you trained, how you trained it, and the dataset recipe you used.
                    </p>
                  </div>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Modal Endpoint</h3>
                    <p className="text-white/70 text-base leading-relaxed">
                      With help from sponsor Modal, stand up a `/generate` endpoint so anyone
                      can try your pretrained model during the showcase.
                    </p>
                  </div>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Stretch Work</h3>
                    <p className="text-white/70 text-base leading-relaxed">
                      Post-training, RLHF, or multimodal additions are encouraged extras.
                      Loop us in early so we can feature the work in the showcase gallery.
                    </p>
                  </div>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Resource Planning</h3>
                    <p className="text-white/70 text-base leading-relaxed">
                      Modal credits are limited—budget your runs and serving costs so you can
                      deliver a smooth demo on Sunday.
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
                Key Logistics
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Timeline</h3>
                  <p className="text-white/70 text-lg leading-relaxed">
                    Kickoff today, submit by Sunday afternoon. Demos and celebration happen
                    Sunday evening at New Stadium with the whole TSFM cohort.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Teams</h3>
                  <p className="text-white/70 text-lg leading-relaxed">
                    Up to four builders per team. Collaborators outside TSFM are allowed,
                    just make sure your submission is ready for the group showcase.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Guidelines</h3>
                  <p className="text-white/70 text-lg leading-relaxed">
                    Read the full ruleset for training and showcasing so your project checks
                    every box. Reach out to organizers if anything is unclear.
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
                Ready to Ship
              </h2>
              <p className="text-lg text-white/80 mb-12 leading-relaxed">
                Everything you need to know—from compute budgets to submission formats—is
                captured in the rules doc. Lock in your plan, sync with your team, and start
                training.
              </p>
              
              <div className="space-y-6">
                <Button 
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6 rounded-xl font-bold"
                  asChild
                >
                  <Link href="/chat">
                    Join the Workspace
                  </Link>
                </Button>
                
                <div className="text-sm text-white/50">
                  Already set?{' '}
                  <Link href="/login" className="text-white hover:text-white/80 ml-1 underline">
                    Sign in
                  </Link>
                  {' '}or review the{' '}
                  <Link 
                    href="https://gist.github.com/asusevski/af4d2c15ea8cfb891a7ebf2813840c0b"
                    className="text-white hover:text-white/80 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    full rules
                  </Link>.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
