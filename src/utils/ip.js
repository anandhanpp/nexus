// IP Tracker Utilities

// Validation for IPv4 and IPv6
export function isValidIp(ip) {
  const clean = ip.trim();
  // IPv4 regex
  const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Pattern.test(clean)) return { valid: true, type: 'IPv4' };

  // IPv6 regex
  const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  if (ipv6Pattern.test(clean)) return { valid: true, type: 'IPv6' };

  return { valid: false, type: null };
}

export async function lookupIp(ipAddress = '') {
  const cleanIp = ipAddress.trim();
  
  if (cleanIp) {
    const { valid } = isValidIp(cleanIp);
    if (!valid) {
      throw new Error(`"${cleanIp}" is not a valid IPv4 or IPv6 address. Example: 8.8.8.8 or 1.1.1.1`);
    }
  }

  // If no IP passed, lookup current visitor IP
  const endpoint = cleanIp
    ? `https://ipapi.co/${encodeURIComponent(cleanIp)}/json/`
    : 'https://ipapi.co/json/';

  try {
    const response = await fetch(endpoint, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Public IP API rate limit reached. Please wait a moment or try again later.');
      }
      throw new Error(`Lookup failed with status code ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.reason || 'IP lookup returned an error');
    }

    // Check hosting / cloud / VPN hints based on ASN or Org
    const org = (data.org || data.asn || '').toLowerCase();
    const isHosting = /amazon|aws|google cloud|digitalocean|ovh|linode|hetzner|cloudflare|microsoft|azure|oracle|vultr|fastly/i.test(org);
    const isVpnHint = /vpn|proxy|tor|hosting|datacenter|mullvad|nord|expressvpn|surfshark|private internet access/i.test(org);

    return {
      ip: data.ip,
      version: data.version || (data.ip.includes(':') ? 'IPv6' : 'IPv4'),
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || '',
      postal: data.postal || 'N/A',
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone || 'UTC',
      isp: data.org || data.asn || 'Unknown ISP',
      asn: data.asn || 'N/A',
      isHosting,
      isVpnHint,
      summary: `${data.city ? data.city + ', ' : ''}${data.country_name || 'Unknown'} (${data.org || 'ISP'})`
    };
  } catch (err) {
    throw new Error(err.message || 'Unable to fetch geolocation information. Check your internet connection.');
  }
}
