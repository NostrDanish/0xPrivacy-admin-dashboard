import { useSeoMeta } from '@unhead/react';
import { useState } from 'react';
import {
  Shield, Globe, Zap, MessageCircle, Lock, Eye,
  ExternalLink, Fingerprint, Database, ChevronDown, ChevronUp,
  Smartphone, Share2, Unlock, Play, Terminal, Ghost, MailX, Skull,
  ArrowRight
} from 'lucide-react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { tools, toolCategories, featuredCollections, type PrivacyTool } from '@/data/tools';

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
    smartphone: <Smartphone className="w-5 h-5" />,
    'shield-android': <Shield className="w-5 h-5" />,
    unlock: <Unlock className="w-5 h-5" />,
    share: <Share2 className="w-5 h-5" />,
    'message-nostr': <Zap className="w-5 h-5" />,
    skull: <Skull className="w-5 h-5" />,
    terminal: <Terminal className="w-5 h-5" />,
    ghost: <Ghost className="w-5 h-5" />,
    'mail-x': <MailX className="w-5 h-5" />,
    play: <Play className="w-5 h-5" />,
  };
  return iconMap[iconName] || <Shield className="w-5 h-5" />;
}

function ToolCard({ tool, accentColor = '#00ff9f' }: { tool: PrivacyTool; accentColor?: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="group border rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-all"
      style={{ borderColor: `${accentColor}15` }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 transition-all"
            style={{
              borderColor: `${accentColor}30`,
              backgroundColor: `${accentColor}08`,
              color: `${accentColor}90`,
            }}
          >
            {getToolIcon(tool.icon)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-bold text-white text-base">{tool.name}</h3>
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
            <p className="text-sm font-mono mb-2" style={{ color: `${accentColor}90` }}>{tool.tagline}</p>
            <p className="text-xs text-white/40 leading-relaxed">{tool.description}</p>

            {/* Credit line */}
            {tool.credit && (
              <p className="mt-2 text-[10px] font-mono text-white/25 italic">
                {tool.credit}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-mono transition-all hover:brightness-125"
                style={{
                  backgroundColor: `${accentColor}10`,
                  borderColor: `${accentColor}25`,
                  color: accentColor,
                }}
              >
                Official Site <ExternalLink className="w-3 h-3" />
              </a>
              {tool.ipfsMirror && (
                <a
                  href={tool.ipfsMirror}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#00ffff]/20 rounded text-xs font-mono text-[#00ffff]/60 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-all"
                >
                  IPFS Mirror <Globe className="w-3 h-3" />
                </a>
              )}
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-auto inline-flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Tips {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 pt-0">
          <div className="border-t pt-4" style={{ borderColor: `${accentColor}08` }}>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: `${accentColor}50` }}>
              // quick tips
            </p>
            <ul className="space-y-1.5">
              {tool.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                  <span className="font-mono shrink-0" style={{ color: `${accentColor}50` }}>&gt;</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function FeaturedBanner({ collection }: { collection: typeof featuredCollections[number] }) {
  const collectionTools = collection.toolIds
    .map((id) => tools.find((t) => t.id === id))
    .filter((t): t is PrivacyTool => t !== undefined);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner header */}
        <div
          className="relative p-6 sm:p-8 rounded-lg border mb-6 overflow-hidden isolate"
          style={{
            borderColor: `${collection.accentColor}20`,
            background: `linear-gradient(135deg, ${collection.accentColor}06, transparent, ${collection.accentColor}03)`,
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] -z-10"
            style={{ backgroundColor: collection.accentColor, opacity: 0.06 }}
          />

          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t border-l" style={{ borderColor: `${collection.accentColor}40` }} />
          <div className="absolute top-0 right-0 w-5 h-5 border-t border-r" style={{ borderColor: `${collection.accentColor}40` }} />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l" style={{ borderColor: `${collection.accentColor}40` }} />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r" style={{ borderColor: `${collection.accentColor}40` }} />

          <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: `${collection.accentColor}60` }}>
            {collection.subtitle}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: collection.accentColor }}>
            {collection.title}
          </h2>
          <p className="text-sm text-white/40 max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        </div>

        {/* Tools grid for this collection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {collectionTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} accentColor={collection.accentColor} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ToolsHub() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  useSeoMeta({
    title: 'Privacy Tools Hub - 0xPrivacy.online',
    description: 'Curated collection of essential privacy tools. Tor, Monero, Nostr, SimpleX, Tails, IPFS, InviZible, no-KYC swaps, Nostr messengers, and more. Official links, tips, and IPFS mirrors.',
  });

  // Tools not in any featured collection (the "core" tools)
  const coreToolIds = new Set(featuredCollections.flatMap((c) => c.toolIds));
  const coreTools = tools.filter((t) => !coreToolIds.has(t.id));

  const filteredCoreTools = activeCategory === 'all'
    ? coreTools
    : tools.filter((t) => t.category === activeCategory);

  // Determine if we're filtering by a category that belongs to a featured collection
  const isFeaturedFilter = activeCategory !== 'all' && ['android', 'nostr-messaging', 'no-kyc', 'media'].includes(activeCategory);

  return (
    <SiteLayout>
      {/* Header */}
      <section className="pt-12 pb-8 border-b border-[#00ff9f]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-[#00ff9f]/40 uppercase tracking-widest mb-2">
            // arsenal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            Privacy <span className="text-[#00ff9f]">Tools Hub</span>
          </h1>
          <p className="text-sm text-white/40 max-w-2xl">
            Vetted, open-source tools for communication, finance, browsing, identity, and liberation.
            Every tool listed here respects your freedom. Credit given to every original creator. No corporate spyware. No compromises.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs font-mono text-white/20">{tools.length} tools indexed</span>
            <span className="text-white/10">|</span>
            <span className="text-xs font-mono text-white/20">{featuredCollections.length} featured collections</span>
          </div>
        </div>
      </section>

      {/* Category filters */}
      <section className="py-4 border-b border-[#00ff9f]/5 sticky top-16 z-40 bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {toolCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setShowAll(false); }}
                className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#00ff9f]/10 text-[#00ff9f] border border-[#00ff9f]/30'
                    : 'text-white/40 border border-transparent hover:text-white/60 hover:bg-white/[0.02]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeCategory === 'all' && !showAll ? (
        <>
          {/* FEATURED COLLECTIONS - The crown jewels */}
          {featuredCollections.map((collection) => (
            <FeaturedBanner key={collection.id} collection={collection} />
          ))}

          {/* Divider between featured and core */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 py-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00ff9f]/10 to-transparent" />
              <span className="font-mono text-[10px] text-[#00ff9f]/30 uppercase tracking-widest whitespace-nowrap">
                // core toolkit
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00ff9f]/10 to-transparent" />
            </div>
          </div>

          {/* CORE TOOLS */}
          <section className="py-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {coreTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>

              {/* Show flat list toggle */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#00ff9f]/20 rounded text-xs font-mono text-[#00ff9f]/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5 transition-all"
                >
                  View all {tools.length} tools as flat list <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* FILTERED VIEW or FLAT LIST */
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* If viewing a featured category, show its banner header */}
            {isFeaturedFilter && (() => {
              const matchingCollection = featuredCollections.find((c) =>
                c.toolIds.some((id) => tools.find((t) => t.id === id)?.category === activeCategory)
              );
              if (matchingCollection) {
                return (
                  <div
                    className="relative p-6 rounded-lg border mb-8 overflow-hidden isolate"
                    style={{
                      borderColor: `${matchingCollection.accentColor}20`,
                      background: `linear-gradient(135deg, ${matchingCollection.accentColor}06, transparent)`,
                    }}
                  >
                    <div
                      className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] -z-10"
                      style={{ backgroundColor: matchingCollection.accentColor, opacity: 0.06 }}
                    />
                    <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: `${matchingCollection.accentColor}60` }}>
                      {matchingCollection.subtitle}
                    </p>
                    <h2 className="text-xl font-bold mb-1" style={{ color: matchingCollection.accentColor }}>
                      {matchingCollection.title}
                    </h2>
                    <p className="text-xs text-white/40">{matchingCollection.description}</p>
                  </div>
                );
              }
              return null;
            })()}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(showAll ? tools : filteredCoreTools).map((tool) => {
                const collection = featuredCollections.find((c) => c.toolIds.includes(tool.id));
                return (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    accentColor={collection?.accentColor ?? '#00ff9f'}
                  />
                );
              })}
            </div>

            {filteredCoreTools.length === 0 && !showAll && (
              <div className="text-center py-16">
                <p className="text-white/30 font-mono text-sm">No tools found in this category.</p>
              </div>
            )}

            {showAll && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAll(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#00ff9f]/20 rounded text-xs font-mono text-[#00ff9f]/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5 transition-all"
                >
                  Back to featured view
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Legend */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 border border-[#00ff9f]/5 rounded-lg bg-white/[0.01]">
            <p className="font-mono text-[10px] text-[#00ff9f]/40 uppercase tracking-widest mb-3">
              // difficulty legend
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block px-2 py-0.5 text-[10px] font-mono rounded border text-green-400/70 border-green-400/20 bg-green-400/5">
                  beginner
                </span>
                <span className="text-xs text-white/30">Download and use</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block px-2 py-0.5 text-[10px] font-mono rounded border text-yellow-400/70 border-yellow-400/20 bg-yellow-400/5">
                  intermediate
                </span>
                <span className="text-xs text-white/30">Some configuration needed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block px-2 py-0.5 text-[10px] font-mono rounded border text-red-400/70 border-red-400/20 bg-red-400/5">
                  advanced
                </span>
                <span className="text-xs text-white/30">Technical knowledge required</span>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-white/15 font-mono">
              All tools are open-source and independently verified. Credit to original creators is displayed on every card.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
