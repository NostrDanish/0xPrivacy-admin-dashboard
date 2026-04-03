import { useEffect, useState } from 'react';
import { MatrixRain } from '@/components/MatrixRain';
import { Button } from '@/components/ui/button';
import { Shield, ChevronDown, Lock, Eye, Zap } from 'lucide-react';

interface HeroSectionProps {
  onNavigate?: (section: string) => void;
}

const MANIFESTO_LINES = [
  'Privacy is not given. It is coded.',
  'Cypherpunks write code.',
  'The net treats censorship as damage and routes around it.',
  'Don\'t trust. Verify.',
  'Your keys. Your identity. Your freedom.',
];

const STATS = [
  { label: 'Relays', value: '3+', color: 'text-green-400' },
  { label: 'Protocol', value: 'Nostr', color: 'text-cyan-400' },
  { label: 'Encryption', value: 'NIP-44', color: 'text-purple-400' },
  { label: 'Keys', value: 'Schnorr', color: 'text-amber-400' },
];

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((c) => !c);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const current = MANIFESTO_LINES[lineIndex];

    if (typing) {
      if (displayed.length < current.length) {
        const timeout = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, 45);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setTyping(false), 2200);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayed.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 20);
        return () => clearTimeout(timeout);
      } else {
        setLineIndex((i) => (i + 1) % MANIFESTO_LINES.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, lineIndex]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden isolate">
      {/* Matrix rain background */}
      <MatrixRain />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 -z-10" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, hsl(120 100% 50% / 0.04) 0%, transparent 70%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-green-500/30 bg-green-500/5 px-3 py-1 rounded-full mb-8 animate-fade-in-up">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-[11px] text-green-500 tracking-widest uppercase">
            Sovereign Nostr Client
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>

        {/* Main title */}
        <div className="mb-6 animate-fade-in-up delay-100">
          <h1 className="font-mono text-5xl sm:text-7xl font-black tracking-tighter terminal-glow">
            <span className="text-green-400">0x</span>
            <span className="text-white">PRIVACY</span>
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-green-500/60" />
            <Shield className="w-4 h-4 text-green-500/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-green-500/60" />
          </div>
        </div>

        {/* Typewriter subtitle */}
        <div className="h-8 mb-8 flex items-center justify-center animate-fade-in-up delay-200">
          <p className="font-mono text-sm sm:text-base text-green-500/80 tracking-wide">
            <span className="text-green-600 mr-2">$</span>
            {displayed}
            <span className={`ml-0.5 text-green-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>▋</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up delay-300">
          A censorship-resistant, sovereign Nostr client for cypherpunks, privacy activists, and freedom coders.
          No surveillance. No central authority. Just cryptography, open protocols, and the radical belief
          that{' '}
          <span className="text-green-400 font-semibold">privacy is a human right</span>.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 animate-fade-in-up delay-400">
          <Button
            onClick={() => onNavigate?.('feed')}
            className="font-mono text-xs tracking-widest bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2.5 neon-border transition-all duration-200 uppercase"
          >
            <Zap className="w-3.5 h-3.5 mr-2" />
            ACCESS THE FEED
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate?.('manifesto')}
            className="font-mono text-xs tracking-widest border-green-500/40 text-green-400 hover:bg-green-500/10 hover:border-green-500/70 px-6 py-2.5 uppercase"
          >
            <Lock className="w-3.5 h-3.5 mr-2" />
            READ MANIFESTO
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto animate-fade-in-up delay-500">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center bg-black/40 border border-green-500/15 rounded px-3 py-2"
            >
              <span className={`font-mono text-sm font-bold ${stat.color}`}>{stat.value}</span>
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <span className="font-mono text-[10px] text-green-600 tracking-widest">SCROLL</span>
        <ChevronDown className="w-4 h-4 text-green-600" />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-16 left-4 font-mono text-[10px] text-green-500/20 hidden lg:block">
        <div>NIP-01 ✓</div>
        <div>NIP-04 ✓</div>
        <div>NIP-07 ✓</div>
        <div>NIP-19 ✓</div>
        <div>NIP-44 ✓</div>
        <div>NIP-57 ✓</div>
      </div>
      <div className="absolute top-16 right-4 font-mono text-[10px] text-green-500/20 text-right hidden lg:block">
        <div>Schnorr Sigs ✓</div>
        <div>ECDH Encryption ✓</div>
        <div>Self-Custody ✓</div>
        <div>No KYC ✓</div>
        <div>Open Source ✓</div>
        <div>Censorship-Resistant ✓</div>
      </div>

      {/* Bottom scanline effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
