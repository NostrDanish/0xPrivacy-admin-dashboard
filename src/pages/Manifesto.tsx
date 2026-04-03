import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import { SiteLayout } from '@/components/layout/SiteLayout';

export default function Manifesto() {
  useSeoMeta({
    title: 'The Manifesto - 0xPrivacy.online',
    description: 'We are done watching governments, corporations, and surveillance machines strip away our fundamental right to privacy. Break the Digital Cage.',
  });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative pt-16 pb-8 overflow-hidden isolate">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00ff9f]/[0.04] via-transparent to-transparent" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-[#00ff9f]/60" />
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-[1.1]">
            The <span className="text-[#00ff9f] glow-green">Manifesto</span>
          </h1>
          <p className="font-mono text-xs text-[#00ff9f]/40 uppercase tracking-widest">
            // 0xPrivacy.online declaration
          </p>
        </div>
      </section>

      {/* Manifesto content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="space-y-8">
            {/* Opening */}
            <div className="relative p-8 border border-[#00ff9f]/10 rounded-lg bg-[#00ff9f]/[0.02]">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00ff9f]/40" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00ff9f]/40" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00ff9f]/40" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00ff9f]/40" />
              <p className="text-xl sm:text-2xl text-white/90 leading-relaxed font-light">
                We are done watching governments, corporations, and surveillance machines strip away our fundamental right
                to exist without being tracked, profiled, and monetized.
              </p>
              <p className="text-xl sm:text-2xl text-[#00ff9f] leading-relaxed font-medium mt-4">
                Privacy is not a privilege. It is a human right.
              </p>
            </div>

            {/* Body paragraphs */}
            <div className="space-y-6 text-white/60 leading-relaxed">
              <p>
                Every click you make is logged. Every message scanned. Every purchase profiled. Every location tracked.
                You did not consent to this. No one asked. The surveillance machine was built while you were sleeping,
                and now it runs on autopilot - feeding your life to algorithms that decide what you see, what you buy,
                what you believe, and ultimately, who you are allowed to be.
              </p>

              <p>
                <span className="text-[#00ff9f] font-semibold">We reject this reality.</span>
              </p>

              <p>
                We are builders, thinkers, and rebels who believe in a world where digital communication is private by default.
                Where financial transactions cannot be surveilled or censored. Where your identity belongs to you and no one else.
                Where information flows freely and cannot be erased by those in power.
              </p>

              <h2 className="text-2xl font-bold text-white pt-4">What We Stand For</h2>

              <div className="space-y-4 pl-4 border-l-2 border-[#00ff9f]/20">
                <div>
                  <h3 className="text-sm font-bold text-[#00ff9f] mb-1">Privacy as Default</h3>
                  <p className="text-sm">
                    Privacy should never be an opt-in feature hidden behind premium plans.
                    It must be the foundation, not the afterthought.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#00ff9f] mb-1">Decentralization Over Control</h3>
                  <p className="text-sm">
                    No single entity should have the power to censor, surveil, or control the flow of information.
                    We build on protocols, not platforms.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#00ff9f] mb-1">Open Source or Bust</h3>
                  <p className="text-sm">
                    If you cannot audit the code, you cannot trust the tool. Every recommendation we make
                    is open-source and verifiable. Trust is earned through transparency.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#00ff9f] mb-1">Knowledge is Unstoppable</h3>
                  <p className="text-sm">
                    When guides get taken down, we mirror them on IPFS. When videos get censored,
                    we pin them to the distributed web. Knowledge, once shared, cannot be destroyed.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#00ff9f] mb-1">Community Over Corporation</h3>
                  <p className="text-sm">
                    0xPrivacy has no CEO, no investors, no shareholders. This project belongs to everyone
                    who contributes. Your reputation is your NIP-05, your Nostr badges, your track record of building.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white pt-4">The Tools of Liberation</h2>

              <p>
                We do not just complain. We build. We deploy. We teach.
              </p>

              <p>
                <strong className="text-white">Tor</strong> for anonymous browsing.{' '}
                <strong className="text-white">Monero</strong> for untraceable transactions.{' '}
                <strong className="text-white">Nostr</strong> for censorship-proof communication.{' '}
                <strong className="text-white">SimpleX</strong> for private messaging without phone numbers.{' '}
                <strong className="text-white">IPFS</strong> for content that cannot be taken down.{' '}
                <strong className="text-white">Tails</strong> for leaving no trace.{' '}
                <strong className="text-white">GrapheneOS</strong> for a phone that actually works for you.
              </p>

              <p>
                These are not products. They are weapons of mass liberation.
              </p>

              <h2 className="text-2xl font-bold text-white pt-4">The Call</h2>

              <p>
                If you are a developer, build tools that protect. If you are a writer, document the path.
                If you are a user, learn, practice, and teach others. The surveillance machine is powerful,
                but it is not inevitable.
              </p>

              <p>
                Every person who encrypts their email is a victory. Every family that switches to a private messenger
                is a breach in the wall. Every transaction made in Monero is a vote for financial freedom.
              </p>

              <div className="relative p-6 mt-8 border border-[#00ff9f]/20 rounded-lg bg-[#00ff9f]/[0.03]">
                <p className="text-lg sm:text-xl text-white font-bold leading-relaxed text-center">
                  We do not ask permission to be free.
                  <br />
                  <span className="text-[#00ff9f] glow-green">We build the tools and walk through the wall.</span>
                </p>
              </div>

              <p className="text-center text-sm text-white/40 pt-4">
                This is 0xPrivacy. This is the rebellion.
              </p>

              <p className="text-center font-mono text-lg text-[#00ff9f] font-bold pt-2">
                Break the Digital Cage.
              </p>
            </div>
          </article>

          {/* Bottom CTA */}
          <div className="mt-16 pt-8 border-t border-[#00ff9f]/10 text-center">
            <p className="text-sm text-white/30 mb-6">Ready to take the first step?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/tools"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#00ff9f] text-black font-bold text-sm rounded transition-all hover:bg-[#00ff9f]/90 hover:shadow-[0_0_30px_rgba(0,255,159,0.3)]"
              >
                Explore the Tools
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/community"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#00ff9f]/30 text-[#00ff9f] font-bold text-sm rounded transition-all hover:bg-[#00ff9f]/5 hover:border-[#00ff9f]/50"
              >
                Join the Scouts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
