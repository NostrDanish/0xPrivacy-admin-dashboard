import { Shield, Github, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-green-500/15 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Branding */}
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="font-mono text-sm text-green-500 terminal-glow font-bold tracking-widest">
              0xPRIVACY
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              — Sovereign Nostr Client
            </span>
          </div>

          {/* Center links */}
          <div className="flex items-center gap-4 font-mono text-[10px] text-muted-foreground">
            <a
              href="https://github.com/nostr-protocol/nostr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors flex items-center gap-1"
            >
              <Github className="w-3 h-3" />
              Nostr Protocol
            </a>
            <span className="text-green-500/20">|</span>
            <a
              href="https://www.activism.net/cypherpunk/manifesto.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              Cypherpunk Manifesto
            </a>
            <span className="text-green-500/20">|</span>
            <a
              href="https://bitcoin.org/bitcoin.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              Satoshi's Paper
            </a>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
            <Zap className="w-3 h-3 text-amber-500" />
            <a
              href="https://shakespeare.diy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              Vibed with Shakespeare
            </a>
          </div>
        </div>

        {/* Bottom disclaimer */}
        <div className="mt-4 pt-4 border-t border-green-500/10 font-mono text-[10px] text-green-500/20 text-center">
          No surveillance. No tracking. No analytics. No central authority.
          Open source. Cryptographic by default.
          <br className="hidden sm:block" />
          &nbsp;Freedom is not given. It is coded.
        </div>
      </div>
    </footer>
  );
}
