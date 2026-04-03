import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { guides } from '@/data/guides';

export default function Guides() {
  useSeoMeta({
    title: 'Privacy Guides - 0xPrivacy.online',
    description: 'Step-by-step guides for Tor, Monero, Nostr, threat modeling, and more. Written for humans, not robots.',
  });

  return (
    <SiteLayout>
      {/* Header */}
      <section className="pt-12 pb-8 border-b border-[#00ff9f]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-[#00ff9f]/40 uppercase tracking-widest mb-2">
            // knowledge base
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            Privacy <span className="text-[#00ff9f]">Guides</span>
          </h1>
          <p className="text-sm text-white/40 max-w-2xl">
            Step-by-step tutorials to take back your digital life. From beginner basics to advanced operational security.
            Written by cypherpunks, for everyone.
          </p>
        </div>
      </section>

      {/* Guides list */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {guides.map((guide, i) => (
              <Link
                key={guide.id}
                to={`/guides/${guide.id}`}
                className="group block p-6 border border-[#00ff9f]/10 rounded-lg bg-white/[0.01] hover:bg-[#00ff9f]/[0.03] hover:border-[#00ff9f]/25 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg border border-[#00ff9f]/20 flex items-center justify-center shrink-0 bg-[#00ff9f]/5 group-hover:bg-[#00ff9f]/10 transition-all">
                    <span className="font-mono text-sm text-[#00ff9f]/60 font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-mono rounded border ${
                        guide.difficulty === 'beginner'
                          ? 'text-green-400/70 border-green-400/20 bg-green-400/5'
                          : guide.difficulty === 'intermediate'
                            ? 'text-yellow-400/70 border-yellow-400/20 bg-yellow-400/5'
                            : 'text-red-400/70 border-red-400/20 bg-red-400/5'
                      }`}>
                        {guide.difficulty}
                      </span>
                      <span className="text-[10px] font-mono text-white/20">{guide.category}</span>
                    </div>

                    <h2 className="text-lg font-bold text-white group-hover:text-[#00ff9f] transition-colors mb-1">
                      {guide.title}
                    </h2>
                    <p className="text-xs text-white/40 leading-relaxed mb-3">
                      {guide.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-[10px] text-white/30 font-mono">
                        <Clock className="w-3 h-3" /> {guide.readTime}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-white/30 font-mono">
                        <BookOpen className="w-3 h-3" /> {guide.tags.length} topics
                      </span>
                      <span className="ml-auto flex items-center gap-1 text-xs text-[#00ff9f]/40 group-hover:text-[#00ff9f] transition-colors font-mono">
                        Read <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Coming soon hint */}
          <div className="mt-8 p-6 border border-dashed border-[#00ff9f]/10 rounded-lg text-center">
            <p className="text-sm text-white/30 mb-1">More guides in the pipeline.</p>
            <p className="text-xs text-white/20 font-mono">
              Want to contribute? Check the <Link to="/community" className="text-[#00ff9f]/40 hover:text-[#00ff9f] transition-colors underline">Community</Link> page.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
