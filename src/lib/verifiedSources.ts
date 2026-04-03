/**
 * Curated verified privacy/security/freedom-tech sources on Nostr.
 * These are real, known accounts. Hex pubkeys pulled directly from their kind:0 events.
 * Filter by `authors` on queries — Nostr is permissionless, author filtering is mandatory.
 */

export interface VerifiedSource {
  pubkey: string; // hex
  handle: string;
  displayName: string;
  description: string;
  category: 'privacy' | 'security' | 'cypherpunk' | 'bitcoin' | 'nostr-dev' | 'journalism';
  nip05?: string;
  website?: string;
}

export const VERIFIED_SOURCES: VerifiedSource[] = [
  // ── Whistleblowers / Journalists ─────────────────────────────────────────
  {
    pubkey: '84dee6e676e5bb67b4ad4e042cf70cbd8681155db535942fcc6a0533858a7240',
    handle: 'Snowden',
    displayName: 'Edward Snowden',
    description: 'NSA whistleblower. Author of Permanent Record. Privacy advocate.',
    category: 'privacy',
    nip05: 'Snowden@Nostr-Check.com',
    website: 'edwardsnowden.substack.com',
  },

  // ── Nostr Core Devs ──────────────────────────────────────────────────────
  {
    pubkey: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
    handle: 'fiatjaf',
    displayName: 'fiatjaf',
    description: 'Creator of Nostr protocol. Open source dev.',
    category: 'nostr-dev',
    nip05: '_@fiatjaf.com',
    website: 'https://fiatjaf.com',
  },
  {
    pubkey: '32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245',
    handle: 'jb55',
    displayName: 'jb55',
    description: 'Created Damus iOS client, npubs, and zaps. Bitcoin + Lightning dev.',
    category: 'nostr-dev',
    nip05: '_@jb55.com',
    website: 'https://damus.io',
  },
  {
    pubkey: '82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2',
    handle: 'jack',
    displayName: 'jack',
    description: 'No state is the best state.',
    category: 'bitcoin',
    website: 'https://primal.net',
  },

  // ── Bitcoin / Privacy Finance ─────────────────────────────────────────────
  {
    pubkey: 'fa984bd7dbb282f07e16e7ae87b26a2a7b9b90b7246a44771f0cf5ae58018f52',
    handle: 'pablof7z',
    displayName: 'Pablo',
    description: 'Bitcoin, Nostr. NDK author.',
    category: 'nostr-dev',
  },
  {
    pubkey: 'a341f45ff9758f570a21b000c17d4e53a3a497c8397f26c0e6d61e5acffc7a98',
    handle: 'lyn',
    displayName: 'Lyn Alden',
    description: 'Macroeconomist, investment analyst. Bitcoin and monetary sovereignty.',
    category: 'bitcoin',
  },
];

/** All verified pubkeys as an array — use in Nostr query `authors` filter */
export const VERIFIED_PUBKEYS = VERIFIED_SOURCES.map((s) => s.pubkey);

/** Privacy-focused hashtags to track in the community feed */
export const PRIVACY_HASHTAGS = [
  'privacy',
  'cypherpunk',
  'opsec',
  'tor',
  'nostr',
  'bitcoin',
  'monero',
  'surveillance',
  'decentralization',
  'freedom',
  'cryptography',
  'selfcustody',
  'infosec',
  'openbsd',
] as const;

export type PrivacyHashtag = typeof PRIVACY_HASHTAGS[number];

/** Categories for filtering the feed */
export const SOURCE_CATEGORIES = [
  { id: 'all', label: 'All Sources' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'security', label: 'Security' },
  { id: 'cypherpunk', label: 'Cypherpunk' },
  { id: 'bitcoin', label: 'Bitcoin' },
  { id: 'nostr-dev', label: 'Nostr Dev' },
  { id: 'journalism', label: 'Journalism' },
] as const;
