/**
 * 0xPrivacy Admin Configuration
 *
 * SECURITY MODEL:
 * - OWNER_PUBKEY is the one and only sovereign. Only they can add/remove admins.
 * - ADMIN_PUBKEYS is managed on-chain via NIP-78. Never hardcode anyone else here.
 * - All admin config is stored as kind:30078 addressable events signed by OWNER_PUBKEY.
 * - The app ONLY trusts config events authored by OWNER_PUBKEY.
 * - Nostr is permissionless — anyone can publish any kind. Author filtering is MANDATORY.
 */

/** nostrdanish — the one sovereign owner. Cannot be changed except by modifying code. */
export const OWNER_PUBKEY = 'c45041618951bb6012ac23f5cdf3d740465f2d640be841fd9bb1d0733370cd3c';

/** 0xPrivacy project account — receives community submission DMs */
export const SUPPORT_PUBKEY = OWNER_PUBKEY; // same for now; separate account can be set

/** NIP-78 app identifier d-tags */
export const CONFIG_D_TAGS = {
  ADMINS: '0xprivacy:admins',
  VERIFIED_SOURCES: '0xprivacy:verified-sources',
  RSS_FEEDS: '0xprivacy:rss-feeds',
  TOOLS: '0xprivacy:tools-extra',
  MIRRORS: '0xprivacy:mirrors-extra',
  HASHTAGS: '0xprivacy:hashtags',
} as const;

/** Submission topic tags — used in DM topic picker */
export const SUBMISSION_TOPICS = [
  { id: 'verified', label: '#verified', description: 'Suggest a verified Nostr account to follow', color: '#00ff9f' },
  { id: 'livefeed', label: '#livefeed', description: 'Suggest a hashtag or feed source', color: '#00ff9f' },
  { id: 'rss', label: '#rss', description: 'Submit an RSS/Atom feed URL', color: '#00ffff' },
  { id: 'tool', label: '#tool', description: 'Submit a privacy tool', color: '#00ffff' },
  { id: 'mirror', label: '#mirror', description: 'Submit an IPFS-pinned resource CID', color: '#bf5af2' },
  { id: 'guide', label: '#guide', description: 'Submit or suggest a privacy guide', color: '#bf5af2' },
  { id: 'news', label: '#news', description: 'Share a privacy/security news story', color: '#ff9f00' },
  { id: 'bug', label: '#bug', description: 'Report a bug or issue', color: '#ff453a' },
  { id: 'other', label: '#other', description: 'General feedback or suggestion', color: '#8e8e93' },
] as const;

export type SubmissionTopicId = typeof SUBMISSION_TOPICS[number]['id'];

/** Schema for verified source entries stored in NIP-78 */
export interface AdminVerifiedSource {
  pubkey: string;
  handle: string;
  displayName: string;
  description: string;
  category: string;
  nip05?: string;
  website?: string;
  addedBy: string; // admin pubkey who added it
  addedAt: number; // unix timestamp
}

/** Schema for RSS feed entries */
export interface RssFeed {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  addedBy: string;
  addedAt: number;
}

/** Schema for the full app config stored in NIP-78 */
export interface AppConfig {
  admins: string[]; // hex pubkeys of admins (owner always admin)
  verifiedSources: AdminVerifiedSource[];
  rssFeeds: RssFeed[];
  hashtags: string[];
  updatedAt: number;
}

/** Default config — used before relay data loads */
export const DEFAULT_CONFIG: AppConfig = {
  admins: [OWNER_PUBKEY],
  verifiedSources: [],
  rssFeeds: [],
  hashtags: [
    'privacy', 'cypherpunk', 'opsec', 'tor', 'nostr',
    'bitcoin', 'monero', 'surveillance', 'decentralization', 'freedom',
    'cryptography', 'selfcustody', 'infosec',
  ],
  updatedAt: 0,
};
