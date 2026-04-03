import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import type { NostrEvent } from '@nostrify/nostrify';

// Cypherpunk/privacy community hashtags to track
const PRIVACY_TAGS = ['privacy', 'cypherpunk', 'nostr', 'bitcoin', 'opsec', 'freedom', 'decentralization', 'cryptography', 'selfcustody'];

export function useCypherpunkFeed(tag?: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['cypherpunk-feed', tag],
    queryFn: async () => {
      const targetTags = tag ? [tag] : PRIVACY_TAGS.slice(0, 3);

      // Build filters — one per tag to maximize relay hits
      const filters = targetTags.map((t) => ({
        kinds: [1],
        '#t': [t],
        limit: 10,
      }));

      const events = await nostr.query(filters);

      // Deduplicate by ID, sort by created_at descending
      const seen = new Set<string>();
      const unique: NostrEvent[] = [];
      for (const e of events) {
        if (!seen.has(e.id) && e.content.trim().length > 10) {
          seen.add(e.id);
          unique.push(e);
        }
      }
      return unique.sort((a, b) => b.created_at - a.created_at).slice(0, 30);
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export const FEED_TAGS = PRIVACY_TAGS;
