import Link from 'next/link';
import FloatingTSFM from '../components/FloatingEmojiHTML';

export default function ModelDashboard() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <FloatingTSFM />

      <nav className="relative z-20 backdrop-blur-xl bg-black/20 border-b border-white/10 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <Link
              href="/dashboard"
              className="px-3 py-4 text-sm font-medium text-white border-b-2 border-slate-400 backdrop-blur-sm"
            >
              Visual Field
            </Link>
            <Link
              href="/chat"
              className="px-3 py-4 text-sm font-medium text-white/60 hover:text-white border-b-2 border-transparent hover:border-white/30 transition-colors backdrop-blur-sm"
            >
              Team Chat
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-20 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-5xl font-bold text-white mb-4">
              Visual Field
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-3xl">
              Slow down, breathe, and get inspired before diving back into the build. This space is for the visuals, the mood, and a reminder of why we are experimenting in the first place.
            </p>

            <div className="grid gap-6 md:grid-cols-2 mb-12">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold text-white mb-4">Sketch the Landscape</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Capture ideas, aesthetic references, or teaser shots of what you are building. The dashboard stays free of structured data so the focus stays on the vibe.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold text-white mb-4">Prototype Quickly</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  When you are ready for feedback or testing, jump into the chat. The live coordination happens there; the dashboard is just your visual launchpad.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-white/70 text-sm max-w-xl">
                Ready to ship a new experiment or iterate with your team? Head over to the chat when you want to share endpoints, logs, or anything structured.
              </div>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition-colors hover:border-white/40 hover:text-white"
              >
                Jump to Team Chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
