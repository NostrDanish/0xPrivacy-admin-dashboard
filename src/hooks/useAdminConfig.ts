/**
 * useAdminConfig — reads and writes 0xPrivacy app configuration via NIP-78 (kind:30078).
 *
 * SECURITY: ALL reads are filtered by authors: [OWNER_PUBKEY].
 * Nobody else's kind:30078 events are ever trusted by this app.
 */
import { useNostr } from '@nostrify/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  OWNER_PUBKEY,
  CONFIG_D_TAGS,
  DEFAULT_CONFIG,
  type AppConfig,
  type AdminVerifiedSource,
  type RssFeed,
} from '@/lib/adminConfig';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const QUERY_KEY = ['admin-config'];

/** Read the full app config from Nostr (NIP-78, owner-filtered) */
export function useAdminConfig() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<AppConfig> => {
      // Query all config d-tags in one round trip
      const events = await nostr.query([
        {
          kinds: [30078],
          authors: [OWNER_PUBKEY], // CRITICAL — only trust owner
          '#d': Object.values(CONFIG_D_TAGS),
          limit: 20,
        },
      ]);

      // Build config by merging the latest event for each d-tag
      const config: AppConfig = { ...DEFAULT_CONFIG };

      const getLatest = (dtag: string) => {
        const matching = events
          .filter((e) => e.tags.find(([n, v]) => n === 'd' && v === dtag))
          .sort((a, b) => b.created_at - a.created_at);
        return matching[0] ?? null;
      };

      // Admins
      const adminsEvent = getLatest(CONFIG_D_TAGS.ADMINS);
      if (adminsEvent) {
        try {
          const data = JSON.parse(adminsEvent.content);
          if (Array.isArray(data.admins)) {
            // Owner is ALWAYS included, even if they forgot to put themselves
            config.admins = [...new Set([OWNER_PUBKEY, ...data.admins])];
          }
        } catch { /* bad JSON, use default */ }
      }

      // Verified sources
      const sourcesEvent = getLatest(CONFIG_D_TAGS.VERIFIED_SOURCES);
      if (sourcesEvent) {
        try {
          const data = JSON.parse(sourcesEvent.content);
          if (Array.isArray(data.sources)) {
            config.verifiedSources = data.sources;
          }
        } catch { /* bad JSON */ }
      }

      // RSS feeds
      const rssEvent = getLatest(CONFIG_D_TAGS.RSS_FEEDS);
      if (rssEvent) {
        try {
          const data = JSON.parse(rssEvent.content);
          if (Array.isArray(data.feeds)) {
            config.rssFeeds = data.feeds;
          }
        } catch { /* bad JSON */ }
      }

      // Hashtags
      const hashtagsEvent = getLatest(CONFIG_D_TAGS.HASHTAGS);
      if (hashtagsEvent) {
        try {
          const data = JSON.parse(hashtagsEvent.content);
          if (Array.isArray(data.hashtags)) {
            config.hashtags = data.hashtags;
          }
        } catch { /* bad JSON */ }
      }

      config.updatedAt = Date.now();
      return config;
    },
    staleTime: 5 * 60_000, // 5 min
    gcTime: 30 * 60_000,
  });
}

/** Write a specific config section to Nostr (NIP-78 kind:30078) */
function useWriteConfig(dTag: string) {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: object) => {
      if (!user) throw new Error('Not logged in');

      const event = await user.signer.signEvent({
        kind: 30078,
        content: JSON.stringify(content),
        tags: [['d', dTag]],
        created_at: Math.floor(Date.now() / 1000),
      });

      await nostr.event(event, { signal: AbortSignal.timeout(8000) });
      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

/** Save the full admins list (owner only) */
export function useSaveAdmins() {
  return useWriteConfig(CONFIG_D_TAGS.ADMINS);
}

/** Save verified sources list */
export function useSaveVerifiedSources() {
  return useWriteConfig(CONFIG_D_TAGS.VERIFIED_SOURCES);
}

/** Save RSS feeds list */
export function useSaveRssFeeds() {
  return useWriteConfig(CONFIG_D_TAGS.RSS_FEEDS);
}

/** Save hashtags list */
export function useSaveHashtags() {
  return useWriteConfig(CONFIG_D_TAGS.HASHTAGS);
}
