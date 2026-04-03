import { Shield, Key, Eye, Lock, Network, Cpu, Globe, Zap, ArrowUpRight } from 'lucide-react';

const TOOLS = [
  {
    icon: Key,
    name: 'NIP-07 Signer',
    category: 'KEYS',
    description: 'Hardware-level key isolation via browser extension. Your nsec never touches the app.',
    status: 'ACTIVE',
    color: 'green',
    link: 'https://github.com/nostr-protocol/nips/blob/master/07.md',
  },
  {
    icon: Lock,
    name: 'NIP-44 Encryption',
    category: 'CRYPTO',
    description: 'XChaCha20-Poly1305 AEAD for DMs. Padded to defeat traffic analysis. Upgrade from NIP-04.',
    status: 'ACTIVE',
    color: 'cyan',
    link: 'https://github.com/nostr-protocol/nips/blob/master/44.md',
  },
  {
    icon: Eye,
    name: 'Tor Routing',
    category: 'NETWORK',
    description: 'Onion-route your relay connections. Connect through Tor hidden services to annihilate IP metadata.',
    status: 'RECOMMENDED',
    color: 'purple',
    link: 'https://www.torproject.org/',
  },
  {
    icon: Network,
    name: 'Relay Sovereignty',
    category: 'INFRA',
    description: 'Self-host your own relay. strfry, nostr-rs-relay, or khatru — run your own node, own your data.',
    status: 'RECOMMENDED',
    color: 'amber',
    link: 'https://github.com/hoytech/strfry',
  },
  {
    icon: Shield,
    name: 'Nostr Signing Devices',
    category: 'HARDWARE',
    description: 'Dedicated signing hardware keeps your nsec air-gapped. Amber (Android) or hardware wallets via NIP-46.',
    status: 'ADVANCED',
    color: 'green',
    link: 'https://github.com/greenart7c3/Amber',
  },
  {
    icon: Cpu,
    name: 'NIP-46 Remote Signing',
    category: 'BUNKER',
    description: 'Nostr Connect protocol. Sign events on a separate, hardened device. Zero nsec on your client.',
    status: 'ADVANCED',
    color: 'cyan',
    link: 'https://github.com/nostr-protocol/nips/blob/master/46.md',
  },
  {
    icon: Globe,
    name: 'I2P / Lokinet',
    category: 'NETWORK',
    description: 'Garlic routing as Tor alternative. End-to-end encrypted tunnels. Designed for persistent hidden services.',
    status: 'EXPERIMENTAL',
    color: 'purple',
    link: 'https://geti2p.net/',
  },
  {
    icon: Zap,
    name: 'Lightning + Zaps',
    category: 'PAYMENTS',
    description: 'Pseudonymous value transfers via NIP-57. Self-custodial LN node = zero counterparty risk.',
    status: 'ACTIVE',
    color: 'amber',
    link: 'https://github.com/nostr-protocol/nips/blob/master/57.md',
  },
];

const COLOR_MAP = {
  green: {
    icon: 'text-green-400',
    badge: 'border-green-500/30 bg-green-500/10 text-green-400',
    card: 'hover:border-green-500/40 hover:bg-green-500/5',
    glow: 'hover:shadow-[0_0_15px_rgba(0,255,70,0.08)]',
  },
  cyan: {
    icon: 'text-cyan-400',
    badge: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
    card: 'hover:border-cyan-500/40 hover:bg-cyan-500/5',
    glow: 'hover:shadow-[0_0_15px_rgba(0,255,255,0.08)]',
  },
  purple: {
    icon: 'text-purple-400',
    badge: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    card: 'hover:border-purple-500/40 hover:bg-purple-500/5',
    glow: 'hover:shadow-[0_0_15px_rgba(160,0,255,0.08)]',
  },
  amber: {
    icon: 'text-amber-400',
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    card: 'hover:border-amber-500/40 hover:bg-amber-500/5',
    glow: 'hover:shadow-[0_0_15px_rgba(255,180,0,0.08)]',
  },
};

const STATUS_COLORS: Record<string, string> = {
  'ACTIVE': 'text-green-400 before:bg-green-400',
  'RECOMMENDED': 'text-cyan-400 before:bg-cyan-400',
  'ADVANCED': 'text-purple-400 before:bg-purple-400',
  'EXPERIMENTAL': 'text-amber-400 before:bg-amber-400',
};

interface ToolsSectionProps {
  id?: string;
}

export function ToolsSection({ id }: ToolsSectionProps) {
  return (
    <section id={id} className="py-20 px-4 relative">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] text-green-600 tracking-widest uppercase">
              [OPSEC ARSENAL]
            </span>
          </div>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-green-400 terminal-glow mb-3">
            &gt; Privacy Stack
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Battle-tested tools, protocols, and primitives. This is your weapons locker.
            Every tool here maximizes sovereignty and minimizes attack surface.
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TOOLS.map((tool) => {
            const colors = COLOR_MAP[tool.color as keyof typeof COLOR_MAP];
            const Icon = tool.icon;
            const statusColor = STATUS_COLORS[tool.status] ?? 'text-green-400';

            return (
              <a
                key={tool.name}
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex flex-col border border-green-500/15 bg-card rounded p-4 transition-all duration-200 ${colors.card} ${colors.glow} cursor-pointer`}
              >
                {/* Category badge */}
                <span className={`self-start font-mono text-[9px] border px-1.5 py-0.5 rounded mb-3 tracking-widest ${colors.badge}`}>
                  {tool.category}
                </span>

                {/* Icon + name */}
                <div className="flex items-start gap-2 mb-2">
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${colors.icon}`} />
                  <h3 className="font-semibold text-sm text-foreground leading-tight">{tool.name}</h3>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-3">
                  {tool.description}
                </p>

                {/* Status + link */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 font-mono text-[9px] tracking-widest ${statusColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {tool.status}
                  </div>
                  <ArrowUpRight className={`w-3.5 h-3.5 ${colors.icon} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-8 border border-green-500/15 bg-green-500/5 rounded p-4 font-mono text-xs text-green-600">
          <span className="text-green-400 font-bold">THREAT MODEL REMINDER:</span>{' '}
          No tool is perfect. Stack multiple layers. Tor + Nostr + LN + hardware signer + self-hosted relay ={'>'} significantly reduced attack surface.
          The best OPSEC is the one you actually run. Build your threat model. Iterate. Stay paranoid.
        </div>
      </div>
    </section>
  );
}
