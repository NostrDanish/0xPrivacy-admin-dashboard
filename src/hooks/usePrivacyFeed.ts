import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import type { NostrEvent } from '@nostrify/nostrify';
import { VERIFIED_PUBKEYS, PRIVACY_HASHTAGS } from '@/lib/verifiedSources';

/**
 * Fetches kind:1 notes from verified privacy/cypherpunk sources.
 * Author-filtered — only trust events from known verified pubkeys.
 */
export function useVerifiedFeed(limit = 30) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['verified-feed', limit],
    queryFn: async () => {
      const events = await nostr.query([
        {
          kinds: [1],
          authors: VERIFIED_PUBKEYS, // CRITICAL: author filter
          limit,
        },
      ]);
      return dedup(events).sort((a, b) => b.created_at - a.created_at);
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}

/**
 * Fetches kind:1 notes from the open community tagged with privacy hashtags.
 * No author filter here — this is the open community stream.
 */
export function useCommunityFeed(tag?: string, limit = 40) {
  const { nostr } = useNostr();
  const tags = tag ? [tag] : ['privacy', 'cypherpunk', 'opsec'];

  return useQuery({
    queryKey: ['community-feed', tag, limit],
    queryFn: async () => {
      // Query all selected tags in one round-trip, separated filters
      const filters = tags.map((t) => ({
        kinds: [1],
        '#t': [t],
        limit: Math.ceil(limit / tags.length) + 5,
      }));
      const events = await nostr.query(filters);
      return dedup(events)
        .filter((e) => e.content.trim().length > 20)
        .sort((a, b) => b.created_at - a.created_at)
        .slice(0, limit);
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

/**
 * Combined feed: verified sources + community, merged and sorted by time.
 */
export function useMixedFeed(limit = 50) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['mixed-feed', limit],
    queryFn: async () => {
      const [verifiedEvents, communityEvents] = await Promise.all([
        nostr.query([
          {
            kinds: [1],
            authors: VERIFIED_PUBKEYS,
            limit: 20,
          },
        ]),
        nostr.query(
          ['privacy', 'cypherpunk', 'nostr', 'opsec'].map((t) => ({
            kinds: [1],
            '#t': [t],
            limit: 10,
          }))
        ),
      ]);

      const all = dedup([...verifiedEvents, ...communityEvents]);
      return all
        .filter((e) => e.content.trim().length > 10)
        .sort((a, b) => b.created_at - a.created_at)
        .slice(0, limit);
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

/** Fetch a single author's recent notes */
export function useAuthorFeed(pubkey: string, limit = 20) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['author-feed', pubkey, limit],
    queryFn: async () => {
      const events = await nostr.query([
        {
          kinds: [1],
          authors: [pubkey],
          limit,
        },
      ]);
      return events.sort((a, b) => b.created_at - a.created_at);
    },
    staleTime: 60_000,
    enabled: !!pubkey,
  });
}

function dedup(events: NostrEvent[]): NostrEvent[] {
  const seen = new Set<string>();
  const result: NostrEvent[] = [];
  for (const e of events) {
    if (!seen.has(e.id)) {
      seen.add(e.id);
      result.push(e);
    }
  }
  return result;
}

export { PRIVACY_HASHTAGS };
