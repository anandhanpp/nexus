export const CATEGORIES = [
  { id: 'network', name: 'Network Tools', icon: 'Network' },
  { id: 'passwords-crypto', name: 'Passwords & Crypto', icon: 'Key' },
  { id: 'integrity', name: 'Integrity & Security', icon: 'ShieldCheck' },
];

export const TOOLS = [
  // 1. IP Tracker
  {
    id: 'ip-tracker',
    name: 'IP Tracker',
    category: 'network',
    icon: 'Globe',
    shortDesc: 'Trace IP geolocation, ISP, network owner, and proxy/VPN hints.',
    path: '/tools/ip-tracker',
    status: 'ready',
    metaTitle: 'IP Tracker & Geolocation',
    plainDesc: 'Discover the geographic location, ISP, and network details of any IP address.',
    helpText: [
      'An IP address is like a digital mailing address for devices connected to the internet.',
      'Geolocation estimates city-level proximity based on ISP routing tables, not exact street addresses.',
      'Proxies or VPNs hide original user IP addresses behind an intermediary server.'
    ],
    related: ['mac-recon', 'dns-recon', 'subnet-calculator']
  },
  // 2. MAC Recon
  {
    id: 'mac-recon',
    name: 'MAC Recon',
    category: 'network',
    icon: 'Cpu',
    shortDesc: 'Identify device vendor, unicast/multicast, and randomized MAC addresses.',
    path: '/tools/mac-recon',
    status: 'ready',
    metaTitle: 'MAC Address Reconnaissance',
    plainDesc: 'Determine who manufactured a network hardware interface and detect randomized Wi-Fi privacy addresses.',
    helpText: [
      'A MAC address is a unique hardware identifier assigned to network adapters.',
      'The first 3 octets (OUI) identify the manufacturer (e.g., Apple, Cisco, Intel).',
      'Modern smartphones randomize MAC addresses on Wi-Fi networks to protect user privacy from physical tracking.'
    ],
    related: ['ip-tracker', 'subnet-calculator', 'dns-recon']
  },
  // 3. DNS Recon
  {
    id: 'dns-recon',
    name: 'DNS Recon',
    category: 'network',
    icon: 'Search',
    shortDesc: 'Inspect DNS records and check email anti-spoofing (SPF/DMARC) defenses.',
    path: '/tools/dns-recon',
    status: 'ready',
    metaTitle: 'DNS Records & Phishing Protection Recon',
    plainDesc: 'Query live DNS records via DNS-over-HTTPS and inspect email spoofing defenses.',
    helpText: [
      'DNS converts human-friendly domain names (like github.com) into machine-readable IP addresses.',
      'SPF (Sender Policy Framework) lists authorized mail servers that can send emails for your domain.',
      'DMARC instructs email providers how to treat forged or spoofed messages that fail verification.'
    ],
    related: ['ip-tracker', 'password-auditor', 'subnet-calculator']
  },
  // 4. Subnet Calculator
  {
    id: 'subnet-calculator',
    name: 'Subnet Calculator',
    category: 'network',
    icon: 'Network',
    shortDesc: 'Calculate IP ranges, broadcast, usable hosts, and CIDR masks offline.',
    path: '/tools/subnet-calculator',
    status: 'ready',
    metaTitle: 'IPv4 Subnet & CIDR Calculator',
    plainDesc: 'Calculate network bounds, usable IP addresses, wildcard masks, and binary splits instantly.',
    helpText: [
      'Subnetting partitions large IP networks into smaller, efficient, and secure broadcast domains.',
      'CIDR notation (e.g., /24) represents the number of fixed network bits in a 32-bit IPv4 address.',
      'Usable hosts exclude the network identifier and the broadcast address.'
    ],
    related: ['ip-tracker', 'mac-recon', 'dns-recon']
  },
  // 5. Password Auditor
  {
    id: 'password-auditor',
    name: 'Password Auditor',
    category: 'passwords-crypto',
    icon: 'KeyRound',
    shortDesc: 'Measure entropy, estimated crack time, k-anonymity leak check, and generate keys.',
    path: '/tools/password-auditor',
    status: 'ready',
    metaTitle: 'Password Strength & Breach Auditor',
    plainDesc: 'Evaluate password resilience against brute-force attacks and safely test for past leaks.',
    helpText: [
      'Entropy measures unpredictability: longer passwords with diverse character sets require exponentially more compute to guess.',
      'k-Anonymity sends only the first 5 characters of your password hash; your real password never leaves your browser.',
      'Passphrases of 4-5 random words are typically easier to remember and much harder to crack.'
    ],
    related: ['crypto-engine', 'crypto-vault', 'file-integrity']
  },
  // 6. Cryptographic Engine
  {
    id: 'crypto-engine',
    name: 'Cryptographic Engine',
    category: 'passwords-crypto',
    icon: 'Binary',
    shortDesc: 'Hash (MD5/SHA), encode/decode (Base64/Hex/URL), and encrypt with AES-GCM.',
    path: '/tools/crypto-engine',
    status: 'ready',
    metaTitle: 'Cryptographic Engine & Hasher',
    plainDesc: 'Hash, encode, decode, and encrypt text locally using modern Web Crypto APIs.',
    helpText: [
      'Hashing is a one-way mathematical function; you cannot reverse a hash back to its source text.',
      'Encoding (Base64/Hex/URL) changes format for data transmission and is NOT encryption.',
      'AES-GCM provides authenticated symmetric encryption that protects both secrecy and data integrity.'
    ],
    related: ['crypto-vault', 'file-integrity', 'password-auditor']
  },
  // 7. Crypto Vault
  {
    id: 'crypto-vault',
    name: 'Crypto Vault',
    category: 'passwords-crypto',
    icon: 'Lock',
    shortDesc: 'Securely store and manage encrypted confidential notes locally in your browser.',
    path: '/tools/crypto-vault',
    status: 'ready',
    metaTitle: 'Local Zero-Knowledge Crypto Vault',
    plainDesc: 'Store encrypted secrets and notes on your device with AES-GCM and PBKDF2 derivation.',
    helpText: [
      'Zero-knowledge encryption means all secrets are encrypted on your device before touching storage.',
      'Your master password is never stored anywhere; only an encrypted verification token is retained.',
      'If you lose your master password, encrypted data cannot be recovered by anyone.'
    ],
    related: ['crypto-engine', 'password-auditor', 'file-integrity']
  },
  // 8. File Integrity Monitor
  {
    id: 'file-integrity',
    name: 'File Integrity Monitor',
    category: 'integrity',
    icon: 'ShieldCheck',
    shortDesc: 'Generate SHA-256/512 checksums locally, compare hashes, and track baselines.',
    path: '/tools/file-integrity',
    status: 'ready',
    metaTitle: 'File Integrity & Checksum Verifier',
    plainDesc: 'Verify download integrity and detect unauthorized file modifications completely offline.',
    helpText: [
      'Cryptographic checksums create a unique digital fingerprint for any file.',
      'Even a single changed byte or comma completely changes the resulting SHA-256 hash.',
      'Files are processed purely in your browser memory and never uploaded to any remote server.'
    ],
    related: ['crypto-engine', 'password-auditor', 'crypto-vault']
  },

  // Coming Soon Tools
  {
    id: 'port-scanner',
    name: 'Port Scanner',
    category: 'network',
    icon: 'Radio',
    shortDesc: 'Network service discovery and open port verification.',
    status: 'coming-soon',
    badge: 'Coming Soon'
  },
  {
    id: 'traffic-ids',
    name: 'Traffic Anomaly IDS',
    category: 'network',
    icon: 'Activity',
    shortDesc: 'PCAP packet inspection and unusual protocol stream heuristics.',
    status: 'coming-soon',
    badge: 'Coming Soon'
  },
  {
    id: 'phishing-analyzer',
    name: 'Phishing Analyzer',
    category: 'passwords-crypto',
    icon: 'AlertOctagon',
    shortDesc: 'Inspect suspicious email headers and lookalike homoglyph domains.',
    status: 'coming-soon',
    badge: 'Coming Soon'
  },
  {
    id: 'breach-monitor',
    name: 'Breach Monitor',
    category: 'passwords-crypto',
    icon: 'Fingerprint',
    shortDesc: 'Credential compromise alerts and corporate domain leak feeds.',
    status: 'coming-soon',
    badge: 'Coming Soon'
  },
  {
    id: 'site-checker',
    name: 'Site Security Checker',
    category: 'integrity',
    icon: 'Globe2',
    shortDesc: 'HTTP security headers (CSP, HSTS) and SSL/TLS certificate diagnostics.',
    status: 'coming-soon',
    badge: 'Coming Soon'
  },
  {
    id: 'waf-analyzer',
    name: 'WAF Log Analyzer',
    category: 'integrity',
    icon: 'Flame',
    shortDesc: 'Parse Nginx/Cloudflare/AWS WAF logs for malicious attack vectors.',
    status: 'coming-soon',
    badge: 'Coming Soon'
  },
  {
    id: 'threat-database',
    name: 'Threat Database',
    category: 'integrity',
    icon: 'Database',
    shortDesc: 'Search CVE vulnerabilities, IOC indicators, and threat actor profiles.',
    status: 'coming-soon',
    badge: 'Coming Soon'
  }
];
