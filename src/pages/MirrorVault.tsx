import { useSeoMeta } from '@unhead/react';
import { useState } from 'react';
import { Globe, Copy, Check, ExternalLink, FileText, Video, Package, Archive } from 'lucide-react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { mirrors, ipfsGateways, getGatewayUrl, type MirrorEntry } from '@/data/mirrors';

function TypeIcon({ type }: { type: MirrorEntry['type'] }) {
  switch (type) {
    case 'video': return <Video className="w-4 h-4" />;
    case 'document': return <FileText className="w-4 h-4" />;
    case 'tool': return <Package className="w-4 h-4" />;
    case 'archive': return <Archive className="w-4 h-4" />;
  }
}

function MirrorCard({ mirror }: { mirror: MirrorEntry }) {
  const [copied, setCopied] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(ipfsGateways[0]);

  const handleCopyCid = async () => {
    await navigator.clipboard.writeText(mirror.cid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group border border-[#00ffff]/10 rounded-lg bg-white/[0.01] hover:bg-[#00ffff]/[0.03] hover:border-[#00ffff]/25 transition-all p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg border border-[#00ffff]/20 flex items-center justify-center text-[#00ffff]/60 group-hover:text-[#00ffff] transition-all shrink-0">
          <TypeIcon type={mirror.type} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white text-sm">{mirror.title}</h3>
            <span className="inline-block px-2 py-0.5 text-[10px] font-mono rounded border text-[#00ffff]/50 border-[#00ffff]/15 bg-[#00ffff]/5">
              {mirror.type}
            </span>
          </div>
          <p className="text-xs text-white/40 leading-relaxed mb-3">{mirror.description}</p>

          {/* CID display */}
          <div className="flex items-center gap-2 p-2 bg-black/50 rounded border border-[#00ffff]/5 mb-3">
            <span className="font-mono text-[10px] text-[#00ffff]/40 shrink-0">CID:</span>
            <code className="font-mono text-[10px] text-[#00ffff]/60 truncate flex-1">{mirror.cid}</code>
            <button
              onClick={handleCopyCid}
              className="shrink-0 p-1 text-white/30 hover:text-[#00ffff] transition-colors"
              title="Copy CID"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* Gateway selector and links */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="px-2 py-1 bg-black border border-[#00ffff]/10 rounded text-[10px] font-mono text-white/50 focus:outline-none focus:border-[#00ffff]/30"
            >
              {ipfsGateways.map((gw) => (
                <option key={gw} value={gw}>{new URL(gw).hostname}</option>
              ))}
            </select>
            <a
              href={getGatewayUrl(mirror.cid, selectedGateway)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#00ffff]/10 border border-[#00ffff]/20 rounded text-[10px] font-mono text-[#00ffff] hover:bg-[#00ffff]/20 transition-all"
            >
              Open via IPFS <Globe className="w-3 h-3" />
            </a>
            {mirror.originalUrl && (
              <a
                href={mirror.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 border border-white/10 rounded text-[10px] font-mono text-white/40 hover:text-white/60 hover:bg-white/[0.02] transition-all"
              >
                Original <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {mirror.size && (
              <span className="text-[10px] font-mono text-white/20 ml-auto">
                {mirror.size}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MirrorVault() {
  const [filterType, setFilterType] = useState<string>('all');

  useSeoMeta({
    title: 'Mirror Vault - 0xPrivacy.online',
    description: 'Decentralized IPFS mirrors of essential privacy guides, tools, and videos. Content that can never be taken down.',
  });

  const types = ['all', 'document', 'video', 'tool', 'archive'];
  const filtered = filterType === 'all' ? mirrors : mirrors.filter((m) => m.type === filterType);

  return (
    <SiteLayout>
      {/* Header */}
      <section className="pt-12 pb-8 border-b border-[#00ffff]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-[#00ffff]/40 uppercase tracking-widest mb-2">
            // decentralized archive
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            Mirror <span className="text-[#00ffff]">Vault</span>
          </h1>
          <p className="text-sm text-white/40 max-w-2xl">
            Content pinned to IPFS. Even if every server on Earth goes dark, these files survive on the distributed web.
            Knowledge that cannot be erased.
          </p>
        </div>
      </section>

      {/* Explanation banner */}
      <section className="py-6 border-b border-[#00ffff]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 border border-[#00ffff]/10 rounded-lg bg-[#00ffff]/[0.02]">
            <p className="font-mono text-[10px] text-[#00ffff]/40 uppercase tracking-widest mb-2">
              // how it works
            </p>
            <p className="text-xs text-white/40 leading-relaxed">
              Every file has a <strong className="text-[#00ffff]/60">CID</strong> (Content Identifier) - a cryptographic hash of the content.
              The same content always produces the same CID. You can access files through multiple IPFS gateways.
              If one gateway is blocked, use another. The content is the same everywhere because the hash proves it.
            </p>
          </div>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="py-4 sticky top-16 z-40 bg-black/90 backdrop-blur-xl border-b border-[#00ffff]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-all capitalize ${
                  filterType === type
                    ? 'bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30'
                    : 'text-white/40 border border-transparent hover:text-white/60 hover:bg-white/[0.02]'
                }`}
              >
                {type === 'all' ? 'All Types' : type + 's'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mirror entries */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filtered.map((mirror) => (
              <MirrorCard key={mirror.id} mirror={mirror} />
            ))}
          </div>

          {/* Note about contributing */}
          <div className="mt-8 p-6 border border-dashed border-[#00ffff]/10 rounded-lg text-center">
            <p className="text-sm text-white/30 mb-1">Have content that should be preserved?</p>
            <p className="text-xs text-white/20 font-mono">
              Pin it to IPFS and submit the CID to our community. Nothing important should ever be lost.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
