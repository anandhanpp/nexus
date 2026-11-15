// Password Auditor Utilities

const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', '123456789', 'qwerty', '12345', '1234567',
  '111111', '123123', 'admin', 'welcome', 'login', 'princess', 'football',
  'iloveyou', 'sunshine', 'monkey', 'shadow', 'master', 'dragon', 'computer'
]);

export function auditPassword(password) {
  if (!password) {
    return {
      score: 0,
      label: 'None',
      crackTime: 'Instant',
      checklist: {
        length: false,
        length12: false,
        lowercase: false,
        uppercase: false,
        numbers: false,
        symbols: false,
        noSequences: true,
        notCommon: true
      },
      tips: ['Enter a password to evaluate its strength.'],
      entropy: 0
    };
  }

  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);

  // Common patterns & sequences
  const isCommon = COMMON_PASSWORDS.has(password.toLowerCase());
  const hasSequential = /(?:012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl)/i.test(password);
  const hasRepeated = /(.)\1{2,}/.test(password);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumbers) poolSize += 10;
  if (hasSymbols) poolSize += 33;

  // Calculate entropy
  const entropy = poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;

  // Calculate crack time estimate (assuming 10 billion guesses/sec modern GPU cluster)
  const guessesPerSecond = 1e10;
  const totalCombinations = Math.pow(poolSize || 1, length);
  const secondsToCrack = totalCombinations / (2 * guessesPerSecond);

  let crackTime = 'Instant';
  if (isCommon) {
    crackTime = 'Instant (< 1 millisecond - common dictionary word)';
  } else if (secondsToCrack < 1) {
    crackTime = 'Less than a second';
  } else if (secondsToCrack < 60) {
    crackTime = `${Math.round(secondsToCrack)} seconds`;
  } else if (secondsToCrack < 3600) {
    crackTime = `${Math.round(secondsToCrack / 60)} minutes`;
  } else if (secondsToCrack < 86400) {
    crackTime = `${Math.round(secondsToCrack / 3600)} hours`;
  } else if (secondsToCrack < 31536000) {
    crackTime = `${Math.round(secondsToCrack / 86400)} days`;
  } else if (secondsToCrack < 31536000 * 100) {
    crackTime = `${Math.round(secondsToCrack / 31536000)} years`;
  } else if (secondsToCrack < 31536000 * 1e6) {
    crackTime = `${(secondsToCrack / (31536000 * 1000)).toFixed(1)} thousand years`;
  } else {
    crackTime = 'Centuries / Impractical to crack';
  }

  // Scoring
  let score = 0;
  if (length >= 8) score++;
  if (length >= 12) score++;
  if (length >= 16) score++;
  if (hasLower && hasUpper) score++;
  if (hasNumbers) score++;
  if (hasSymbols) score++;
  if (!isCommon && !hasSequential && !hasRepeated) score++;

  let label = 'Weak';
  let badgeColor = 'danger'; // danger | warning | safe

  if (isCommon || length < 6) {
    score = 1;
    label = 'Very Weak';
    badgeColor = 'danger';
  } else if (score <= 3) {
    label = 'Weak';
    badgeColor = 'danger';
  } else if (score <= 5) {
    label = 'Fair';
    badgeColor = 'warning';
  } else if (score === 6) {
    label = 'Strong';
    badgeColor = 'safe';
  } else {
    label = 'Excellent';
    badgeColor = 'safe';
  }

  // Actionable tips
  const tips = [];
  if (length < 12) {
    tips.push('Increase length to at least 12–16 characters.');
  }
  if (!hasSymbols) {
    tips.push('Add special symbols (e.g. !@#$%^&*) to expand search space.');
  }
  if (!hasNumbers) {
    tips.push('Include numbers mixed throughout the passphrase.');
  }
  if (hasSequential || hasRepeated) {
    tips.push('Avoid predictable sequences like "123" or repeated characters.');
  }
  if (isCommon) {
    tips.push('This is a widely used default password. Replace it immediately.');
  }
  if (tips.length === 0) {
    tips.push('Great job! This password has high entropy and resists brute-force attacks.');
  }

  return {
    score,
    label,
    badgeColor,
    crackTime,
    entropy,
    checklist: {
      length: length >= 8,
      length12: length >= 12,
      lowercase: hasLower,
      uppercase: hasUpper,
      numbers: hasNumbers,
      symbols: hasSymbols,
      noSequences: !hasSequential && !hasRepeated,
      notCommon: !isCommon
    },
    tips: tips.slice(0, 3)
  };
}

// HaveIBeenPwned k-anonymity leak check
export async function checkPwnedPassword(password) {
  if (!password) return { leaked: false, count: 0 };

  // 1. Calculate local SHA-1
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fullHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

  // 2. Extract 5-char prefix & 35-char suffix
  const prefix = fullHash.substring(0, 5);
  const suffix = fullHash.substring(5);

  // 3. Query HIBP range API with prefix only
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { 'Add-Padding': 'true' }
  });

  if (!response.ok) {
    throw new Error('Unable to contact HaveIBeenPwned API');
  }

  const text = await response.text();
  const lines = text.split('\n');

  for (const line of lines) {
    const [hashSuffix, countStr] = line.trim().split(':');
    if (hashSuffix === suffix) {
      const count = parseInt(countStr, 10);
      return { leaked: true, count, hashPrefix: prefix };
    }
  }

  return { leaked: false, count: 0, hashPrefix: prefix };
}

// Secure Generator
export function generatePassword({
  length = 16,
  uppercase = true,
  lowercase = true,
  numbers = true,
  symbols = true
} = {}) {
  let chars = '';
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}
