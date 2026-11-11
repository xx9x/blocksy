/**
 * Local, in-browser password analysis. Nothing here sends, stores or logs
 * the password — it's a pure function of the input string.
 */

const COMMON = new Set(
  `123456 password 123456789 12345678 12345 qwerty 1234567 111111 1234567890 123123
  abc123 1234 password1 iloveyou 1q2w3e4r 000000 qwerty123 zaq12wsx dragon sunshine
  princess letmein 654321 monkey 27653 1qaz2wsx 123321 qwertyuiop superman asdfghjkl
  football baseball welcome admin login master hello freedom whatever qazwsx trustno1
  starwars passw0rd shadow michael jennifer hunter ashley charlie donald password123
  batman access mustang killer jordan harley ranger buster thomas robert soccer hockey
  tigger daniel computer pepper ginger summer winter autumn spring flower cookie
  chocolate cheese secret secret123 changeme default guest test test123 root toor
  pass pass123 admin123 welcome1 letmein1 iloveyou1 monkey123 dragon123 qwerty1
  abcdef abcd1234 aa123456 a123456 123qwe 1qazxsw2 google samsung apple123 love
  lovely angel angel1 matrix whatever1 hello123 sunshine1 princess1 blink182 cyber
  security blocksy`.split(/\s+/).filter(Boolean),
);

const WORDS = [
  "password", "pass", "love", "admin", "welcome", "hello", "qwerty", "dragon",
  "monkey", "summer", "winter", "secret", "login", "master", "letmein", "sunshine",
  "princess", "football", "baseball", "shadow", "iloveyou", "user", "guest",
];

const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890"];

const LEET: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s", "!": "i",
};

export type Strength = 0 | 1 | 2 | 3 | 4;

export interface Finding {
  kind: "good" | "warn" | "bad";
  text: string;
}

export interface PasswordReport {
  score: Strength;
  label: string;
  entropyBits: number;
  crackTime: string;
  length: number;
  classes: { lower: boolean; upper: boolean; digit: boolean; symbol: boolean; space: boolean };
  findings: Finding[];
  isCommon: boolean;
}

export const STRENGTH_LABELS = ["Very weak", "Weak", "Okay", "Strong", "Excellent"] as const;

function hasSequence(pw: string, run = 4): boolean {
  const s = pw.toLowerCase();
  for (let i = 0; i <= s.length - run; i++) {
    let up = true;
    let down = true;
    for (let j = 1; j < run; j++) {
      const d = s.charCodeAt(i + j) - s.charCodeAt(i + j - 1);
      if (d !== 1) up = false;
      if (d !== -1) down = false;
    }
    if (up || down) return true;
  }
  return false;
}

function hasKeyboardWalk(pw: string, run = 4): boolean {
  const s = pw.toLowerCase();
  for (const row of KEYBOARD_ROWS) {
    for (let i = 0; i <= row.length - run; i++) {
      const chunk = row.slice(i, i + run);
      if (s.includes(chunk) || s.includes([...chunk].reverse().join(""))) return true;
    }
  }
  return false;
}

function deleet(pw: string): string {
  return pw
    .toLowerCase()
    .split("")
    .map((c) => LEET[c] ?? c)
    .join("");
}

function humanTime(seconds: number): string {
  const mins = 60;
  const hours = 3600;
  const days = 86400;
  const years = 31557600;
  if (seconds < 1) return "instantly";
  if (seconds < mins) return `${Math.round(seconds)} seconds`;
  if (seconds < hours) return `${Math.round(seconds / mins)} minutes`;
  if (seconds < days) return `${Math.round(seconds / hours)} hours`;
  if (seconds < years) return `${Math.round(seconds / days)} days`;
  if (seconds < years * 100) return `${Math.round(seconds / years)} years`;
  if (seconds < years * 1e6) return "centuries";
  return "millions of years";
}

export function analyzePassword(pw: string): PasswordReport {
  const length = [...pw].length;
  const classes = {
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /\d/.test(pw),
    symbol: /[^a-zA-Z0-9\s]/.test(pw),
    space: /\s/.test(pw),
  };
  const findings: Finding[] = [];

  let pool = 0;
  if (classes.lower) pool += 26;
  if (classes.upper) pool += 26;
  if (classes.digit) pool += 10;
  if (classes.symbol) pool += 33;
  if (classes.space) pool += 1;
  let entropy = length * Math.log2(Math.max(pool, 1));

  const lower = pw.toLowerCase();
  const isCommon = COMMON.has(lower) || COMMON.has(deleet(pw));
  const trimmedDigits = lower.replace(/\d+$/, "");
  const commonWithSuffix = !isCommon && trimmedDigits.length >= 3 && COMMON.has(trimmedDigits);

  if (isCommon) {
    findings.push({
      kind: "bad",
      text: "This is on lists of the most common passwords. Attackers try these first.",
    });
    entropy = Math.min(entropy, 10);
  } else if (commonWithSuffix) {
    findings.push({
      kind: "bad",
      text: "It's a common password with numbers added — a pattern cracking tools expect.",
    });
    entropy = Math.min(entropy, 18);
  }

  const word = WORDS.find((w) => deleet(pw).includes(w));
  if (word && !isCommon) {
    const swapped = !lower.includes(word);
    findings.push({
      kind: "warn",
      text: `Contains the common word “${word}”${
        swapped ? " — symbol swaps like @ for a don't fool attackers" : ""
      }.`,
    });
    // A dictionary word is worth ~14 bits, not length × pool.
    entropy -= Math.max(0, word.length * Math.log2(Math.max(pool, 1)) - 14);
  }

  if (hasSequence(pw)) {
    findings.push({ kind: "warn", text: "Contains a sequence like “abcd” or “1234”." });
    entropy -= 10;
  }
  if (hasKeyboardWalk(pw)) {
    findings.push({ kind: "warn", text: "Contains a keyboard pattern like “qwer” or “asdf”." });
    entropy -= 10;
  }
  if (/(.)\1\1/.test(pw)) {
    findings.push({ kind: "warn", text: "Repeats the same character three or more times." });
    entropy -= 8;
  }
  if (/(19[5-9]\d|20[0-3]\d)/.test(pw)) {
    findings.push({ kind: "warn", text: "Contains a year — birthdays and dates are easy to guess." });
    entropy -= 10;
  }
  if (/^[A-Z][a-z]+\d+[!@#$%]?$/.test(pw)) {
    findings.push({
      kind: "warn",
      text: "Follows the predictable “Capital + word + numbers + !” shape.",
    });
    entropy -= 8;
  }

  if (length === 0) {
    // handled by caller, but keep a sane report
  } else if (length < 8) {
    findings.push({ kind: "bad", text: `Only ${length} characters. Aim for at least 12, ideally 16+.` });
  } else if (length < 12) {
    findings.push({ kind: "warn", text: `${length} characters. Getting there — 12 or more is much safer.` });
  } else if (length >= 16) {
    findings.push({ kind: "good", text: `${length} characters — length is the best defence. Great!` });
  } else {
    findings.push({ kind: "good", text: `${length} characters — a solid length.` });
  }

  const classCount = [classes.lower, classes.upper, classes.digit, classes.symbol].filter(Boolean).length;
  if (length > 0) {
    if (classCount <= 1 && length < 16) {
      findings.push({
        kind: "warn",
        text: "Uses only one type of character. Mix in capitals, numbers or symbols — or make it longer.",
      });
    } else if (classCount >= 3) {
      findings.push({ kind: "good", text: "Good mix of character types." });
    }
  }
  if (classes.space && length >= 16) {
    findings.push({ kind: "good", text: "Looks like a passphrase — easy to remember, hard to guess." });
  }

  if (/^(.)\1+$/.test(pw)) entropy = Math.min(entropy, 6);
  // Short passwords are capped: their guess space is small however varied.
  if (length < 8) entropy = Math.min(entropy, 39);
  else if (length < 12) entropy = Math.min(entropy, 59);
  entropy = Math.max(0, entropy);
  let score: Strength;
  if (isCommon || entropy < 28) score = 0;
  else if (entropy < 40) score = 1;
  else if (entropy < 60) score = 2;
  else if (entropy < 80) score = 3;
  else score = 4;
  if (length < 8) score = Math.min(score, 1) as Strength;
  if (length < 12) score = Math.min(score, 2) as Strength;

  // Rough offline attack: 10 billion guesses/second against a fast hash.
  const seconds = Math.pow(2, entropy) / 2 / 1e10;

  return {
    score,
    label: STRENGTH_LABELS[score],
    entropyBits: Math.round(entropy),
    crackTime: humanTime(seconds),
    length,
    classes,
    findings,
    isCommon,
  };
}

const PASSPHRASE_WORDS = `amber anchor apple arrow aspen atlas bagel bamboo banjo basil beacon berry
bison blanket blossom bounce breeze brick bubble cactus candle canyon carrot castle cedar
cherry cinder clover cobalt comet copper coral cosmic cricket crystal daisy dancer delta
denim dolphin dragon drift ember falcon fern fiddle flint fossil galaxy garden gecko
ginger glacier goose granite harbor hazel hedgehog honey igloo indigo island ivory jasmine
jelly jungle kayak kettle kiwi koala lagoon lantern lemon lilac llama lotus lunar maple
marble meadow melon meteor mint mosaic muffin nectar nimbus noodle nutmeg oasis ocean olive
orbit otter paddle panda papaya parrot pebble pepper piano pickle pillow pixel planet plum
pocket polar pretzel puffin quartz quill rabbit radish raven ribbon river rocket saffron
sail sapphire scarf sequoia shadow sierra silver sketch sparrow spruce squid stellar
summit sunny tango teapot thistle thunder tiger timber toast topaz tulip tundra turtle
umbra velvet violet waffle walnut willow window wombat yonder zebra zephyr`.split(/\s+/);

/** Random example passphrase using the Web Crypto API (never stored). */
export function generatePassphrase(words = 4): string {
  const picks = new Uint32Array(words + 1);
  crypto.getRandomValues(picks);
  const list: string[] = [];
  for (let i = 0; i < words; i++) list.push(PASSPHRASE_WORDS[picks[i] % PASSPHRASE_WORDS.length]);
  const n = picks[words] % 100;
  return `${list.join("-")}-${n}`;
}
