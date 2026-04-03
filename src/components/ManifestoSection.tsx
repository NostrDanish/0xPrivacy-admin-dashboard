import { Quote } from 'lucide-react';

const MANIFESTO_BLOCKS = [
  {
    title: 'I. Privacy Is Power',
    content:
      'Privacy is necessary for an open society in the electronic age. Privacy is not secrecy. A private matter is something one doesn\'t want the whole world to know, but a secret matter is something one doesn\'t want anybody to know. Privacy is the power to selectively reveal oneself to the world.',
    source: '— Eric Hughes, A Cypherpunk\'s Manifesto (1993)',
  },
  {
    title: 'II. Cypherpunks Write Code',
    content:
      'We cannot expect governments, corporations, or other large, faceless organizations to grant us privacy out of their beneficence. We must defend our own privacy if we expect to have any. Cypherpunks write code. We know that someone has to write software to defend privacy, and we\'re going to write it.',
    source: '— Eric Hughes',
  },
  {
    title: 'III. The Protocol Is the Law',
    content:
      'On Nostr, your keys are your identity. No company can ban you, no server can delete your history once broadcast. The cryptographic proof of your authorship travels with every event you sign. The protocol enforces what no law can guarantee: self-sovereign identity and censorship-resistant communication.',
    source: '— 0xPrivacy Principles',
  },
  {
    title: 'IV. Trust the Math',
    content:
      'Schnorr signatures. ECDH. XChaCha20-Poly1305. These are not buzzwords — they are mathematical guarantees. No subpoena can break a properly implemented elliptic curve. No data center fire destroys your keys if you hold them. Cryptography is the closest thing to magic that actually works.',
    source: '— 0xPrivacy Principles',
  },
  {
    title: 'V. Decentralize Everything',
    content:
      'Every trusted third party is an attack surface. Every centralized server is a honeypot. Every proprietary API is a single point of failure and censorship. The architecture of freedom is peer-to-peer, federated, and ultimately fully decentralized. We build toward that horizon, one relay at a time.',
    source: '— 0xPrivacy Principles',
  },
  {
    title: 'VI. The Sovereign Individual',
    content:
      'Bitcoin proved that sovereign money is possible without rulers. Nostr proves that sovereign communication is possible without platforms. The tools of sovereignty — cryptographic keys, open protocols, peer-to-peer networks — are available to anyone with a device and the will to use them.',
    source: '— Inspired by Davidson & Rees-Mogg',
  },
];

const NIP_STACK = [
  { nip: 'NIP-01', desc: 'Basic Protocol' },
  { nip: 'NIP-02', desc: 'Follow Lists' },
  { nip: 'NIP-04', desc: 'Encrypted DMs (legacy)' },
  { nip: 'NIP-07', desc: 'Browser Signer' },
  { nip: 'NIP-10', desc: 'Reply Threading' },
  { nip: 'NIP-19', desc: 'Bech32 Entities' },
  { nip: 'NIP-21', desc: 'URI Scheme' },
  { nip: 'NIP-25', desc: 'Reactions' },
  { nip: 'NIP-44', desc: 'Versioned Encryption' },
  { nip: 'NIP-46', desc: 'Remote Signer' },
  { nip: 'NIP-57', desc: 'Lightning Zaps' },
  { nip: 'NIP-65', desc: 'Relay Lists' },
  { nip: 'NIP-78', desc: 'App Data' },
  { nip: 'NIP-94', desc: 'File Metadata' },
  { nip: 'NIP-98', desc: 'HTTP Auth' },
];

interface ManifestoSectionProps {
  id?: string;
}

export function ManifestoSection({ id }: ManifestoSectionProps) {
  return (
    <section id={id} className="py-20 px-4 relative overflow-hidden">
      {/* Vertical separator line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-green-500/10 to-transparent pointer-events-none hidden lg:block" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="font-mono text-[10px] text-green-600 tracking-widest uppercase block mb-2">
            [DOCTRINE]
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-green-400 terminal-glow">
            &gt; The Manifesto
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl">
            The ideological foundation. Read it. Understand it. Build it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main manifesto blocks — 2 columns */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MANIFESTO_BLOCKS.map((block, i) => (
              <div
                key={block.title}
                className="border border-green-500/15 bg-card rounded p-5 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-200 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Block number */}
                <span className="font-mono text-[10px] text-green-600/60 mb-2 block">&gt;</span>

                <h3 className="font-mono text-xs font-bold text-green-400 mb-3 tracking-wide">
                  {block.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                  "{block.content}"
                </p>

                <div className="flex items-start gap-1.5 border-t border-green-500/10 pt-3">
                  <Quote className="w-3 h-3 text-green-700 shrink-0 mt-0.5" />
                  <span className="font-mono text-[10px] text-green-700">{block.source}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right column: NIP stack + closing statement */}
          <div className="space-y-4">
            {/* NIP Stack */}
            <div className="border border-green-500/20 bg-card rounded p-5">
              <h3 className="font-mono text-xs font-bold text-green-400 mb-4 tracking-widest">
                [NIP COMPLIANCE]
              </h3>
              <div className="space-y-1.5">
                {NIP_STACK.map((item) => (
                  <div key={item.nip} className="flex items-center justify-between group">
                    <span className="font-mono text-[10px] text-green-500/80 group-hover:text-green-400 transition-colors">
                      {item.nip}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">{item.desc}</span>
                    <div className="w-1 h-1 rounded-full bg-green-500/60" />
                  </div>
                ))}
              </div>
            </div>

            {/* Closing call to action */}
            <div className="border border-green-500/30 bg-green-500/5 rounded p-5 neon-border">
              <p className="font-mono text-xs text-green-400 leading-relaxed mb-4">
                <span className="text-green-300 font-bold">"</span>
                We don't need to ask permission to be free. We build the tools and the tools build the future.
                <span className="text-green-300 font-bold">"</span>
              </p>
              <div className="font-mono text-[10px] text-green-600 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">$</span>
                  <span>gpg --gen-key</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">$</span>
                  <span>nostr keygen --entropy /dev/urandom</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">$</span>
                  <span>tor --RunAsDaemon 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">$</span>
                  <span className="cursor-blink">build it. ship it. stay free.</span>
                </div>
              </div>
            </div>

            {/* Threat model card */}
            <div className="border border-purple-500/20 bg-purple-500/5 rounded p-4">
              <h4 className="font-mono text-[10px] font-bold text-purple-400 mb-2 tracking-widest">
                [THREAT VECTORS]
              </h4>
              <ul className="font-mono text-[10px] text-purple-400/70 space-y-1">
                {[
                  'IP address exposure',
                  'Key extraction attacks',
                  'Relay-level censorship',
                  'Metadata correlation',
                  'Supply chain attacks',
                  'Social engineering',
                ].map((threat) => (
                  <li key={threat} className="flex items-center gap-1.5">
                    <span className="text-red-500">×</span>
                    {threat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
