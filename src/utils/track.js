// Phone number analysis — libphonenumber-js (100% offline)
import { parsePhoneNumber } from 'libphonenumber-js/max';

// Country metadata for approximate location and flag
const COUNTRY_NAMES = new Intl.DisplayNames(['en'], { type: 'region' });

function countryFlag(isoCode) {
  if (!isoCode || isoCode.length !== 2) return '🌍';
  return String.fromCodePoint(
    ...isoCode.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
}

const TYPE_MAP = {
  MOBILE:               { label: 'Mobile',               risk: 'low'  },
  FIXED_LINE:           { label: 'Fixed Line',            risk: 'low'  },
  FIXED_LINE_OR_MOBILE: { label: 'Fixed Line / Mobile',   risk: 'low'  },
  TOLL_FREE:            { label: 'Toll-Free',             risk: 'low'  },
  PREMIUM_RATE:         { label: 'Premium Rate (⚠ Costly)',risk: 'high' },
  SHARED_COST:          { label: 'Shared Cost',           risk: 'medium'},
  VOIP:                 { label: 'VoIP (Internet Call)',   risk: 'medium'},
  PERSONAL_NUMBER:      { label: 'Personal Number',       risk: 'low'  },
  PAGER:                { label: 'Pager',                 risk: 'low'  },
  UAN:                  { label: 'Universal Access (UAN)', risk: 'low'  },
  VOICEMAIL:            { label: 'Voicemail',             risk: 'low'  },
  UNKNOWN:              { label: 'Unknown',               risk: 'low'  },
};

export function analyzePhoneNumber(input) {
  const raw = input.trim();
  if (!raw) throw new Error('Enter a phone number with country code, e.g. +1 650 253 0000');

  let parsed;
  try {
    parsed = parsePhoneNumber(raw);
  } catch {
    throw new Error(
      `"${raw}" is not a recognisable phone number. Always include the country code starting with +`
    );
  }
  if (!parsed) throw new Error('Could not parse this number. Include the country code, e.g. +44 7700 900000');

  const numberType  = parsed.getType() || 'UNKNOWN';
  const typeInfo    = TYPE_MAP[numberType] || TYPE_MAP.UNKNOWN;
  const country     = parsed.country || null;
  const callingCode = parsed.countryCallingCode;
  const national    = parsed.nationalNumber;
  const e164        = parsed.format('E.164');
  const intl        = parsed.format('INTERNATIONAL');
  const national_f  = parsed.format('NATIONAL');
  const rfc3966     = parsed.format('RFC3966');
  const isValid     = parsed.isValid();
  const isPossible  = parsed.isPossible();

  // Country display name & flag
  let countryName = country || 'Unknown';
  let flag = '🌍';
  try {
    if (country) {
      countryName = COUNTRY_NAMES.of(country) || country;
      flag = countryFlag(country);
    }
  } catch {}

  // Timezone(s) — look up country timezone
  let timezones = [];

  // Local time in that country's first timezone
  let localTime = null;
  let timezone = null;
  if (country) {
    timezone = COUNTRY_TZ[country] || null;
    if (timezone) {
      try {
        localTime = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false, weekday: 'short', day: 'numeric', month: 'short'
        }).format(new Date());
      } catch {}
    }
  }

  // Carrier lookup links (server-side required; we provide deep-link buttons)
  const carrierLinks = [
    { name: 'Truecaller',  url: `https://www.truecaller.com/search/in/${encodeURIComponent(e164)}` },
    { name: 'NumVerify',   url: `https://numverify.com/phone-number-validation` },
    { name: 'Google',      url: `https://www.google.com/search?q=${encodeURIComponent('"' + e164 + '"')}` },
  ];

  // Risk assessment
  let risk = 'safe';
  if (!isValid) risk = 'warning';
  if (typeInfo.risk === 'high') risk = 'danger';

  return {
    input: raw,
    flag,
    country,
    countryName,
    countryCode: `+${callingCode}`,
    nationalNumber: national,
    e164,
    international: intl,
    national_formatted: national_f,
    rfc3966,
    numberType: typeInfo.label,
    typeRisk: typeInfo.risk,
    isValid,
    isPossible,
    isMobile: numberType === 'MOBILE' || numberType === 'FIXED_LINE_OR_MOBILE',
    timezone,
    localTime,
    carrierLinks,
    status: risk,
  };
}

// Country → primary IANA timezone (top-60 by phone lookup volume)
const COUNTRY_TZ = {
  US: 'America/New_York',    CA: 'America/Toronto',    GB: 'Europe/London',
  AU: 'Australia/Sydney',    IN: 'Asia/Kolkata',        DE: 'Europe/Berlin',
  FR: 'Europe/Paris',        JP: 'Asia/Tokyo',          CN: 'Asia/Shanghai',
  BR: 'America/Sao_Paulo',   RU: 'Europe/Moscow',       KR: 'Asia/Seoul',
  MX: 'America/Mexico_City', ID: 'Asia/Jakarta',        SA: 'Asia/Riyadh',
  TR: 'Europe/Istanbul',     NG: 'Africa/Lagos',        PK: 'Asia/Karachi',
  EG: 'Africa/Cairo',        TH: 'Asia/Bangkok',        MY: 'Asia/Kuala_Lumpur',
  PH: 'Asia/Manila',         VN: 'Asia/Ho_Chi_Minh',   BD: 'Asia/Dhaka',
  ES: 'Europe/Madrid',       IT: 'Europe/Rome',         NL: 'Europe/Amsterdam',
  PL: 'Europe/Warsaw',       UA: 'Europe/Kyiv',         SE: 'Europe/Stockholm',
  CH: 'Europe/Zurich',       NO: 'Europe/Oslo',         DK: 'Europe/Copenhagen',
  FI: 'Europe/Helsinki',     ZA: 'Africa/Johannesburg', KE: 'Africa/Nairobi',
  AR: 'America/Argentina/Buenos_Aires', CL: 'America/Santiago',
  CO: 'America/Bogota',      PE: 'America/Lima',        AE: 'Asia/Dubai',
  SG: 'Asia/Singapore',      HK: 'Asia/Hong_Kong',      NZ: 'Pacific/Auckland',
  IR: 'Asia/Tehran',         IQ: 'Asia/Baghdad',        IL: 'Asia/Jerusalem',
  GR: 'Europe/Athens',       PT: 'Europe/Lisbon',       CZ: 'Europe/Prague',
  RO: 'Europe/Bucharest',    HU: 'Europe/Budapest',     AT: 'Europe/Vienna',
  BE: 'Europe/Brussels',     LK: 'Asia/Colombo',        NP: 'Asia/Kathmandu',
  MM: 'Asia/Rangoon',        KH: 'Asia/Phnom_Penh',     AF: 'Asia/Kabul',
};

// ── Username search ──────────────────────────────────────────────────────────

export const SOCIAL_PLATFORMS = [
  { name: 'GitHub',        url: 'https://github.com/{}',                    icon: '🐙', category: 'dev' },
  { name: 'Twitter / X',   url: 'https://twitter.com/{}',                   icon: '🐦', category: 'social' },
  { name: 'Instagram',     url: 'https://www.instagram.com/{}',             icon: '📷', category: 'social' },
  { name: 'TikTok',        url: 'https://www.tiktok.com/@{}',               icon: '🎵', category: 'social' },
  { name: 'Facebook',      url: 'https://www.facebook.com/{}',              icon: '🌐', category: 'social' },
  { name: 'LinkedIn',      url: 'https://www.linkedin.com/in/{}',           icon: '💼', category: 'professional' },
  { name: 'Reddit',        url: 'https://www.reddit.com/user/{}',           icon: '🤖', category: 'social' },
  { name: 'YouTube',       url: 'https://www.youtube.com/@{}',              icon: '▶️', category: 'social' },
  { name: 'Twitch',        url: 'https://www.twitch.tv/{}',                 icon: '🎮', category: 'social' },
  { name: 'Snapchat',      url: 'https://www.snapchat.com/add/{}',          icon: '👻', category: 'social' },
  { name: 'Pinterest',     url: 'https://www.pinterest.com/{}',             icon: '📌', category: 'social' },
  { name: 'Tumblr',        url: 'https://www.tumblr.com/{}',                icon: '✏️', category: 'social' },
  { name: 'SoundCloud',    url: 'https://soundcloud.com/{}',                icon: '🎧', category: 'creative' },
  { name: 'Behance',       url: 'https://www.behance.net/{}',               icon: '🎨', category: 'creative' },
  { name: 'Dribbble',      url: 'https://dribbble.com/{}',                  icon: '🏀', category: 'creative' },
  { name: 'Medium',        url: 'https://medium.com/@{}',                   icon: '📝', category: 'dev' },
  { name: 'Dev.to',        url: 'https://dev.to/{}',                        icon: '👩‍💻', category: 'dev' },
  { name: 'Telegram',      url: 'https://t.me/{}',                          icon: '✈️', category: 'social' },
  { name: 'Quora',         url: 'https://www.quora.com/profile/{}',         icon: '❓', category: 'social' },
  { name: 'Product Hunt',  url: 'https://www.producthunt.com/@{}',          icon: '🚀', category: 'dev' },
  { name: 'Flickr',        url: 'https://www.flickr.com/people/{}',         icon: '📸', category: 'creative' },
  { name: 'Vimeo',         url: 'https://vimeo.com/{}',                     icon: '🎬', category: 'creative' },
  { name: 'Ello',          url: 'https://ello.co/{}',                       icon: '🌟', category: 'creative' },
  { name: 'We Heart It',   url: 'https://weheartit.com/{}',                 icon: '❤️', category: 'social' },
  { name: 'Keybase',       url: 'https://keybase.io/{}',                    icon: '🔑', category: 'dev' },
  { name: 'Mastodon',      url: 'https://mastodon.social/@{}',              icon: '🐘', category: 'social' },
  { name: 'Steam',         url: 'https://steamcommunity.com/id/{}',         icon: '🎮', category: 'gaming' },
  { name: 'Xbox',          url: 'https://account.xbox.com/en-us/Profile?gamertag={}', icon: '🕹️', category: 'gaming' },
  { name: 'Roblox',        url: 'https://www.roblox.com/user.aspx?username={}', icon: '🎲', category: 'gaming' },
  { name: 'Patreon',       url: 'https://www.patreon.com/{}',               icon: '🎁', category: 'creative' },
];

export function buildUsernameLinks(username) {
  const clean = username.trim();
  if (!clean) throw new Error('Enter a username to search.');
  if (/[^a-zA-Z0-9._\-]/.test(clean)) throw new Error('Username contains unsupported characters. Use letters, numbers, underscores, dots, or hyphens.');
  return SOCIAL_PLATFORMS.map(p => ({
    ...p,
    profileUrl: p.url.replace('{}', encodeURIComponent(clean)),
    username: clean,
  }));
}

// ── Email OSINT ──────────────────────────────────────────────────────────────

// Known disposable email domains (small common list; not exhaustive)
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com','guerrillamail.com','tempmail.com','throwaway.email',
  'yopmail.com','sharklasers.com','guerrillamailblock.com','10minutemail.com',
  'trashmail.com','fakeinbox.com','dispostable.com','maildrop.cc','temp-mail.org',
  'spamgourmet.com','spamgourmet.net','spamgourmet.org','spam4.me',
  'emailondeck.com','getairmail.com','moakt.cc','mohmal.com','tmpmail.net',
]);

export async function analyzeEmail(input) {
  const raw = input.trim().toLowerCase();
  if (!raw) throw new Error('Enter an email address to investigate, e.g. user@example.com');

  // Validate format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    throw new Error(`"${raw}" doesn't look like a valid email address.`);
  }

  const [localPart, domain] = raw.split('@');

  // Classify domain
  const isDisposable = DISPOSABLE_DOMAINS.has(domain);
  const isCommonProvider = ['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com','proton.me','protonmail.com','zoho.com','aol.com'].includes(domain);

  // MX record lookup via DoH (is the domain a real mail server?)
  let mxRecords = [];
  let hasMx = false;
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      { headers: { Accept: 'application/dns-json' } }
    );
    const data = await res.json();
    mxRecords = (data.Answer || []).map(r => r.data);
    hasMx = mxRecords.length > 0;
  } catch {}

  // Build external investigation links
  const investigationLinks = [
    {
      category: 'Breach Databases',
      items: [
        { name: 'Have I Been Pwned',  url: `https://haveibeenpwned.com/account/${encodeURIComponent(raw)}`,     icon: '🔥', desc: 'Check if this email appeared in known data breaches' },
        { name: 'DeHashed',           url: `https://www.dehashed.com/search?query=${encodeURIComponent(raw)}`,  icon: '🔍', desc: 'Search leaked credential databases' },
        { name: 'LeakCheck.io',       url: `https://leakcheck.io/?query=${encodeURIComponent(raw)}`,           icon: '💧', desc: 'Credential leak search engine' },
        { name: 'Snusbase',           url: `https://snusbase.com/?query=${encodeURIComponent(raw)}`,           icon: '🗃️', desc: 'Database breach search' },
      ]
    },
    {
      category: 'Search Engines',
      items: [
        { name: 'Google',       url: `https://www.google.com/search?q="${encodeURIComponent(raw)}"`,        icon: '🌐', desc: 'Search for public mentions of this email' },
        { name: 'Bing',         url: `https://www.bing.com/search?q="${encodeURIComponent(raw)}"`,         icon: '🔎', desc: 'Bing indexed public records' },
        { name: 'DuckDuckGo',   url: `https://duckduckgo.com/?q="${encodeURIComponent(raw)}"`,            icon: '🦆', desc: 'Privacy-focused OSINT search' },
      ]
    },
    {
      category: 'Email Reputation',
      items: [
        { name: 'EmailRep.io',  url: `https://emailrep.io/${encodeURIComponent(raw)}`,                     icon: '📊', desc: 'Email reputation, risk score, and social profiles' },
        { name: 'Hunter.io',    url: `https://hunter.io/email-verifier/${encodeURIComponent(raw)}`,       icon: '🏹', desc: 'Verify email and find linked company' },
        { name: 'Epieos',       url: `https://epieos.com/?q=${encodeURIComponent(raw)}&t=email`,           icon: '🕵️', desc: 'Reverse email OSINT — linked accounts' },
      ]
    },
    {
      category: 'Social Accounts',
      items: [
        { name: 'Google Account',   url: `https://accounts.google.com/signin/v2/identifier?Email=${encodeURIComponent(raw)}`, icon: '🔵', desc: 'Check if a Google/Gmail account exists' },
        { name: 'Gravatar',          url: `https://en.gravatar.com/site/check/${encodeURIComponent(raw)}`,                   icon: '🖼️', desc: 'Check for a linked Gravatar avatar' },
        { name: 'Skype Lookup',      url: `https://www.skype.com/en/`,                                                        icon: '📞', desc: 'Search Skype user directory' },
      ]
    },
  ];

  // If domain is not a common provider, also suggest checking by domain
  const domainLinks = !isCommonProvider ? [
    { name: 'WHOIS Domain',  url: `https://who.is/whois/${encodeURIComponent(domain)}`,        icon: '🌍' },
    { name: 'MXToolBox',     url: `https://mxtoolbox.com/SuperTool.aspx?action=mx:${domain}`,  icon: '📬' },
  ] : [];

  // Extract username part → generate social links
  const socialFromLocal = SOCIAL_PLATFORMS.map(p => ({
    ...p,
    profileUrl: p.url.replace('{}', encodeURIComponent(localPart)),
  }));

  // Risk score
  let risk = 'safe';
  if (isDisposable) risk = 'danger';
  else if (!hasMx) risk = 'warning';

  return {
    email: raw,
    localPart,
    domain,
    isDisposable,
    isCommonProvider,
    hasMx,
    mxRecords,
    domainType: isDisposable ? 'Disposable / Temporary' : isCommonProvider ? 'Public Email Provider' : 'Custom / Business Domain',
    investigationLinks,
    domainLinks,
    socialFromLocal,
    status: risk,
  };
}
