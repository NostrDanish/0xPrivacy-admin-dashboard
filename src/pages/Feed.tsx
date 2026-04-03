import { useState } from 'react';
import { useSeoMeta } from '@unhead/react';
import { RefreshCw, Radio, Users, PenLine, ShieldCheck, Wifi, WifiOff, Filter } from 'lucide-react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { PostCard, PostCardSkeleton } from '@/components/feed/PostCard';
import { ComposePost } from '@/components/feed/ComposePost';
import { useVerifiedFeed, useCommunityFeed } from '@/hooks/usePrivacyFeed';
import { VERIFIED_SOURCES, PRIVACY_HASHTAGS } from '@/lib/verifiedSources';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthor } from '@/hooks/useAuthor';

// ── Source card shown in the sidebar ─────────────────────────────────────────

function SourceCard({ source }: { source: typeof VERIFIED_SOURCES[number] }) {
  const author = useAuthor(source.pubkey);
  const metadata = author.data?.metadata;

  return (
    <a
      href={`https://njump.me/${source.pubkey}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-2.5 p-3 rounded-lg border border-[#00ff9f]/8 hover:border-[#00ff9f]/25 hover:bg-[#00ff9f]/[0.03] transition-all group"
    >
      <Avatar className="w-8 h-8 rounded-lg border border-[#00ff9f]/15 shrink-0">
        <AvatarImage src={metadata?.picture ?? source.pubkey} />
        <AvatarFallback className="bg-[#00ff9f]/10 text-[#00ff9f] font-mono text-[10px] rounded-lg">
          {source.displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-white/80 group-hover:text-white truncate">{source.displayName}</span>
          <ShieldCheck className="w-3 h-3 text-[#00ff9f]/60 shrink-0" />
        </div>
        {source.nip05 && (
          <span className="font-mono text-[9px] text-[#00ff9f]/40 truncate block">{source.nip05}</span>
        )}
        <span className="text-[10px] text-white/30 leading-tight line-clamp-1">{source.description}</span>
      </div>
    </a>
  );
}

// ── Main Feed Page ────────────────────────────────────────────────────────────

type FeedTab = 'verified' | 'community' | 'compose';

export default function Feed() {
  const [activeTab, setActiveTab] = useState<FeedTab>('verified');
  const [activeHashtag, setActiveHashtag] = useState<string | undefined>(undefined);

  useSeoMeta({
    title: 'Live Feed — 0xPrivacy.online',
    description:
      'Live Nostr feed from verified privacy advocates, cypherpunks, and the open community. Real-time. Censorship-resistant. No algorithm.',
  });

  const verifiedFeed = useVerifiedFeed(40);
  const communityFeed = useCommunityFeed(activeHashtag, 40);

  const activeFeed = activeTab === 'verified' ? verifiedFeed : communityFeed;
  const isLoading = activeFeed.isLoading;
  const isFetching = activeFeed.isFetching;
  const isError = activeFeed.isError;
  const events = activeFeed.data ?? [];

  const handleRefetch = () => activeFeed.refetch();

  const TABS: { id: FeedTab; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'verified',
      label: 'Verified Sources',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      count: verifiedFeed.data?.length,
    },
    {
      id: 'community',
      label: 'Community',
      icon: <Users className="w-3.5 h-3.5" />,
      count: communityFeed.data?.length,
    },
    {
      id: 'compose',
      label: 'Broadcast',
      icon: <PenLine className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <SiteLayout>
      {/* Page header */}
      <section className="pt-10 pb-6 border-b border-[#00ff9f]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-xs text-[#00ff9f]/40 uppercase tracking-widest mb-1">
                // live nostr stream
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Privacy <span className="text-[#00ff9f]">Feed</span>
              </h1>
              <p className="text-sm text-white/40 mt-1 max-w-lg">
                Real-time dispatches from verified privacy advocates and the open cypherpunk community.
                No algorithm. No shadowbanning. Pure protocol.
              </p>
            </div>

            {/* Relay status + refresh */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 font-mono text-[10px]">
                {isError ? (
                  <><WifiOff className="w-3 h-3 text-red-500" /><span className="text-red-400">RELAY ERROR</span></>
                ) : (
                  <>
                    <Wifi className={`w-3 h-3 ${isFetching ? 'text-[#00ff9f] animate-pulse' : 'text-[#00ff9f]/40'}`} />
                    <span className="text-white/30">{isFetching ? 'FETCHING…' : `${events.length} EVENTS`}</span>
                  </>
                )}
              </div>
              <button
                onClick={handleRefetch}
                disabled={isFetching}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#00ff9f]/20 rounded font-mono text-[10px] text-[#00ff9f]/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5 hover:border-[#00ff9f]/40 disabled:opacity-40 transition-all"
              >
                <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
                REFRESH
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tab bar */}
      <div className="sticky top-16 z-40 border-b border-[#00ff9f]/8 bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 font-mono text-xs whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#00ff9f] text-[#00ff9f]'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#00ff9f]/10 rounded text-[9px] text-[#00ff9f]/60">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Feed ── */}
          <div className="lg:col-span-2 space-y-3">

            {/* Community hashtag filter pills */}
            {activeTab === 'community' && (
              <div className="flex flex-wrap gap-2 pb-2">
                <button
                  onClick={() => setActiveHashtag(undefined)}
                  className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-all ${
                    !activeHashtag
                      ? 'border-[#00ff9f]/50 bg-[#00ff9f]/15 text-[#00ff9f]'
                      : 'border-white/10 text-white/30 hover:border-[#00ff9f]/25 hover:text-white/50'
                  }`}
                >
                  ◈ ALL
                </button>
                {PRIVACY_HASHTAGS.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveHashtag(activeHashtag === tag ? undefined : tag)}
                    className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-all ${
                      activeHashtag === tag
                        ? 'border-[#00ff9f]/50 bg-[#00ff9f]/15 text-[#00ff9f]'
                        : 'border-white/10 text-white/30 hover:border-[#00ff9f]/25 hover:text-white/50'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {/* Compose tab */}
            {activeTab === 'compose' && (
              <ComposePost onPublished={() => setActiveTab('community')} />
            )}

            {/* Feed content */}
            {activeTab !== 'compose' && (
              <>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                  ))
                ) : isError ? (
                  <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-8 text-center">
                    <WifiOff className="w-8 h-8 text-red-500/40 mx-auto mb-3" />
                    <p className="font-mono text-sm text-red-400 mb-1">RELAY CONNECTION FAILED</p>
                    <p className="text-xs text-white/30 mb-4">
                      Check your relay configuration or try again. The mesh persists.
                    </p>
                    <button
                      onClick={handleRefetch}
                      className="font-mono text-xs px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded transition-all"
                    >
                      RETRY
                    </button>
                  </div>
                ) : events.length === 0 ? (
                  <div className="border border-dashed border-[#00ff9f]/15 rounded-lg p-10 text-center">
                    <Radio className="w-8 h-8 text-[#00ff9f]/20 mx-auto mb-3" />
                    <p className="font-mono text-sm text-white/30">NO TRANSMISSIONS INTERCEPTED</p>
                    <p className="text-xs text-white/20 mt-1">
                      Relays are quiet. Try a different filter or wait for the signal.
                    </p>
                  </div>
                ) : (
                  events.map((event) => (
                    <PostCard key={event.id} event={event} />
                  ))
                )}

                {/* Relay attribution */}
                {!isLoading && events.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-4 pb-2 font-mono text-[9px] text-white/15">
                    <span>SOURCED FROM:</span>
                    {['relay.ditto.pub', 'relay.damus.io', 'relay.primal.net'].map((r) => (
                      <span key={r} className="px-1.5 py-0.5 border border-white/5 rounded">{r}</span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="space-y-6">
            {/* Verified sources list */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00ff9f]/60" />
                <span className="font-mono text-[10px] text-[#00ff9f]/50 uppercase tracking-widest">
                  Verified Sources
                </span>
              </div>
              <div className="space-y-2">
                {VERIFIED_SOURCES.map((source) => (
                  <SourceCard key={source.pubkey} source={source} />
                ))}
              </div>
            </div>

            {/* Hashtag cloud */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-3.5 h-3.5 text-[#00ff9f]/40" />
                <span className="font-mono text-[10px] text-[#00ff9f]/50 uppercase tracking-widest">
                  Tracked Topics
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRIVACY_HASHTAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setActiveTab('community');
                      setActiveHashtag(activeHashtag === tag ? undefined : tag);
                    }}
                    className={`font-mono text-[10px] px-2 py-0.5 rounded border transition-all ${
                      activeHashtag === tag && activeTab === 'community'
                        ? 'border-[#00ff9f]/50 bg-[#00ff9f]/15 text-[#00ff9f]'
                        : 'border-white/10 text-white/30 hover:border-[#00ff9f]/20 hover:text-white/50'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Protocol note */}
            <div className="p-4 border border-[#00ff9f]/10 rounded-lg bg-[#00ff9f]/[0.01]">
              <p className="font-mono text-[10px] text-[#00ff9f]/50 uppercase tracking-widest mb-2">
                // how this works
              </p>
              <p className="text-xs text-white/35 leading-relaxed">
                Events are fetched live from Nostr relays via WebSocket. Verified sources are
                author-filtered by known hex pubkeys — nobody can impersonate them.
                Community events are queried by hashtag with no author restriction.
                Your data never touches our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
