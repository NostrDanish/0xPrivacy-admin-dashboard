import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import {
  Shield, Globe, Zap, MessageCircle, Lock, Eye, ArrowRight,
  ChevronRight, ExternalLink, Fingerprint, Database, Radio, ShieldCheck,
} from 'lucide-react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { tools, featuredCollections } from '@/data/tools';
import { useEffect, useRef, useState } from 'react';
import { useMixedFeed } from '@/hooks/usePrivacyFeed';
import { PostCard, PostCardSkeleton } from '@/components/feed/PostCard';

const heroToolIcons = [
  { Icon: Shield, label: 'Tor', delay: 0 },
  { Icon: Lock, label: 'Monero', delay: 0.5 },
  { Icon: Zap, label: 'Nostr', delay: 1 },
  { Icon: MessageCircle, label: 'SimpleX', delay: 1.5 },
  { Icon: Eye, label: 'Mullvad', delay: 2 },
  { Icon: Globe, label: 'IPFS', delay: 2.5 },
];

const quickTools = tools.slice(0, 6);

const privacyPulseFeeds = [
  {
    title: 'Electronic Frontier Foundation',
    url: 'https://www.eff.org/',
    description: 'Defending digital privacy, free speech, and innovation',
    icon: '\\u26A1',
  },
  {
    title: 'PrivacyGuides.org',
    url: 'https://www.privacyguides.org/',
    description: 'Unbiased, community-driven privacy tool recommendations',
    icon: '\\uD83D\\uDEE1\\uFE0F',
  },
  {
    title: 'Tor Project Blog',
    url: 'https://blog.torproject.org/',
    description: 'Updates from the frontline of anonymous browsing',
    icon: '\\uD83E\\uDDE5',
  },
  {
    title: 'The Hated One (YouTube)',
    url: 'https://www.youtube.com/@TheHatedOne',
    description: 'Privacy deep dives and surveillance exposures',
    icon: '\\uD83C\\uDFA5',
  },
  {
    title: 'Monero Research Lab',
    url: 'https://www.getmonero.org/resources/research-lab/',
    description: 'Cutting-edge cryptographic privacy research',
    icon: '\\uD83D\\uDD2C',
  },
];

function TypingText({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="animate-pulse text-[#00ff9f]">|</span>}
    </span>
  );
}

function AnimateOnScroll({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function getToolIcon(iconName: string) {
  const iconMap: Record<string, React.ReactNode> = {
    onion: <Globe className="w-5 h-5" />,
    coins: <Database className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
    'message-circle': <MessageCircle className="w-5 h-5" />,
    shield: <Shield className="w-5 h-5" />,
    laptop: <Fingerprint className="w-5 h-5" />,
    mail: <MessageCircle className="w-5 h-5" />,
    lock: <Lock className="w-5 h-5" />,
    globe: <Globe className="w-5 h-5" />,
    'eye-off': <Eye className="w-5 h-5" />,
    radio: <MessageCircle className="w-5 h-5" />,
    smartphone: <Fingerprint className="w-5 h-5" />,
  };
  return iconMap[iconName] || <Shield className="w-5 h-5" />;
}

// ── Live feed preview widget for homepage ────────────────────────────────────
function LiveFeedPreview() {
  const { data: events, isLoading } = useMixedFeed(6);

  return (
    <section className="py-20 relative border-t border-[#00ff9f]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
                <p className="font-mono text-xs text-[#00ff9f]/50 uppercase tracking-widest">
                  // live nostr stream
                </p>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Privacy <span className="text-[#00ff9f]">Feed</span>
              </h2>
              <p className="mt-1 text-sm text-white/40">
                Real-time dispatches from verified sources and the cypherpunk community.
              </p>
            </div>
            <Link
              to="/feed"
              className="flex items-center gap-2 px-5 py-2.5 border border-[#00ff9f]/25 rounded text-sm font-mono text-[#00ff9f]/70 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5 hover:border-[#00ff9f]/50 transition-all"
            >
              <Radio className="w-3.5 h-3.5" />
              Open Live Feed
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <AnimateOnScroll key={i} delay={i * 0.05}>
                  <PostCardSkeleton compact />
                </AnimateOnScroll>
              ))
            : (events ?? []).slice(0, 6).map((event, i) => (
                <AnimateOnScroll key={event.id} delay={i * 0.05}>
                  <PostCard event={event} compact />
                </AnimateOnScroll>
              ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/feed"
            className="inline-flex items-center gap-2 text-sm font-mono text-[#00ff9f]/50 hover:text-[#00ff9f] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            View full feed with verified sources
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const Index = () => {
  useSeoMeta({
    title: '0xPrivacy.online - Break the Digital Cage',
    description: 'Your hub for real privacy tools, guides, and decentralized IPFS mirrors. Tor, Monero, Nostr, SimpleX and more. Community-owned. No tracking.',
  });

  return (
    <SiteLayout>
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden isolate">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          {/* Radial gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#00ff9f]/[0.03] via-transparent to-transparent" />

          {/* Floating grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00ff9f" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Scan line */}
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00ff9f]/20 to-transparent animate-scan" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          {/* Terminal-style pre-text */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00ff9f]/5 border border-[#00ff9f]/20 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#00ff9f] rounded-full animate-pulse" />
              <span className="font-mono text-xs text-[#00ff9f]/70 tracking-wider">SYSTEM ACTIVE // NODE ONLINE</span>
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="text-white">Break the</span>
            <br />
            <span className="text-[#00ff9f] glow-green">Digital Cage</span>
          </h1>

          {/* Subtitle with typing effect */}
          <div className="mb-8 h-8">
            <TypingText
              text="Your keys. Your data. Your freedom. No exceptions."
              className="text-lg sm:text-xl text-white/50 font-mono"
            />
          </div>

          {/* Floating tool icons */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-10">
            {heroToolIcons.map(({ Icon, label, delay }) => (
              <div
                key={label}
                className="group relative animate-float"
                style={{ animationDelay: `${delay}s` }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-[#00ff9f]/20 bg-[#00ff9f]/5 flex items-center justify-center transition-all group-hover:border-[#00ff9f]/50 group-hover:bg-[#00ff9f]/10 group-hover:scale-110">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#00ff9f]/60 group-hover:text-[#00ff9f] transition-colors" />
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/tools"
              className="group flex items-center gap-2 px-8 py-3.5 bg-[#00ff9f] text-black font-bold text-sm rounded transition-all hover:bg-[#00ff9f]/90 hover:shadow-[0_0_30px_rgba(0,255,159,0.3)]"
            >
              Explore Privacy Tools
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/feed"
              className="flex items-center gap-2 px-8 py-3.5 border border-[#00ff9f]/30 text-[#00ff9f] font-bold text-sm rounded transition-all hover:bg-[#00ff9f]/5 hover:border-[#00ff9f]/50"
            >
              <Radio className="w-4 h-4" />
              Live Feed
            </Link>
            <Link
              to="/manifesto"
              className="flex items-center gap-2 px-6 py-3.5 border border-white/10 text-white/50 text-sm rounded transition-all hover:bg-white/5 hover:text-white/70"
            >
              Read the Manifesto
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-5 h-8 rounded-full border border-[#00ff9f]/20 flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-[#00ff9f]/40 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MANIFESTO EXCERPT ==================== */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="relative p-8 sm:p-12 border border-[#00ff9f]/10 rounded-lg bg-[#00ff9f]/[0.02]">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00ff9f]/40" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00ff9f]/40" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00ff9f]/40" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00ff9f]/40" />

              <p className="font-mono text-xs text-[#00ff9f]/40 uppercase tracking-widest mb-4">
                // from the manifesto
              </p>
              <blockquote className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed font-light">
                &quot;We are done watching governments, corporations, and surveillance machines strip away our fundamental right to exist without being tracked, profiled, and monetized.
                <span className="text-[#00ff9f] font-medium"> Privacy is not a privilege. It is a human right.</span>&quot;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-[#00ff9f]/20 to-transparent" />
                <Link
                  to="/manifesto"
                  className="text-xs font-mono text-[#00ff9f]/60 hover:text-[#00ff9f] transition-colors flex items-center gap-1"
                >
                  Read full manifesto <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ==================== QUICK TOOL GRID ==================== */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="font-mono text-xs text-[#00ff9f]/40 uppercase tracking-widest mb-2">
                  // essential arsenal
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  Privacy <span className="text-[#00ff9f]">Tools</span>
                </h2>
              </div>
              <Link
                to="/tools"
                className="hidden sm:flex items-center gap-1 text-sm text-[#00ff9f]/60 hover:text-[#00ff9f] transition-colors font-mono"
              >
                View all tools <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickTools.map((tool, i) => (
              <AnimateOnScroll key={tool.id} delay={i * 0.1}>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 border border-[#00ff9f]/10 rounded-lg bg-white/[0.01] hover:bg-[#00ff9f]/[0.03] hover:border-[#00ff9f]/25 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded border border-[#00ff9f]/20 flex items-center justify-center text-[#00ff9f]/60 group-hover:text-[#00ff9f] group-hover:border-[#00ff9f]/40 transition-all shrink-0">
                      {getToolIcon(tool.icon)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white group-hover:text-[#00ff9f] transition-colors text-sm">
                          {tool.name}
                        </h3>
                        <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-[#00ff9f]/40 transition-colors" />
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">{tool.tagline}</p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-mono rounded border ${
                          tool.difficulty === 'beginner'
                            ? 'text-green-400/70 border-green-400/20 bg-green-400/5'
                            : tool.difficulty === 'intermediate'
                              ? 'text-yellow-400/70 border-yellow-400/20 bg-yellow-400/5'
                              : 'text-red-400/70 border-red-400/20 bg-red-400/5'
                        }`}>
                          {tool.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </AnimateOnScroll>
            ))}
          </div>

          <div className="mt-6 sm:hidden text-center">
            <Link
              to="/tools"
              className="inline-flex items-center gap-1 text-sm text-[#00ff9f]/60 hover:text-[#00ff9f] transition-colors font-mono"
            >
              View all tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED COLLECTIONS ==================== */}
      <section className="py-16 relative border-t border-[#00ff9f]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="mb-8">
              <p className="font-mono text-xs text-[#00ff9f]/40 uppercase tracking-widest mb-2">
                // curated collections
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Featured <span className="text-[#00ff9f]">Arsenals</span>
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredCollections.map((collection, i) => (
              <AnimateOnScroll key={collection.id} delay={i * 0.1}>
                <Link
                  to="/tools"
                  className="group block p-5 sm:p-6 border rounded-lg transition-all relative overflow-hidden isolate"
                  style={{
                    borderColor: `${collection.accentColor}15`,
                    background: `linear-gradient(135deg, ${collection.accentColor}04, transparent)`,
                  }}
                >
                  {/* Decorative glow */}
                  <div
                    className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-[60px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundColor: collection.accentColor, opacity: 0.05 }}
                  />

                  <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: `${collection.accentColor}60` }}>
                    {collection.subtitle}
                  </p>
                  <h3 className="text-lg font-bold text-white group-hover:brightness-110 transition-all mb-1" style={{ color: collection.accentColor }}>
                    {collection.title}
                  </h3>
                  <p className="text-xs text-white/35 leading-relaxed mb-3 line-clamp-2">
                    {collection.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-white/20">{collection.toolIds.length} tools</span>
                    <span className="ml-auto flex items-center gap-1 text-xs font-mono transition-colors" style={{ color: `${collection.accentColor}60` }}>
                      Explore <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== LIVE NOSTR FEED PREVIEW ==================== */}
      <LiveFeedPreview />

      {/* ==================== QUICK LINKS BANNER ==================== */}
      <section className="py-16 relative border-t border-[#00ff9f]/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link
                to="/feed"
                className="group p-5 border border-[#00ff9f]/15 rounded-lg bg-white/[0.01] hover:bg-[#00ff9f]/[0.04] hover:border-[#00ff9f]/40 transition-all text-center relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg border border-[#00ff9f]/25 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-[#00ff9f]/60 group-hover:text-[#00ff9f] transition-colors" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">Live Feed</h3>
                <p className="text-xs text-white/40">Nostr stream</p>
              </Link>

              <Link
                to="/guides"
                className="group p-5 border border-[#00ff9f]/10 rounded-lg bg-white/[0.01] hover:bg-[#00ff9f]/[0.03] hover:border-[#00ff9f]/25 transition-all text-center"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg border border-[#00ff9f]/20 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-[#00ff9f]/60 group-hover:text-[#00ff9f] transition-colors" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">Guides</h3>
                <p className="text-xs text-white/40">Step-by-step</p>
              </Link>

              <Link
                to="/vault"
                className="group p-5 border border-[#00ffff]/10 rounded-lg bg-white/[0.01] hover:bg-[#00ffff]/[0.03] hover:border-[#00ffff]/25 transition-all text-center"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg border border-[#00ffff]/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-[#00ffff]/60 group-hover:text-[#00ffff] transition-colors" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">Mirror Vault</h3>
                <p className="text-xs text-white/40">IPFS archives</p>
              </Link>

              <Link
                to="/community"
                className="group p-5 border border-[#00ff9f]/10 rounded-lg bg-white/[0.01] hover:bg-[#00ff9f]/[0.03] hover:border-[#00ff9f]/25 transition-all text-center"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg border border-[#00ff9f]/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#00ff9f]/60 group-hover:text-[#00ff9f] transition-colors" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">Scouts</h3>
                <p className="text-xs text-white/40">Earn NIP-58 badges</p>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Index;
