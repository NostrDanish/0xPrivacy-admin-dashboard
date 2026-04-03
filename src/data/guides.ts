export interface Guide {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  category: string;
  tags: string[];
  content: string; // Markdown content
}

export const guides: Guide[] = [
  {
    id: 'tor-setup',
    title: 'Setting Up Tor Browser: Your First Step to Anonymity',
    description: 'A complete beginner\'s guide to downloading, verifying, and using Tor Browser safely. From installation to best practices.',
    difficulty: 'beginner',
    readTime: '8 min',
    category: 'Browsing',
    tags: ['tor', 'anonymity', 'browsing', 'beginner'],
    content: `## Why Tor?

Every time you visit a website, your IP address is logged. Your ISP sees everything. Governments request that data. Tor breaks this surveillance chain.

### Step 1: Download Tor Browser

Go to the official Tor Project website: **[torproject.org](https://www.torproject.org/)**

> **WARNING**: Never download Tor from any other source. Verify the download signature.

### Step 2: Verify the Download

On Linux/Mac:
\`\`\`bash
gpg --auto-key-locate nodefault,wkd --locate-keys torbrowser@torproject.org
gpg --verify tor-browser-*.asc
\`\`\`

### Step 3: Install and Configure

1. Extract the downloaded archive
2. Run \`start-tor-browser\` (Linux) or open the app (Mac/Windows)
3. Click **"Connect"** on the first screen
4. Wait for the Tor circuit to establish

### Step 4: Best Practices

- **Never maximize the window** - your screen resolution identifies you
- **Don't install additional extensions** - they create fingerprints
- **Use HTTPS-only mode** - it's enabled by default
- **Don't torrent over Tor** - it leaks your real IP
- **Use .onion sites** when available for end-to-end encryption

### Step 5: Test Your Setup

Visit [check.torproject.org](https://check.torproject.org/) to confirm you're connected through Tor.

---

*You are now browsing with layers of encryption between you and surveillance. Welcome to the resistance.*`,
  },
  {
    id: 'nostr-identity',
    title: 'Create Your Censorship-Proof Identity with Nostr',
    description: 'Learn how to generate your Nostr keys, pick a client, set up NIP-05 verification, and start posting where no one can silence you.',
    difficulty: 'beginner',
    readTime: '10 min',
    category: 'Identity',
    tags: ['nostr', 'identity', 'decentralized', 'social'],
    content: `## What is Nostr?

Nostr (Notes and Other Stuff Transmitted by Relays) is an open protocol for censorship-resistant communication. No company owns it. No one can ban you. Your keys are your identity.

### Step 1: Understand Keys

- **npub** (public key): Your username. Share it freely.
- **nsec** (secret key): Your password. NEVER share this. Ever.
- **NIP-05**: A human-readable verification (like an email) linked to your npub.

### Step 2: Generate Your Keys

Use one of these trusted clients:

- **Damus** (iOS): Download from App Store
- **Amethyst** (Android): Download from F-Droid or Play Store
- **Primal** (Web/iOS/Android): Visit [primal.net](https://primal.net)
- **nos2x** or **Alby** (Browser extension): For web clients

### Step 3: Back Up Your Keys

\`\`\`
YOUR NSEC IS YOUR IDENTITY.
IF YOU LOSE IT, YOU LOSE EVERYTHING.
IF SOMEONE STEALS IT, THEY BECOME YOU.
\`\`\`

Write your nsec on paper. Store it in a safe. Consider a metal seed plate.

### Step 4: Set Up NIP-05 Verification

A NIP-05 identifier (like \`you@0xPrivacy.online\`) proves you're the real you. It's DNS-based verification for Nostr.

To get verified on 0xPrivacy.online, join our community and contribute.

### Step 5: Connect to Relays

Add these reliable relays:
- \`wss://relay.damus.io\`
- \`wss://relay.primal.net\`
- \`wss://nos.lol\`

---

*Your identity is now yours forever. No CEO can delete you. No algorithm can silence you. Welcome to Nostr.*`,
  },
  {
    id: 'monero-basics',
    title: 'Monero: Using Truly Private Digital Cash',
    description: 'Set up a Monero wallet, understand ring signatures, and learn how to transact without leaving a trail.',
    difficulty: 'intermediate',
    readTime: '12 min',
    category: 'Finance',
    tags: ['monero', 'cryptocurrency', 'privacy', 'finance'],
    content: `## Why Monero Over Bitcoin?

Bitcoin is a transparent ledger. Every transaction is public. Chain analysis companies track every satoshi. Monero fixes this.

### How Monero Hides Everything

- **Ring Signatures**: Your transaction is mixed with decoys, making the real sender unidentifiable
- **Stealth Addresses**: One-time addresses generated for every transaction
- **RingCT**: Transaction amounts are cryptographically hidden
- **Dandelion++**: Your IP address is obscured when broadcasting transactions

### Step 1: Choose a Wallet

- **Cake Wallet** (Mobile): Great for beginners
- **Feather Wallet** (Desktop): Advanced, Tor-integrated
- **Monero GUI** (Desktop): Official wallet with full node option

### Step 2: Get Some Monero

- **LocalMonero** (P2P): Trade directly with individuals
- **TradeOgre**: No-KYC exchange
- **Atomic Swaps**: Swap BTC for XMR trustlessly

### Step 3: Best Practices

\`\`\`
1. Run your own node (or use a trusted remote node over Tor)
2. Use subaddresses for each counterparty
3. Wait for 10 confirmations before considering a transaction final
4. Never share your view key publicly
5. Use Tor or I2P when connecting to remote nodes
\`\`\`

### Step 4: Advanced - Running Your Own Node

\`\`\`bash
# Download monerod
# Run with Tor:
monerod --proxy 127.0.0.1:9050 --anonymous-inbound YOUR_ONION_ADDRESS:18083
\`\`\`

---

*Your money is now truly yours. No one can see your balance, trace your spending, or freeze your funds. Financial sovereignty achieved.*`,
  },
  {
    id: 'threat-modeling',
    title: 'Threat Modeling: Know Your Adversary',
    description: 'Before you can defend yourself, you need to know what you\'re defending against. Learn how to assess your personal threat model.',
    difficulty: 'beginner',
    readTime: '7 min',
    category: 'Fundamentals',
    tags: ['threat-model', 'security', 'fundamentals', 'beginner'],
    content: `## The First Rule of Privacy

**You don't need to hide everything from everyone.** You need to know what to hide, from whom, and why.

### Ask Yourself These Questions

1. **What am I protecting?** (Messages, browsing history, financial data, identity)
2. **Who am I protecting it from?** (Advertisers, hackers, employers, governments)
3. **What happens if I fail?** (Embarrassment, job loss, legal trouble, physical danger)
4. **How much effort am I willing to invest?**

### Threat Levels

#### Level 1: Privacy from Corporations
- **Tools**: Firefox + uBlock Origin, ProtonMail, DuckDuckGo
- **Effort**: Low
- **Protects against**: Ad tracking, data harvesting, profile building

#### Level 2: Privacy from Surveillance
- **Tools**: Tor Browser, VPN (Mullvad), Signal, disk encryption
- **Effort**: Medium
- **Protects against**: ISP monitoring, mass surveillance, warrantless data requests

#### Level 3: Operational Security
- **Tools**: Tails OS, Monero, Nostr, SimpleX, VeraCrypt hidden volumes
- **Effort**: High
- **Protects against**: Targeted surveillance, forensic analysis, state-level adversaries

#### Level 4: Maximum Anonymity
- **Tools**: Air-gapped systems, Tor + bridges, cash-bought hardware, dead drops
- **Effort**: Very High
- **Protects against**: Nation-state level adversaries with unlimited resources

### Building Your Personal Model

\`\`\`
1. List your digital activities for a week
2. For each activity, identify what data it generates
3. Determine who has access to that data
4. Assess the risk if that data were exposed
5. Apply appropriate tools from your threat level
\`\`\`

---

*Privacy is not about having something to hide. It's about having something to protect. Start with your threat model, then build your defenses.*`,
  },
];
