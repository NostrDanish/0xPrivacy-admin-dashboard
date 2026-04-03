export interface MirrorEntry {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'tool' | 'archive';
  cid: string;
  originalUrl?: string;
  gateway: string;
  size?: string;
  addedDate: string;
  tags: string[];
}

/** IPFS gateway URL builder */
export function getGatewayUrl(cid: string, gateway: string = 'https://ipfs.io'): string {
  return `${gateway}/ipfs/${cid}`;
}

export const ipfsGateways = [
  'https://ipfs.io',
  'https://dweb.link',
  'https://cloudflare-ipfs.com',
  'https://gateway.pinata.cloud',
];

export const mirrors: MirrorEntry[] = [
  {
    id: 'privacy-guide-eff',
    title: 'EFF Surveillance Self-Defense Guide',
    description: 'The Electronic Frontier Foundation\'s comprehensive guide to protecting yourself from digital surveillance. Mirrored in case the original ever goes dark.',
    type: 'document',
    cid: 'QmExampleCID1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2w',
    originalUrl: 'https://ssd.eff.org/',
    gateway: 'https://ipfs.io',
    size: '12 MB',
    addedDate: '2025-12-01',
    tags: ['eff', 'surveillance', 'guide', 'digital-rights'],
  },
  {
    id: 'tor-browser-archive',
    title: 'Tor Browser Installer Archive',
    description: 'Latest Tor Browser installers for all platforms. If torproject.org ever gets blocked in your region, grab it from IPFS.',
    type: 'tool',
    cid: 'QmExampleCID2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3t',
    originalUrl: 'https://www.torproject.org/download/',
    gateway: 'https://ipfs.io',
    size: '95 MB',
    addedDate: '2025-11-15',
    tags: ['tor', 'browser', 'installer', 'censorship-resistant'],
  },
  {
    id: 'monero-whitepaper',
    title: 'CryptoNote v2.0 Whitepaper (Monero Foundation)',
    description: 'The foundational whitepaper behind Monero\'s privacy technology. Immutable, forever accessible on IPFS.',
    type: 'document',
    cid: 'QmExampleCID3uV4wX5yZ6aB7cD8eF9gH0iJ1kL2mN3oP4q',
    originalUrl: 'https://www.getmonero.org/resources/research-lab/',
    gateway: 'https://ipfs.io',
    size: '340 KB',
    addedDate: '2025-10-20',
    tags: ['monero', 'whitepaper', 'cryptonote', 'research'],
  },
  {
    id: 'snowden-permanent-record',
    title: 'Edward Snowden - "Why Privacy Matters" (TEDx)',
    description: 'Snowden\'s powerful talk on why privacy is a fundamental human right. Mirrored because important ideas should be unstoppable.',
    type: 'video',
    cid: 'QmExampleCID4rS5tU6vW7xY8zA9bC0dE1fG2hI3jK4lM5n',
    gateway: 'https://ipfs.io',
    size: '210 MB',
    addedDate: '2025-09-05',
    tags: ['snowden', 'privacy', 'talk', 'video'],
  },
  {
    id: 'gpg-handbook',
    title: 'GNU Privacy Handbook',
    description: 'Complete guide to GPG encryption. Learn to sign, encrypt, and verify - the building blocks of digital trust.',
    type: 'document',
    cid: 'QmExampleCID5oP6qR7sT8uV9wX0yZ1aB2cD3eF4gH5iJ6k',
    originalUrl: 'https://www.gnupg.org/gph/en/manual.html',
    gateway: 'https://ipfs.io',
    size: '2.5 MB',
    addedDate: '2025-08-12',
    tags: ['gpg', 'encryption', 'handbook', 'pgp'],
  },
  {
    id: 'privacy-tools-list',
    title: 'PrivacyGuides.org Full Recommendations Archive',
    description: 'A complete snapshot of PrivacyGuides.org recommendations. Because even privacy guides need a backup plan.',
    type: 'archive',
    cid: 'QmExampleCID6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7h',
    originalUrl: 'https://www.privacyguides.org/',
    gateway: 'https://ipfs.io',
    size: '8 MB',
    addedDate: '2025-07-28',
    tags: ['privacy-guides', 'recommendations', 'archive', 'tools'],
  },
  {
    id: 'invizible-apk',
    title: 'InviZible Pro APK (Open Source Build)',
    description: 'The InviZible Pro Android APK from F-Droid. All-in-one Tor + DNSCrypt + I2P for Android, mirrored to IPFS so it\'s always available even in regions where app stores are censored.',
    type: 'tool',
    cid: 'QmExampleCID7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8j',
    originalUrl: 'https://invizible.net/en/',
    gateway: 'https://ipfs.io',
    size: '18 MB',
    addedDate: '2026-01-15',
    tags: ['invizible', 'android', 'tor', 'apk', 'dnscrypt', 'i2p'],
  },
  {
    id: 'newpipe-apk',
    title: 'NewPipe APK (Latest Stable)',
    description: 'The NewPipe Android APK for watching YouTube without Google tracking. Mirrored because privacy tools should never depend on a single download source.',
    type: 'tool',
    cid: 'QmExampleCID8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9l',
    originalUrl: 'https://newpipe.net/',
    gateway: 'https://ipfs.io',
    size: '10 MB',
    addedDate: '2026-02-03',
    tags: ['newpipe', 'android', 'youtube', 'privacy', 'apk'],
  },
  {
    id: 'freetube-desktop',
    title: 'FreeTube Desktop App Archive',
    description: 'FreeTube desktop application for all platforms. A privacy-respecting YouTube client that never touches Google servers. Pinned so it survives any takedown attempt.',
    type: 'tool',
    cid: 'QmExampleCID9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0n',
    originalUrl: 'https://freetubeapp.io/',
    gateway: 'https://ipfs.io',
    size: '85 MB',
    addedDate: '2026-02-10',
    tags: ['freetube', 'desktop', 'youtube', 'privacy', 'cross-platform'],
  },
  {
    id: 'keep-android-open-resources',
    title: 'Keep Android Open Campaign Resources',
    description: 'Full archive of the Keep Android Open campaign materials, including the FreeDroidWarn library source code and documentation. The fight for open Android, preserved forever.',
    type: 'archive',
    cid: 'QmExampleCID10S0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO',
    originalUrl: 'https://keepandroidopen.org/',
    gateway: 'https://ipfs.io',
    size: '4 MB',
    addedDate: '2026-03-01',
    tags: ['keep-android-open', 'sideloading', 'freedom', 'android', 'campaign'],
  },
];
