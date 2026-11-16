export const CATEGORIES = [
  { id: 'network', name: 'Network Recon', icon: 'Network', tag: 'NET' },
  { id: 'passwords-crypto', name: 'Cryptography & Keys', icon: 'Key', tag: 'CRY' },
  { id: 'integrity', name: 'Integrity & Verification', icon: 'ShieldCheck', tag: 'INT' },
];

export const TOOLS = [
  // 1. IP Tracker
  {
    id: 'ip-tracker',
    code: 'NET-01',
    name: 'IP Tracker',
    category: 'network',
    icon: 'Globe',
    shortDesc: 'Trace IP geolocation, ISP routing, ASN ownership, and proxy/VPN indicators.',
    path: '/tools/ip-tracker',
    status: 'ready',
    mode: 'Hybrid DoH / HTTPS',
    metaTitle: 'IP Tracker & Geolocation',
    plainDesc: 'Determine geographic origin, autonomous system number (ASN), and network infrastructure classification.',
    helpText: [
      'An IP address is an assigned numerical identifier for routing packets across internet networks.',
      'Geolocation estimates city-level proximity based on BGP and ISP routing tables, never GPS or street-level data.',
      'VPN or datacenter flags identify hosting infrastructure often used to anonymize client endpoints.'
    ],
    related: ['mac-recon', 'dns-recon', 'subnet-calculator']
  },
  // 2. MAC Recon
  {
    id: 'mac-recon',
    code: 'NET-02',
    name: 'MAC Recon',
    category: 'network',
    icon: 'Cpu',
    shortDesc: 'Identify hardware vendor, unicast/multicast bit, and randomized Wi-Fi addresses.',
    path: '/tools/mac-recon',
    status: 'ready',
    mode: '100% Offline (Local OUI)',
    metaTitle: 'MAC Address Reconnaissance',
    plainDesc: 'Audit physical network interface addresses against the IEEE Organizationally Unique Identifier (OUI) table.',
    helpText: [
      'A MAC address is a 48-bit hardware identifier burned into network interfaces.',
      'The first 3 octets (OUI) represent the vendor prefix officially registered with IEEE.',
      'The second bit of the first byte indicates if the address is randomized by iOS, Android, or Windows for Wi-Fi privacy.'
    ],
    related: ['ip-tracker', 'subnet-calculator', 'dns-recon']
  },
  // 3. DNS Recon
  {
    id: 'dns-recon',
    code: 'NET-03',
    name: 'DNS Recon',
    category: 'network',
    icon: 'Search',
    shortDesc: 'Query live DoH records (A, AAAA, MX, TXT) and inspect SPF/DMARC anti-spoofing policies.',
    path: '/tools/dns-recon',
    status: 'ready',
    mode: 'Encrypted DNS (DoH)',
    metaTitle: 'DNS Records & Phishing Protection Recon',
    plainDesc: 'Inspect DNS records over encrypted HTTPS and audit email spoofing resilience.',
    helpText: [
      'DNS converts domain hostnames into machine-routable IPv4 and IPv6 network addresses.',
      'Sender Policy Framework (SPF) lists authorized mail transmission servers for the domain.',
      'DMARC instructs recipient mail servers how to quarantine or reject forged messages that fail validation.'
    ],
    related: ['ip-tracker', 'password-auditor', 'subnet-calculator']
  },
  // 4. Subnet Calculator
  {
    id: 'subnet-calculator',
    code: 'NET-04',
    name: 'Subnet Calculator',
    category: 'network',
    icon: 'Network',
    shortDesc: 'Calculate broadcast boundaries, usable host allocations, and 32-bit binary masks.',
    path: '/tools/subnet-calculator',
    status: 'ready',
    mode: '100% Offline (Pure Math)',
    metaTitle: 'IPv4 Subnet & CIDR Calculator',
    plainDesc: 'Compute network boundaries, first/last usable IP allocations, wildcard masks, and binary bit distribution.',
    helpText: [
      'Subnetting isolates broadcast domains to maximize IP efficiency and enforce routing boundaries.',
      'CIDR notation (/24, /16) designates the fixed network prefix bits within a 32-bit IPv4 address.',
      'Total addresses include network and broadcast addresses; usable hosts represent allocatable client nodes.'
    ],
    related: ['ip-tracker', 'mac-recon', 'dns-recon']
  },
  // 5. Password Auditor
  {
    id: 'password-auditor',
    code: 'CRY-01',
    name: 'Password Auditor',
    category: 'passwords-crypto',
    icon: 'KeyRound',
    shortDesc: 'Measure Shannon entropy, GPU crack-time models, and check HIBP k-anonymity breach lists.',
    path: '/tools/password-auditor',
    status: 'ready',
    mode: 'Browser Sandbox + k-Anonymity',
    metaTitle: 'Password Resilience & Breach Auditor',
    plainDesc: 'Measure resistance against dictionary brute-force attacks and safely query public credential breaches.',
    helpText: [
      'Entropy measures mathematical unpredictability in bits; higher entropy requires exponential computing power to guess.',
      'k-Anonymity queries breach databases using only the first 5 characters of a SHA-1 hash without revealing the password.',
      'Multi-word passphrases with distinct character sets maximize entropy while maintaining human recall.'
    ],
    related: ['crypto-engine', 'crypto-vault', 'file-integrity']
  },
  // 6. Cryptographic Engine
  {
    id: 'crypto-engine',
    code: 'CRY-02',
    name: 'Cryptographic Engine',
    category: 'passwords-crypto',
    icon: 'Binary',
    shortDesc: 'Hash (MD5, SHA-256, SHA-512), encode/decode formats, and encrypt with AES-256-GCM.',
    path: '/tools/crypto-engine',
    status: 'ready',
    mode: 'Hardware-Accelerated Web Crypto',
    metaTitle: 'Cryptographic Engine & Hasher',
    plainDesc: 'Perform cryptographic digests, standard encoding transitions, and symmetric passphrase encryption in RAM.',
    helpText: [
      'Cryptographic hashing produces a deterministic, irreversible fixed-length digest of arbitrary input data.',
      'Base64, Hexadecimal, and URL encoding format binary data for safe transmission; they do not provide confidentiality.',
      'AES-GCM delivers authenticated encryption that guarantees both secrecy and tamper detection.'
    ],
    related: ['crypto-vault', 'file-integrity', 'password-auditor']
  },
  // 7. Crypto Vault
  {
    id: 'crypto-vault',
    code: 'CRY-03',
    name: 'Crypto Vault',
    category: 'passwords-crypto',
    icon: 'Lock',
    shortDesc: 'Store encrypted confidential credentials locally in browser IndexedDB with AES-256-GCM.',
    path: '/tools/crypto-vault',
    status: 'ready',
    mode: 'Zero-Knowledge Encrypted Storage',
    metaTitle: 'Zero-Knowledge Crypto Vault',
    plainDesc: 'Store encrypted notes and secrets locally with PBKDF2 key derivation and automatic session locking.',
    helpText: [
      'Zero-knowledge encryption ensures secrets are encrypted locally before being stored.',
      'Your master password is never stored or transmitted; only an encrypted verification token validates unlocks.',
      'If the master password is lost, data is mathematically unrecoverable. Maintain backup exports.'
    ],
    related: ['crypto-engine', 'password-auditor', 'file-integrity']
  },
  // 8. File Integrity Monitor
  {
    id: 'file-integrity',
    code: 'INT-01',
    name: 'File Integrity Monitor',
    category: 'integrity',
    icon: 'ShieldCheck',
    shortDesc: 'Compute SHA-256/512 checksums in browser memory, verify vendor hashes, and track baselines.',
    path: '/tools/file-integrity',
    status: 'ready',
    mode: '100% In-Memory Streaming',
    metaTitle: 'File Integrity & Checksum Verifier',
    plainDesc: 'Verify software downloads and detect unauthorized byte modifications without file uploading.',
    helpText: [
      'Cryptographic checksums create a unique digital fingerprint for any file.',
      'Even a single changed byte or comma completely alters the resulting hash value.',
      'Files are streamed in local browser memory and never uploaded to remote servers.'
    ],
    related: ['crypto-engine', 'password-auditor', 'crypto-vault']
  },

  // Future Scope Tools (Coming Soon)
  {
    id: 'port-scanner',
    code: 'NET-05',
    name: 'Port Scanner',
    category: 'network',
    icon: 'Radio',
    shortDesc: 'Network service discovery and TCP endpoint accessibility diagnostics.',
    status: 'coming-soon',
    badge: 'Phase 2'
  },
  {
    id: 'traffic-ids',
    code: 'NET-06',
    name: 'Traffic Anomaly IDS',
    category: 'network',
    icon: 'Activity',
    shortDesc: 'Local PCAP packet analysis and anomalous protocol stream heuristics.',
    status: 'coming-soon',
    badge: 'Phase 2'
  },
  {
    id: 'phishing-analyzer',
    code: 'CRY-04',
    name: 'Phishing Header Analyzer',
    category: 'passwords-crypto',
    icon: 'AlertOctagon',
    shortDesc: 'Inspect suspicious email headers, routing hops, and homoglyph lookalike domains.',
    status: 'coming-soon',
    badge: 'Phase 2'
  },
  {
    id: 'breach-monitor',
    code: 'CRY-05',
    name: 'Domain Breach Monitor',
    category: 'passwords-crypto',
    icon: 'Fingerprint',
    shortDesc: 'Corporate credential exposure checks and domain compromise telemetry feeds.',
    status: 'coming-soon',
    badge: 'Phase 2'
  },
  {
    id: 'site-checker',
    code: 'INT-02',
    name: 'Site Security Headers',
    category: 'integrity',
    icon: 'Globe2',
    shortDesc: 'Inspect CSP, HSTS, X-Frame-Options, and TLS certificate parameters.',
    status: 'coming-soon',
    badge: 'Phase 2'
  },
  {
    id: 'waf-analyzer',
    code: 'INT-03',
    name: 'WAF Log Analyzer',
    category: 'integrity',
    icon: 'Flame',
    shortDesc: 'Parse Nginx, Cloudflare, and AWS WAF access logs for malicious signatures.',
    status: 'coming-soon',
    badge: 'Phase 2'
  },
  {
    id: 'threat-database',
    code: 'INT-04',
    name: 'Threat & CVE Database',
    category: 'integrity',
    icon: 'Database',
    shortDesc: 'Search published CVE vulnerabilities, CVSS ratings, and indicators of compromise.',
    status: 'coming-soon',
    badge: 'Phase 2'
  }
];
