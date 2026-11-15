import ouiData from '../data/ouiData.js';

export function analyzeMacAddress(input) {
  if (!input || !input.trim()) {
    throw new Error('Please enter a MAC address (e.g. 00:1A:2B:3C:4D:5E)');
  }

  // Remove common delimiters (:, -, .) and whitespace
  const clean = input.trim().replace(/[:\-\.\s]/g, '').toUpperCase();

  if (clean.length !== 12 || !/^[0-9A-F]{12}$/.test(clean)) {
    throw new Error('Invalid MAC address format. Expected 12 hexadecimal characters (e.g., 00:1A:2B:3C:4D:5E or 001A.2B3C.4D5E)');
  }

  // Format into standard pairs
  const formattedMac = clean.match(/.{1,2}/g).join(':');
  const oui = clean.substring(0, 6).match(/.{1,2}/g).join(':');

  // First byte determines I/G (Individual/Group) and U/L (Universal/Local)
  const firstByte = parseInt(clean.substring(0, 2), 16);
  
  // Bit 0 (LSB): 0 = Unicast (Individual), 1 = Multicast (Group)
  const isMulticast = (firstByte & 0x01) === 1;
  const castType = isMulticast ? 'Multicast (Group)' : 'Unicast (Individual)';

  // Bit 1: 0 = Universally Administered (OUI Enforced), 1 = Locally Administered (Randomized)
  const isLocal = (firstByte & 0x02) === 2;
  const adminType = isLocal ? 'Locally Administered (Randomized / Private)' : 'Universally Administered (Globally Unique)';

  // Look up vendor in OUI table
  const vendor = ouiData[oui] || (isLocal ? 'Private / Randomized Device MAC' : 'Unknown / Unregistered Vendor');

  let explanation = '';
  if (isLocal) {
    explanation = 'This MAC address is marked as "Locally Administered". Modern smartphones (iOS, Android) and laptops use randomized MAC addresses by default to prevent Wi-Fi tracking across different networks.';
  } else if (ouiData[oui]) {
    explanation = `This MAC belongs to an officially registered device manufactured by ${vendor}.`;
  } else {
    explanation = 'This MAC address has a globally unique format, but its prefix is not in the common vendor directory or is reserved.';
  }

  return {
    input: input.trim(),
    formattedMac,
    oui,
    vendor,
    isLocal,
    isMulticast,
    castType,
    adminType,
    explanation,
    status: isLocal ? 'warning' : 'safe'
  };
}
