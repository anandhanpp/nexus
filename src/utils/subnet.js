// Subnet Calculator Utilities

function ipToLong(ip) {
  return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

function longToIp(long) {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255
  ].join('.');
}

function longToBinary(long) {
  return [
    ((long >>> 24) & 255).toString(2).padStart(8, '0'),
    ((long >>> 16) & 255).toString(2).padStart(8, '0'),
    ((long >>> 8) & 255).toString(2).padStart(8, '0'),
    (long & 255).toString(2).padStart(8, '0')
  ].join('.');
}

export function parseSubnet(input) {
  const cleanInput = input.trim();
  let ipStr = '';
  let cidr = 24;

  if (cleanInput.includes('/')) {
    const parts = cleanInput.split('/');
    ipStr = parts[0].trim();
    const cidrNum = parseInt(parts[1].trim(), 10);
    if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
      throw new Error('CIDR prefix must be between 0 and 32 (e.g. /24)');
    }
    cidr = cidrNum;
  } else if (cleanInput.includes(' ')) {
    const parts = cleanInput.split(/\s+/);
    ipStr = parts[0].trim();
    const maskStr = parts[1].trim();
    cidr = maskToCidr(maskStr);
  } else {
    ipStr = cleanInput;
    cidr = 24; // default /24 if omitted
  }

  // Validate IPv4 format
  const octets = ipStr.split('.');
  if (octets.length !== 4) {
    throw new Error('Please enter a valid IPv4 address (e.g., 192.168.1.0/24)');
  }
  for (const oct of octets) {
    const n = parseInt(oct, 10);
    if (isNaN(n) || n < 0 || n > 255 || String(n) !== oct) {
      throw new Error(`Invalid octet "${oct}". Each octet must be 0-255.`);
    }
  }

  const ipLong = ipToLong(ipStr);
  const maskLong = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcardLong = (~maskLong) >>> 0;
  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | wildcardLong) >>> 0;

  const totalHosts = Math.pow(2, 32 - cidr);
  let usableHosts = 0;
  let firstHostLong = 0;
  let lastHostLong = 0;

  if (cidr === 32) {
    usableHosts = 1;
    firstHostLong = networkLong;
    lastHostLong = networkLong;
  } else if (cidr === 31) {
    usableHosts = 2; // RFC 3021 point-to-point links
    firstHostLong = networkLong;
    lastHostLong = broadcastLong;
  } else {
    usableHosts = Math.max(0, totalHosts - 2);
    firstHostLong = networkLong + 1;
    lastHostLong = broadcastLong - 1;
  }

  // IP Class determination
  const firstOctet = parseInt(octets[0], 10);
  let ipClass = 'Unknown';
  let isPrivate = false;

  if (firstOctet >= 1 && firstOctet <= 126) {
    ipClass = 'A';
    if (firstOctet === 10) isPrivate = true;
  } else if (firstOctet === 127) {
    ipClass = 'Loopback (127.0.0.0/8)';
  } else if (firstOctet >= 128 && firstOctet <= 191) {
    ipClass = 'B';
    const secondOctet = parseInt(octets[1], 10);
    if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) isPrivate = true;
  } else if (firstOctet >= 192 && firstOctet <= 223) {
    ipClass = 'C';
    const secondOctet = parseInt(octets[1], 10);
    if (firstOctet === 192 && secondOctet === 168) isPrivate = true;
  } else if (firstOctet >= 224 && firstOctet <= 239) {
    ipClass = 'D (Multicast)';
  } else if (firstOctet >= 240 && firstOctet <= 255) {
    ipClass = 'E (Experimental)';
  }

  return {
    ip: ipStr,
    cidr,
    subnetMask: longToIp(maskLong),
    wildcardMask: longToIp(wildcardLong),
    networkAddress: longToIp(networkLong),
    broadcastAddress: longToIp(broadcastLong),
    firstHost: longToIp(firstHostLong),
    lastHost: longToIp(lastHostLong),
    totalHosts: totalHosts.toLocaleString(),
    usableHosts: usableHosts.toLocaleString(),
    ipClass,
    isPrivate,
    binary: {
      ip: longToBinary(ipLong),
      mask: longToBinary(maskLong),
      network: longToBinary(networkLong),
      broadcast: longToBinary(broadcastLong)
    }
  };
}

function maskToCidr(mask) {
  const octets = mask.split('.').map(o => parseInt(o, 10));
  if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
    throw new Error('Invalid subnet mask format');
  }
  const binary = octets.map(o => o.toString(2).padStart(8, '0')).join('');
  if (!/^1*0*$/.test(binary)) {
    throw new Error('Non-contiguous subnet mask is invalid');
  }
  return binary.indexOf('0') === -1 ? 32 : binary.indexOf('0');
}
