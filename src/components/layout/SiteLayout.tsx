import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Shield, ExternalLink, Settings, User, Radio,
  Copy, Check, LogOut, ChevronDown, AlertTriangle, Zap,
  Lock, LayoutDashboard, Inbox,
} from 'lucide-react';
import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLoginActions } from '@/hooks/useLoginActions';
import { useToast } from '@/hooks/useToast';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { nip19 } from 'nostr-tools';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { genUserName } from '@/lib/genUserName';
import { RelayListManager } from '@/components/RelayListManager';
import { EditProfileForm } from '@/components/EditProfileForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/feed', label: 'Live Feed' },
  { path: '/tools', label: 'Tools' },
  { path: '/guides', label: 'Guides' },
  { path: '/vault', label: 'Mirror Vault' },
  { path: '/community', label: 'Community' },
  { path: '/manifesto', label: 'Manifesto' },
];

// ─── Nostr Settings Dialog ───────────────────────────────────────────────────

function NostrSettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, metadata } = useCurrentUser();
  const { logout } = useLoginActions();
  const { toast } = useToast();
  const [copiedNpub, setCopiedNpub] = useState(false);
  const [copiedHex, setCopiedHex] = useState(false);

  if (!user) return null;

  const npub = nip19.npubEncode(user.pubkey);
  const displayName = metadata?.display_name ?? metadata?.name ?? genUserName(user.pubkey);
  const loginType = (user as { type?: string }).type ?? 'unknown';

  const copyNpub = async () => {
    await navigator.clipboard.writeText(npub);
    setCopiedNpub(true);
    setTimeout(() => setCopiedNpub(false), 2000);
    toast({ description: 'Public key (npub) copied.' });
  };

  const copyHex = async () => {
    await navigator.clipboard.writeText(user.pubkey);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
    toast({ description: 'Hex pubkey copied.' });
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl bg-black border border-[#00ff9f]/20 text-white p-0 overflow-hidden max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-[#00ff9f]/10 flex-row items-center gap-3">
          <div className="w-8 h-8 rounded border border-[#00ff9f]/30 bg-[#00ff9f]/5 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-[#00ff9f]" />
          </div>
          <div>
            <DialogTitle className="font-mono text-sm text-[#00ff9f] tracking-wider">
              NOSTR SETTINGS
            </DialogTitle>
            <p className="font-mono text-[10px] text-white/30">sovereign identity management</p>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="w-full bg-transparent border-b border-[#00ff9f]/10 rounded-none h-auto p-0 px-2 gap-0">
              <TabsTrigger value="identity" className="flex items-center gap-1.5 px-4 py-3 font-mono text-xs data-[state=active]:text-[#00ff9f] data-[state=active]:bg-[#00ff9f]/10 data-[state=inactive]:text-white/40 rounded-none border-b-2 border-transparent data-[state=active]:border-[#00ff9f]/60">
                <User className="w-3 h-3" /> Identity
              </TabsTrigger>
              <TabsTrigger value="relays" className="flex items-center gap-1.5 px-4 py-3 font-mono text-xs data-[state=active]:text-[#00ff9f] data-[state=active]:bg-[#00ff9f]/10 data-[state=inactive]:text-white/40 rounded-none border-b-2 border-transparent data-[state=active]:border-[#00ff9f]/60">
                <Radio className="w-3 h-3" /> Relays
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-1.5 px-4 py-3 font-mono text-xs data-[state=active]:text-[#00ff9f] data-[state=active]:bg-[#00ff9f]/10 data-[state=inactive]:text-white/40 rounded-none border-b-2 border-transparent data-[state=active]:border-[#00ff9f]/60">
                <Settings className="w-3 h-3" /> Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1.5 px-4 py-3 font-mono text-xs data-[state=active]:text-[#00ff9f] data-[state=active]:bg-[#00ff9f]/10 data-[state=inactive]:text-white/40 rounded-none border-b-2 border-transparent data-[state=active]:border-[#00ff9f]/60">
                <Lock className="w-3 h-3" /> Security
              </TabsTrigger>
            </TabsList>

            {/* ── IDENTITY TAB ── */}
            <TabsContent value="identity" className="p-6 space-y-4 mt-0">
              {/* Profile summary */}
              <div className="flex items-center gap-4 p-4 border border-[#00ff9f]/10 rounded-lg bg-[#00ff9f]/[0.02]">
                <Avatar className="w-12 h-12 rounded-lg border border-[#00ff9f]/20">
                  <AvatarImage src={metadata?.picture} />
                  <AvatarFallback className="bg-[#00ff9f]/10 text-[#00ff9f] font-mono text-sm rounded-lg">
                    {displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white">{displayName}</p>
                  {metadata?.nip05 && (
                    <p className="font-mono text-xs text-[#00ff9f]/60 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {metadata.nip05}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded border ${
                      loginType === 'extension'
                        ? 'text-[#00ff9f]/70 border-[#00ff9f]/20 bg-[#00ff9f]/5'
                        : loginType === 'bunker'
                          ? 'text-purple-400/70 border-purple-400/20 bg-purple-400/5'
                          : 'text-amber-400/70 border-amber-400/20 bg-amber-400/5'
                    }`}>
                      {loginType === 'extension' ? '🔒 NIP-07 EXTENSION' : loginType === 'bunker' ? '🏰 NIP-46 BUNKER' : '⚠ NSEC (DIRECT)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* npub */}
              <div>
                <label className="font-mono text-[10px] text-[#00ff9f]/50 uppercase tracking-widest mb-2 block">
                  Public Key (npub)
                </label>
                <div className="flex items-center gap-2 p-3 bg-black border border-[#00ff9f]/10 rounded-lg">
                  <code className="font-mono text-xs text-white/60 truncate flex-1">{npub}</code>
                  <button
                    onClick={copyNpub}
                    className="shrink-0 text-white/30 hover:text-[#00ff9f] transition-colors p-1"
                    title="Copy npub"
                  >
                    {copiedNpub ? <Check className="w-3.5 h-3.5 text-[#00ff9f]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Hex pubkey */}
              <div>
                <label className="font-mono text-[10px] text-[#00ff9f]/50 uppercase tracking-widest mb-2 block">
                  Hex Public Key
                </label>
                <div className="flex items-center gap-2 p-3 bg-black border border-[#00ff9f]/10 rounded-lg">
                  <code className="font-mono text-[10px] text-white/40 truncate flex-1">{user.pubkey}</code>
                  <button
                    onClick={copyHex}
                    className="shrink-0 text-white/30 hover:text-[#00ff9f] transition-colors p-1"
                    title="Copy hex"
                  >
                    {copiedHex ? <Check className="w-3.5 h-3.5 text-[#00ff9f]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* NIP-05 status */}
              <div className="p-4 border border-[#00ff9f]/10 rounded-lg bg-[#00ff9f]/[0.01]">
                <p className="font-mono text-[10px] text-[#00ff9f]/50 uppercase tracking-widest mb-2">
                  NIP-05 Verification
                </p>
                {metadata?.nip05 ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#00ff9f]" />
                    <code className="font-mono text-sm text-[#00ff9f]">{metadata.nip05}</code>
                    <span className="font-mono text-[10px] text-white/30">// verified</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-white/40 leading-relaxed">
                      No NIP-05 identifier set. Earn the <code className="px-1 py-0.5 bg-[#00ff9f]/10 text-[#00ff9f] text-xs font-mono rounded">Cipher</code> badge
                      on 0xPrivacy and we'll verify you at <code className="text-[#00ff9f]/60">yourname@0xPrivacy.online</code>.
                    </p>
                    <a
                      href="/community"
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-xs text-[#00ff9f]/50 hover:text-[#00ff9f] transition-colors font-mono"
                    >
                      Learn how → <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Logout */}
              <div className="pt-2 border-t border-white/5">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full font-mono text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  SIGN OUT
                </Button>
              </div>
            </TabsContent>

            {/* ── RELAYS TAB ── */}
            <TabsContent value="relays" className="p-6 mt-0">
              <div className="mb-4">
                <p className="font-mono text-[10px] text-[#00ff9f]/50 uppercase tracking-widest mb-1">
                  Relay Configuration (NIP-65)
                </p>
                <p className="text-xs text-white/40 leading-relaxed">
                  Your relay list is published as a NIP-65 event. Use multiple relays for censorship resistance.
                  Self-host with <a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer" className="text-[#00ff9f]/60 hover:text-[#00ff9f]">strfry</a> or{' '}
                  <a href="https://github.com/scsibug/nostr-rs-relay" target="_blank" rel="noopener noreferrer" className="text-[#00ff9f]/60 hover:text-[#00ff9f]">nostr-rs-relay</a> for maximum sovereignty.
                </p>
              </div>
              <RelayListManager />
              <div className="mt-4 p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg">
                <p className="font-mono text-[10px] text-amber-400/80 leading-relaxed">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  <strong>OPSEC:</strong> Add Tor-accessible relays (e.g. <code className="text-amber-300/70">.onion</code> addresses)
                  for maximum network-level privacy. Regular WSS relays leak your IP.
                </p>
              </div>
            </TabsContent>

            {/* ── PROFILE TAB ── */}
            <TabsContent value="profile" className="p-6 mt-0">
              <div className="mb-4">
                <p className="font-mono text-[10px] text-[#00ff9f]/50 uppercase tracking-widest mb-1">
                  Edit Profile (kind: 0)
                </p>
                <p className="text-xs text-white/40 leading-relaxed">
                  Publishes a NIP-01 kind 0 metadata event signed with your key.
                  Your profile data lives on relays — no central server controls it.
                </p>
              </div>
              <EditProfileForm />
            </TabsContent>

            {/* ── SECURITY TAB ── */}
            <TabsContent value="security" className="p-6 space-y-4 mt-0">
              {/* Signer type assessment */}
              <div>
                <p className="font-mono text-[10px] text-[#00ff9f]/50 uppercase tracking-widest mb-3">
                  Signer Security Assessment
                </p>
                <div className="space-y-2">
                  {[
                    {
                      label: 'NIP-07 Browser Extension',
                      desc: 'Keys stay in extension. Never exposed to web pages. Best for daily use.',
                      score: 'RECOMMENDED',
                      scoreColor: 'text-[#00ff9f] border-[#00ff9f]/20 bg-[#00ff9f]/5',
                      active: loginType === 'extension',
                      links: [
                        { name: 'Alby', url: 'https://getalby.com' },
                        { name: 'nos2x', url: 'https://github.com/fiatjaf/nos2x' },
                        { name: 'Nostore', url: 'https://github.com/nbd-wtf/nostore' },
                      ],
                    },
                    {
                      label: 'NIP-46 Remote Signer (Bunker)',
                      desc: 'Sign on a separate, air-gappable device. Keys never touch this browser.',
                      score: 'ADVANCED',
                      scoreColor: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
                      active: loginType === 'bunker',
                      links: [
                        { name: 'Amber (Android)', url: 'https://github.com/greenart7c3/Amber' },
                        { name: 'nsecBunker', url: 'https://github.com/kind-0/nsecbunkerd' },
                      ],
                    },
                    {
                      label: 'Direct nsec (Private Key)',
                      desc: 'Key held in browser memory. Only for testing. Never use with significant identity.',
                      score: 'RISK',
                      scoreColor: 'text-red-400 border-red-400/20 bg-red-400/5',
                      active: loginType === 'nsec',
                      links: [],
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`p-4 border rounded-lg transition-all ${
                        item.active
                          ? 'border-[#00ff9f]/30 bg-[#00ff9f]/[0.03]'
                          : 'border-white/5 bg-white/[0.01]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2">
                          {item.active && <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />}
                          <span className={`font-semibold text-sm ${item.active ? 'text-white' : 'text-white/50'}`}>
                            {item.label}
                          </span>
                        </div>
                        <span className={`font-mono text-[9px] px-2 py-0.5 rounded border ${item.scoreColor}`}>
                          {item.active ? '● ACTIVE' : item.score}
                        </span>
                      </div>
                      <p className="text-xs text-white/35 leading-relaxed mb-2">{item.desc}</p>
                      {item.links.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.links.map((link) => (
                            <a
                              key={link.name}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-mono text-white/30 hover:text-[#00ff9f]/60 transition-colors"
                            >
                              {link.name} <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key hygiene tips */}
              <div className="p-4 border border-[#00ff9f]/10 rounded-lg bg-[#00ff9f]/[0.01]">
                <p className="font-mono text-[10px] text-[#00ff9f]/50 uppercase tracking-widest mb-3">
                  Key Hygiene Protocol
                </p>
                <ul className="space-y-2">
                  {[
                    'Back up your nsec on paper or a metal seed plate — offline only',
                    'Never paste your nsec into any website, app, or chat',
                    'Use a dedicated hardware device (e.g. Amber on GrapheneOS) for critical identity',
                    'Rotate keys if you suspect compromise — publish a new npub and announce migration',
                    'Use Tor when connecting to relays to prevent IP-pubkey correlation',
                    'One nsec per identity context: work, pseudonymous, throwaway',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/40">
                      <span className="font-mono text-[#00ff9f]/40 shrink-0">&gt;</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Encryption capability check */}
              <div className="p-4 border border-[#00ff9f]/10 rounded-lg">
                <p className="font-mono text-[10px] text-[#00ff9f]/50 uppercase tracking-widest mb-3">
                  Encryption Capabilities
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'NIP-04 (AES-256-CBC DMs)', available: true, note: 'Legacy — consider upgrading' },
                    { label: 'NIP-44 (XChaCha20-Poly1305)', available: loginType === 'extension' || loginType === 'bunker', note: 'Requires compatible signer' },
                    { label: 'NIP-07 Event Signing', available: loginType !== 'nsec', note: 'Keys isolated from browser' },
                    { label: 'NIP-46 Remote Signing', available: loginType === 'bunker', note: 'Maximum key isolation' },
                  ].map((cap) => (
                    <div key={cap.label} className="flex items-center justify-between text-xs">
                      <span className={cap.available ? 'text-white/60' : 'text-white/25'}>{cap.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white/25 text-[10px] font-mono hidden sm:block">{cap.note}</span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${
                          cap.available
                            ? 'text-[#00ff9f]/70 border-[#00ff9f]/20 bg-[#00ff9f]/5'
                            : 'text-white/20 border-white/5 bg-white/[0.01]'
                        }`}>
                          {cap.available ? '✓ YES' : '✗ NO'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Logged-in user menu in nav ───────────────────────────────────────────────

function NavUserMenu() {
  const { user, metadata } = useCurrentUser();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useLoginActions();
  const { isAdmin } = useIsAdmin();
  const displayName = metadata?.display_name ?? metadata?.name ?? (user ? genUserName(user.pubkey) : '');

  if (!user) return <LoginArea className="max-w-52" />;

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 border border-[#00ff9f]/20 rounded-lg bg-[#00ff9f]/5 hover:bg-[#00ff9f]/10 hover:border-[#00ff9f]/40 transition-all"
        >
          <Avatar className="w-6 h-6 rounded border border-[#00ff9f]/20">
            <AvatarImage src={metadata?.picture} />
            <AvatarFallback className="bg-[#00ff9f]/10 text-[#00ff9f] font-mono text-[9px]">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-mono text-xs text-[#00ff9f] hidden sm:block max-w-[100px] truncate">
            {displayName}
          </span>
          <ChevronDown className={`w-3 h-3 text-[#00ff9f]/60 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-56 bg-black border border-[#00ff9f]/20 rounded-lg shadow-[0_0_30px_rgba(0,255,159,0.1)] z-50 overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3 border-b border-[#00ff9f]/10">
                <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                {metadata?.nip05 && (
                  <p className="font-mono text-[10px] text-[#00ff9f]/50 truncate flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" />
                    {metadata.nip05}
                  </p>
                )}
              </div>

              {/* Menu items */}
              <div className="p-1">
                <button
                  onClick={() => { setSettingsOpen(true); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5 rounded transition-all font-mono"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Nostr Settings
                </button>
                <Link
                  to="/community"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5 rounded transition-all font-mono"
                >
                  <Zap className="w-3.5 h-3.5" />
                  My Badges (NIP-58)
                </Link>
                {isAdmin && (
                  <>
                    <div className="h-px bg-[#00ff9f]/10 my-1" />
                    <p className="px-3 py-1 font-mono text-[9px] text-[#00ff9f]/40 uppercase tracking-widest">Admin</p>
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#00ff9f]/70 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5 rounded transition-all font-mono"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/inbox"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#00ff9f]/70 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5 rounded transition-all font-mono"
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      Submission Inbox
                    </Link>
                  </>
                )}
                <div className="h-px bg-white/5 my-1" />
                <button
                  onClick={() => { logout(); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/5 rounded transition-all font-mono"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <NostrSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

// ─── Main SiteLayout ──────────────────────────────────────────────────────────

interface SiteLayoutProps {
  children: ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useIsAdmin();

  return (
    <div className="min-h-screen bg-black text-white hex-grid-bg relative">
      {/* Subtle gradient overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00ff9f] rounded-full opacity-[0.02] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00ffff] rounded-full opacity-[0.02] blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#00ff9f]/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-8 h-8 rounded border border-[#00ff9f]/40 flex items-center justify-center bg-[#00ff9f]/5 group-hover:bg-[#00ff9f]/10 transition-all group-hover:border-[#00ff9f]/60">
                <Shield className="w-4 h-4 text-[#00ff9f]" />
              </div>
              <span className="font-mono text-sm font-bold text-[#00ff9f] tracking-wider">
                0xPrivacy
              </span>
              <span className="font-mono text-xs text-[#00ff9f]/40">.online</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 text-sm font-medium transition-all rounded ${
                      isActive
                        ? 'text-[#00ff9f] bg-[#00ff9f]/10'
                        : 'text-white/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {isAdmin && (
                <>
                  <div className="w-px h-5 bg-[#00ff9f]/15 mx-1" />
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all rounded ${
                      location.pathname === '/admin'
                        ? 'text-[#00ff9f] bg-[#00ff9f]/10'
                        : 'text-[#00ff9f]/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                  <Link
                    to="/inbox"
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all rounded ${
                      location.pathname === '/inbox'
                        ? 'text-[#00ff9f] bg-[#00ff9f]/10'
                        : 'text-[#00ff9f]/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5'
                    }`}
                  >
                    <Inbox className="w-3.5 h-3.5" />
                    Inbox
                  </Link>
                </>
              )}
            </div>

            {/* Right side: Nostr user menu */}
            <div className="flex items-center gap-2">
              <NavUserMenu />
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white/60 hover:text-[#00ff9f] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#00ff9f]/10 bg-black/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 text-sm font-medium transition-all rounded ${
                      isActive
                        ? 'text-[#00ff9f] bg-[#00ff9f]/10'
                        : 'text-white/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#00ff9f]/10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#00ff9f]" />
                <span className="font-mono text-sm font-bold text-[#00ff9f]">0xPrivacy.online</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                Community-owned. No tracking. No ads. No JavaScript fingerprinting.
                Built by cypherpunks, for everyone.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-mono text-xs text-[#00ff9f]/60 uppercase tracking-widest mb-3">Navigate</h4>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-xs text-white/40 hover:text-[#00ff9f] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-mono text-xs text-[#00ff9f]/60 uppercase tracking-widest mb-3">Resources</h4>
              <div className="space-y-2">
                <a href="https://www.eff.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-white/40 hover:text-[#00ff9f] transition-colors">
                  EFF <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://www.privacyguides.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-white/40 hover:text-[#00ff9f] transition-colors">
                  PrivacyGuides <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://ssd.eff.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-white/40 hover:text-[#00ff9f] transition-colors">
                  Surveillance Self-Defense <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://kyc.rip/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-white/40 hover:text-[#00ff9f] transition-colors">
                  KYC.RIP <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Nostr / Verify */}
            <div>
              <h4 className="font-mono text-xs text-[#00ff9f]/60 uppercase tracking-widest mb-3">Verify</h4>
              <div className="space-y-2">
                <p className="text-xs text-white/40 font-mono">NIP-05: 0xPrivacy@0xPrivacy.online</p>
                <p className="text-xs text-white/30 font-mono">NIP-05: nostrdanish@0xPrivacy.online</p>
                <p className="text-xs text-white/30">All content mirrored on IPFS</p>
                <p className="text-xs text-white/30">Source: fully static, no trackers</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[#00ff9f]/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/20 font-mono">
              <span className="text-[#00ff9f]/40">$</span> privacy is not a crime &mdash; it is a right
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://shakespeare.diy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/20 hover:text-white/40 transition-colors"
              >
                Vibed with Shakespeare
              </a>
              <span className="text-white/10">|</span>
              <span className="text-xs text-white/20 font-mono">
                {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
