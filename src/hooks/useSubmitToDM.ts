/**
 * Send a tagged submission DM to the 0xPrivacy support pubkey.
 * Uses NIP-04 (AES-256-CBC) encrypted direct messages (kind:4).
 *
 * Message format (plaintext before encryption):
 *   TOPIC: #<topic>
 *   ---
 *   <user message>
 *
 * The topic is also added as a cleartext 't' tag on the event so admins
 * can filter submissions by topic at the relay level without decrypting.
 */
import { useMutation } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { SUPPORT_PUBKEY } from '@/lib/adminConfig';
import type { SubmissionTopicId } from '@/lib/adminConfig';

interface SubmitArgs {
  topic: SubmissionTopicId;
  message: string;
  extraTags?: string[]; // additional user-chosen tags
}

export function useSubmitToDM() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();

  return useMutation({
    mutationFn: async ({ topic, message, extraTags = [] }: SubmitArgs) => {
      if (!user) throw new Error('Not logged in');
      if (!user.signer.nip04) throw new Error('NIP-04 encryption not supported by your signer');

      // Build the plaintext — topic header + message
      const allTags = [topic, ...extraTags].map((t) => `#${t}`).join(' ');
      const plaintext = `${allTags}\n---\n${message.trim()}`;

      // Encrypt with NIP-04 (AES-256-CBC shared secret)
      const encrypted = await user.signer.nip04.encrypt(SUPPORT_PUBKEY, plaintext);

      // Build the event — cleartext topic 't' tag enables relay-level filtering
      const event = await user.signer.signEvent({
        kind: 4,
        content: encrypted,
        tags: [
          ['p', SUPPORT_PUBKEY],
          ['t', topic],           // relay-indexable topic
          ...extraTags.map((t) => ['t', t]),
        ],
        created_at: Math.floor(Date.now() / 1000),
      });

      await nostr.event(event, { signal: AbortSignal.timeout(8000) });
      return event;
    },
  });
}
