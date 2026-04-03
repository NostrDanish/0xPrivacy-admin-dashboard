/**
 * Read and decrypt incoming submission DMs sent to the support pubkey.
 * Only works when logged in as an admin.
 *
 * Queries kind:4 events addressed to the support pubkey,
 * then decrypts them using the logged-in user's NIP-04 signer.
 */
import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { SUPPORT_PUBKEY } from '@/lib/adminConfig';

export interface DecryptedSubmission {
  id: string;
  senderPubkey: string;
  topic: string;
  extraTags: string[];
  plaintext: string;
  createdAt: number;
  raw: {
    kind: number;
    id: string;
    pubkey: string;
    content: string;
    tags: string[][];
    created_at: number;
    sig: string;
  };
}

export function useAdminInbox(limit = 50) {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const { isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['admin-inbox', user?.pubkey, limit],
    enabled: isAdmin && !!user?.signer?.nip04,
    queryFn: async (): Promise<DecryptedSubmission[]> => {
      if (!user?.signer?.nip04) return [];

      // Query DMs sent TO the support pubkey
      const events = await nostr.query([
        {
          kinds: [4],
          '#p': [SUPPORT_PUBKEY],
          limit,
        },
      ]);

      // Decrypt each event
      const results: DecryptedSubmission[] = [];

      for (const event of events) {
        try {
          const plaintext = await user.signer.nip04!.decrypt(event.pubkey, event.content);

          // Extract topic from 't' tag (cleartext)
          const tTags = event.tags.filter(([n]) => n === 't').map(([, v]) => v);
          const topic = tTags[0] ?? 'other';
          const extraTags = tTags.slice(1);

          results.push({
            id: event.id,
            senderPubkey: event.pubkey,
            topic,
            extraTags,
            plaintext,
            createdAt: event.created_at,
            raw: event as DecryptedSubmission['raw'],
          });
        } catch {
          // Can't decrypt — skip (might be from another conversation)
        }
      }

      return results.sort((a, b) => b.createdAt - a.createdAt);
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
