// DNS Recon Utilities using DNS-over-HTTPS (DoH)

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];

export async function queryDnsRecord(domain, type = 'A') {
  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  
  // Try Cloudflare DoH first
  try {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanDomain)}&type=${type}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/dns-json' }
    });
    if (response.ok) {
      const data = await response.json();
      return (data.Answer || []).map(ans => ans.data);
    }
  } catch (err) {
    console.warn(`Cloudflare DoH error for ${type}, falling back to Google DoH:`, err);
  }

  // Fallback to Google DoH
  const googleUrl = `https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=${type}`;
  const gResp = await fetch(googleUrl);
  if (!gResp.ok) {
    throw new Error(`Failed to resolve DNS ${type} record`);
  }
  const gData = await gResp.json();
  return (gData.Answer || []).map(ans => ans.data);
}

export async function runDnsRecon(domain) {
  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!cleanDomain || !/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(cleanDomain)) {
    throw new Error('Please enter a valid domain name (e.g. github.com or cloudflare.com)');
  }

  // Query common record types in parallel
  const recordPromises = RECORD_TYPES.map(async type => {
    try {
      const records = await queryDnsRecord(cleanDomain, type);
      return { type, records };
    } catch {
      return { type, records: [] };
    }
  });

  // Query DMARC record (_dmarc.domain)
  const dmarcPromise = (async () => {
    try {
      const records = await queryDnsRecord(`_dmarc.${cleanDomain}`, 'TXT');
      return records.find(r => r.includes('v=DMARC1')) || null;
    } catch {
      return null;
    }
  })();

  const [recordResults, dmarcRecord] = await Promise.all([
    Promise.all(recordPromises),
    dmarcPromise
  ]);

  const recordsMap = {};
  for (const { type, records } of recordResults) {
    recordsMap[type] = records;
  }

  // Check SPF in TXT records
  const txtRecords = recordsMap['TXT'] || [];
  const spfRecord = txtRecords.find(r => typeof r === 'string' && r.toLowerCase().includes('v=spf1')) || null;

  // Verdict analysis
  let spoofingProtectionVerdict = 'Missing / High Risk';
  let spoofingStatus = 'danger'; // safe | warning | danger
  let spoofingExplanation = '';

  if (spfRecord && dmarcRecord) {
    spoofingProtectionVerdict = 'Robust Protection (SPF & DMARC Active)';
    spoofingStatus = 'safe';
    spoofingExplanation = 'Domain publishes both SPF and DMARC policies. Incoming mail servers can verify authorized senders and block spoofed phishing emails.';
  } else if (spfRecord && !dmarcRecord) {
    spoofingProtectionVerdict = 'Partial Protection (SPF Only, DMARC Missing)';
    spoofingStatus = 'warning';
    spoofingExplanation = 'Domain specifies authorized senders via SPF, but lacks a DMARC policy instructing receivers what to do when validation fails.';
  } else if (!spfRecord && dmarcRecord) {
    spoofingProtectionVerdict = 'Partial Protection (DMARC Only, SPF Missing)';
    spoofingStatus = 'warning';
    spoofingExplanation = 'Domain has a DMARC policy but no SPF record. Spoofing protection is incomplete without SPF/DKIM alignment.';
  } else {
    spoofingProtectionVerdict = 'No Spoofing Protection (Vulnerable to Phishing)';
    spoofingStatus = 'danger';
    spoofingExplanation = 'Neither SPF nor DMARC was detected. Attackers can easily forge emails pretending to originate from this domain.';
  }

  return {
    domain: cleanDomain,
    records: recordsMap,
    security: {
      hasSpf: !!spfRecord,
      spfRecord,
      hasDmarc: !!dmarcRecord,
      dmarcRecord,
      verdict: spoofingProtectionVerdict,
      status: spoofingStatus,
      explanation: spoofingExplanation
    }
  };
}
