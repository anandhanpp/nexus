import assert from 'node:assert';
import { parseSubnet } from '../src/utils/subnet.js';
import { analyzeMacAddress } from '../src/utils/mac.js';
import { computeMD5, toBase64, fromBase64, toHex, fromHex } from '../src/utils/crypto.js';
import { auditPassword } from '../src/utils/password.js';
import { isValidIp } from '../src/utils/ip.js';

console.log('--- Starting Nexus Hub Self-Check Tests ---');

// 1. Subnet Calculator Tests
const sub1 = parseSubnet('192.168.1.50/24');
assert.strictEqual(sub1.networkAddress, '192.168.1.0', 'Network address mismatch');
assert.strictEqual(sub1.broadcastAddress, '192.168.1.255', 'Broadcast address mismatch');
assert.strictEqual(sub1.firstHost, '192.168.1.1', 'First host mismatch');
assert.strictEqual(sub1.lastHost, '192.168.1.254', 'Last host mismatch');
assert.strictEqual(sub1.usableHosts, '254', 'Usable hosts count mismatch');
assert.strictEqual(sub1.isPrivate, true, 'RFC 1918 private flag mismatch');
console.log('✓ Subnet calculator tests passed');

// 2. MAC Recon Tests
const macRaspi = analyzeMacAddress('B8-27-EB-11-22-33');
assert.strictEqual(macRaspi.vendor, 'Raspberry Pi Foundation', 'Raspberry Pi vendor lookup failed');
assert.strictEqual(macRaspi.isMulticast, false, 'Expected unicast');
assert.strictEqual(macRaspi.isLocal, false, 'Expected universally administered');

const macLocal = analyzeMacAddress('02:00:00:00:00:01');
assert.strictEqual(macLocal.isLocal, true, 'Expected locally administered / randomized bit');
console.log('✓ MAC Recon tests passed');

// 3. Cryptographic Utilities Tests
const md5Hello = computeMD5('hello');
assert.strictEqual(md5Hello, '5d41402abc4b2a76b9719d911017c592', 'MD5 hash calculation mismatch');

const b64 = toBase64('Nexus Hub');
assert.strictEqual(fromBase64(b64), 'Nexus Hub', 'Base64 roundtrip mismatch');

const hex = toHex('ABC');
assert.strictEqual(fromHex(hex), 'ABC', 'Hex roundtrip mismatch');
console.log('✓ Cryptographic hashing & encoding tests passed');

// 4. Password Auditor Tests
const weak = auditPassword('123456');
assert.strictEqual(weak.checklist.notCommon, false, 'Expected common password detection');
assert.strictEqual(weak.label, 'Very Weak', 'Expected Very Weak score for 123456');

const strong = auditPassword('K7#mP9$xL2!vQ8@z');
assert.strictEqual(strong.checklist.length12, true, 'Expected length 12+ check');
assert.strictEqual(strong.checklist.symbols, true, 'Expected symbols check');
assert.ok(strong.entropy > 80, 'Expected high entropy');
console.log('✓ Password auditor tests passed');

// 5. IP Validation Tests
assert.strictEqual(isValidIp('8.8.8.8').valid, true, '8.8.8.8 should be valid IPv4');
assert.strictEqual(isValidIp('999.1.1.1').valid, false, '999.1.1.1 should be invalid');
assert.strictEqual(isValidIp('2001:4860:4860::8888').valid, true, 'Valid IPv6 should be recognized');
assert.strictEqual(isValidIp('not-an-ip').valid, false, 'Hostname should not be valid IP');
console.log('✓ IP validation tests passed');

console.log('--- ALL SELF-CHECKS PASSED SUCCESSFULLY ---');
