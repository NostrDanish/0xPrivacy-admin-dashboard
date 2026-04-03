import { useState } from 'react';
import { useCypherpunkFeed, FEED_TAGS } from '@/hooks/useCypherpunkFeed';
import { FeedCard, FeedCardSkeleton } from '@/components/FeedCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface FeedSectionProps {
  id?: string;
}

export function FeedSection({ id }: FeedSectionProps) {
  const [activeTag, setActiveTag] = useState<string | undefined>(undefined);
  const { data: events, isLoading, isError, refetch, isFetching } = useCypherpunkFeed(activeTag);

  const displayTags = ['all', ...FEED_TAGS];

  return (
    <section id={id} className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-green-600 tracking-widest uppercase">
                [DECENTRALIZED STREAM]
              </span>
            </div>
            <h2 className="font-mono text-2xl font-bold text-green-400 terminal-glow">
              &gt; Live Nostr Feed
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Real-time dispatches from the privacy underground. No algorithm. No censorship.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="font-mono text-xs border-green-500/30 text-green-500 hover:bg-green-500/10 hover:border-green-500/60 shrink-0"
          >
            <RefreshCw className={`w-3 h-3 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {displayTags.map((tag) => {
            const isActive = tag === 'all' ? !activeTag : activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === 'all' ? undefined : tag)}
                className={`font-mono text-[10px] px-2.5 py-1 rounded border tracking-wider uppercase transition-all duration-150 ${
                  isActive
                    ? 'border-green-500/60 bg-green-500/15 text-green-400'
                    : 'border-green-500/15 bg-transparent text-green-700 hover:border-green-500/35 hover:text-green-500'
                }`}
              >
                {tag === 'all' ? '◈ ALL' : `#${tag}`}
              </button>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-2 mb-4 font-mono text-[10px] text-muted-foreground">
          {isError ? (
            <>
              <WifiOff className="w-3 h-3 text-red-500" />
              <span className="text-red-500">RELAY ERROR — retrying...</span>
            </>
          ) : (
            <>
              <Wifi className={`w-3 h-3 ${isFetching ? 'text-green-500 animate-pulse' : 'text-green-700'}`} />
              <span>{isFetching ? 'FETCHING FROM RELAYS...' : `${events?.length ?? 0} EVENTS LOADED`}</span>
            </>
          )}
        </div>

        {/* Feed grid */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <FeedCardSkeleton key={i} />)
          ) : isError ? (
            <div className="border border-red-500/30 bg-red-500/5 rounded p-6 text-center">
              <p className="font-mono text-sm text-red-400">RELAY CONNECTION FAILED</p>
              <p className="text-xs text-muted-foreground mt-1">
                Check your relay configuration. The mesh persists.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-3 font-mono text-xs border-red-500/30 text-red-400"
              >
                RETRY
              </Button>
            </div>
          ) : events?.length === 0 ? (
            <div className="border border-dashed border-green-500/20 rounded p-8 text-center">
              <p className="font-mono text-sm text-muted-foreground">
                NO TRANSMISSIONS INTERCEPTED
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                The relays are quiet. Try a different filter or wait for the signal.
              </p>
            </div>
          ) : (
            events?.map((event) => <FeedCard key={event.id} event={event} />)
          )}
        </div>

        {/* Relay attribution */}
        <div className="mt-6 flex items-center gap-2 font-mono text-[10px] text-green-500/30">
          <span>DATA SOURCE:</span>
          <Badge variant="outline" className="font-mono text-[9px] border-green-500/15 text-green-700 px-1.5">
            relay.ditto.pub
          </Badge>
          <Badge variant="outline" className="font-mono text-[9px] border-green-500/15 text-green-700 px-1.5">
            relay.damus.io
          </Badge>
          <Badge variant="outline" className="font-mono text-[9px] border-green-500/15 text-green-700 px-1.5">
            relay.primal.net
          </Badge>
        </div>
      </div>
    </section>
  );
}
