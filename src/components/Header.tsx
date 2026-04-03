import { useState, useEffect } from 'react';
import { Shield, Terminal, Zap, Menu, X } from 'lucide-react';
import { LoginArea } from '@/components/auth/LoginArea';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

export function Header({ activeSection, onNavigate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'feed', label: 'FEED' },
    { id: 'tools', label: 'TOOLS' },
    { id: 'manifesto', label: 'MANIFESTO' },
    { id: 'compose', label: 'BROADCAST' },
  ];

  const timeStr = time.toISOString().replace('T', ' ').substring(0, 19) + 'Z';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-green-500/20 shadow-[0_0_20px_rgba(0,255,70,0.1)]'
          : 'bg-transparent border-b border-green-500/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded border border-green-500/60 flex items-center justify-center bg-green-500/10 animate-pulse-glow">
                <Shield className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-green-400 terminal-glow leading-none tracking-widest">
                0xPRIVACY
              </span>
              <span className="font-mono text-[9px] text-green-600 leading-none tracking-wider hidden sm:block">
                SOVEREIGN · PRIVATE · FREE
              </span>
            </div>
          </div>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className={`font-mono text-xs px-3 py-1.5 rounded transition-all duration-200 tracking-widest ${
                  activeSection === item.id
                    ? 'text-green-400 bg-green-500/15 border border-green-500/40'
                    : 'text-green-600 hover:text-green-400 hover:bg-green-500/10 border border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* UTC Clock */}
            <div className="hidden lg:flex items-center gap-1.5 font-mono text-[10px] text-green-700 border border-green-500/15 px-2 py-1 rounded">
              <Terminal className="w-3 h-3" />
              <span>{timeStr}</span>
            </div>

            {/* Relay indicator */}
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[10px] text-green-600">NOSTR</span>
            </div>

            {/* Login */}
            <LoginArea className="max-w-48" />

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-8 h-8 text-green-400 hover:bg-green-500/10"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 border-t border-green-500/20 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate?.(item.id);
                setMobileOpen(false);
              }}
              className="w-full text-left font-mono text-xs px-3 py-2 rounded text-green-500 hover:bg-green-500/10 tracking-widest flex items-center gap-2"
            >
              <Zap className="w-3 h-3" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
