import { useSeoMeta } from '@unhead/react';
import { Shield, Award, Users, Zap, Globe, BookOpen, MessageCircle } from 'lucide-react';
import { SiteLayout } from '@/components/layout/SiteLayout';

const badges = [
  {
    name: 'Scout',
    description: 'Submit your first privacy tool recommendation or guide contribution.',
    icon: Shield,
    color: '#00ff9f',
    requirement: '1 accepted contribution',
  },
  {
    name: 'Cipher',
    description: 'Write or improve 3 guides. You understand the tech and can teach it.',
    icon: BookOpen,
    color: '#00ffff',
    requirement: '3 guide contributions',
  },
  {
    name: 'Sentinel',
    description: 'Pin 5 resources to IPFS and submit valid CIDs to the Mirror Vault.',
    icon: Globe,
    color: '#ff00ff',
    requirement: '5 IPFS pins',
  },
  {
    name: 'Phantom',
    description: 'Achieve all three badges. You are a core member of the privacy rebellion.',
    icon: Zap,
    color: '#ffff00',
    requirement: 'All badges earned',
  },
];

const howToContribute = [
  {
    step: '01',
    title: 'Find Us on Nostr',
    description: 'Follow @nostrdanish@0xPrivacy.online on any Nostr client. Our relays are always listening.',
    icon: MessageCircle,
  },
  {
    step: '02',
    title: 'Submit a Contribution',
    description: 'Send a Nostr DM or public note tagging us with your tool recommendation, guide draft, or IPFS CID. Include details and why it matters.',
    icon: BookOpen,
  },
  {
    step: '03',
    title: 'Get Reviewed',
    description: 'Our community scouts review submissions. We verify tools are open-source, privacy-respecting, and actually work.',
    icon: Shield,
  },
  {
    step: '04',
    title: 'Earn Your Badge',
    description: 'Accepted contributions earn Nostr badges (NIP-58) attached to your npub. Your reputation is on-chain and verifiable.',
    icon: Award,
  },
];

export default function Community() {
  useSeoMeta({
    title: 'Community & Scouts - 0xPrivacy.online',
    description: 'Join the privacy rebellion. Contribute tools, guides, and IPFS mirrors. Earn Nostr badges. Community-owned from day one.',
  });

  return (
    <SiteLayout>
      {/* Header */}
      <section className="pt-12 pb-8 border-b border-[#00ff9f]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-[#00ff9f]/40 uppercase tracking-widest mb-2">
            // the collective
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            Community & <span className="text-[#00ff9f]">Scouts</span>
          </h1>
          <p className="text-sm text-white/40 max-w-2xl">
            0xPrivacy is community-owned from day one. No CEO, no board, no investors.
            Just individuals who believe privacy is a right worth fighting for.
          </p>
        </div>
      </section>

      {/* How to contribute */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-[#00ff9f]/40 uppercase tracking-widest mb-2">
            // how to join
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Become a <span className="text-[#00ff9f]">Privacy Scout</span>
          </h2>

          <div className="space-y-4">
            {howToContribute.map((item) => (
              <div
                key={item.step}
                className="group flex items-start gap-4 p-5 border border-[#00ff9f]/10 rounded-lg bg-white/[0.01] hover:bg-[#00ff9f]/[0.03] hover:border-[#00ff9f]/25 transition-all"
              >
                <div className="w-12 h-12 rounded-lg border border-[#00ff9f]/20 flex items-center justify-center shrink-0 bg-[#00ff9f]/5">
                  <span className="font-mono text-sm text-[#00ff9f] font-bold">{item.step}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-sm">{item.title}</h3>
                    <item.icon className="w-3.5 h-3.5 text-[#00ff9f]/40" />
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Badge system */}
      <section className="py-16 border-t border-[#00ff9f]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-[#00ffff]/40 uppercase tracking-widest mb-2">
            // reputation system
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Nostr <span className="text-[#00ffff]">Badges</span>
          </h2>
          <p className="text-sm text-white/40 max-w-2xl mb-8">
            Contributions are rewarded with verifiable Nostr badges (NIP-58). These are cryptographically signed,
            attached to your npub forever. No database. No company. Just math.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className="group p-5 border rounded-lg bg-white/[0.01] hover:bg-white/[0.02] transition-all"
                style={{ borderColor: `${badge.color}15` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0"
                    style={{
                      borderColor: `${badge.color}30`,
                      backgroundColor: `${badge.color}08`,
                    }}
                  >
                    <badge.icon className="w-5 h-5" style={{ color: `${badge.color}90` }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1" style={{ color: badge.color }}>
                      {badge.name}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed mb-2">{badge.description}</p>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono rounded border" style={{
                      color: `${badge.color}70`,
                      borderColor: `${badge.color}20`,
                      backgroundColor: `${badge.color}05`,
                    }}>
                      {badge.requirement}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NIP-05 section */}
      <section className="py-16 border-t border-[#00ff9f]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-[#00ff9f]/40 uppercase tracking-widest mb-2">
            // identity verification
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            NIP-05 <span className="text-[#00ff9f]">Verification</span>
          </h2>
          <p className="text-sm text-white/40 max-w-2xl mb-6">
            Earn the <code className="px-1.5 py-0.5 bg-[#00ff9f]/10 text-[#00ff9f] text-xs font-mono rounded">Cipher</code> badge
            and we&apos;ll add your handle to our NIP-05. Your Nostr identity, verified by the rebellion.
          </p>

          <div className="p-5 border border-[#00ff9f]/10 rounded-lg bg-[#00ff9f]/[0.02]">
            <p className="font-mono text-xs text-[#00ff9f]/60 mb-3">Currently verified:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#00ff9f]/40" />
                <code className="font-mono text-sm text-[#00ff9f]">0xPrivacy@0xPrivacy.online</code>
                <span className="text-[10px] font-mono text-[#00ff9f]/30">// project account</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#00ff9f]/40" />
                <code className="font-mono text-sm text-[#00ff9f]">nostrdanish@0xPrivacy.online</code>
                <span className="text-[10px] font-mono text-[#00ff9f]/30">// founder</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-white/20" />
                <code className="font-mono text-sm text-white/30">NecroClown@0xPrivacy.online</code>
                <span className="text-[10px] font-mono text-white/15">// pending pubkey</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-white/10" />
                <code className="font-mono text-sm text-white/15">yourname@0xPrivacy.online</code>
                <span className="text-[10px] font-mono text-white/10">// could be you</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
