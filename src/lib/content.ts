import type { BrickColor, BrickSize } from "./bricks";

/* ------------------------------------------------------------------ */
/*  MFA Builder                                                        */
/* ------------------------------------------------------------------ */

export interface MfaMethod {
  id: string;
  name: string;
  strength: 1 | 2 | 3;
  summary: string;
  watchOut: string;
}

export const MFA_METHODS: MfaMethod[] = [
  {
    id: "passkey",
    name: "Passkeys & security keys",
    strength: 3,
    summary:
      "A cryptographic key stored on your device or a physical key. It only works on the real website, so it can't be phished.",
    watchOut: "Register a backup key or a second device so you're never locked out.",
  },
  {
    id: "app",
    name: "Authenticator app",
    strength: 2,
    summary:
      "An app generates a fresh 6-digit code every 30 seconds. Codes never travel over SMS.",
    watchOut: "Never read a code out to someone who contacts you — real support teams don't ask.",
  },
  {
    id: "push",
    name: "Push approval",
    strength: 2,
    summary:
      "Your phone asks “Is this you signing in?”. Number-matching prompts are the safest kind.",
    watchOut: "If you get a prompt you didn't start, deny it and change your password.",
  },
  {
    id: "sms",
    name: "SMS or email codes",
    strength: 1,
    summary:
      "A one-time code sent to your phone number or inbox. Much better than nothing, but the weakest option.",
    watchOut: "SIM-swap scams can redirect texts. Upgrade to an app or passkey when you can.",
  },
];

export interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
}

export const MFA_STEPS: ChecklistItem[] = [
  {
    id: "learn",
    title: "Understand the three factors",
    detail:
      "Something you know (password), something you have (phone or key), something you are (fingerprint or face).",
  },
  {
    id: "email",
    title: "Protect your main email first",
    detail:
      "Your email can reset every other password, so it's the most important account to lock down.",
  },
  {
    id: "method",
    title: "Pick the strongest method each site offers",
    detail: "Passkey or security key → authenticator app → push → SMS, in that order.",
  },
  {
    id: "backup",
    title: "Save your backup codes somewhere safe",
    detail:
      "Store them in a password manager or print them. They're your way back in if you lose your phone.",
  },
  {
    id: "money",
    title: "Turn it on for money & shopping accounts",
    detail: "Banking, payment apps and stores with saved cards are top targets.",
  },
  {
    id: "social",
    title: "Add it to social & messaging accounts",
    detail: "Hijacked social accounts are used to scam your friends and family.",
  },
];

/* ------------------------------------------------------------------ */
/*  Privacy Check                                                      */
/* ------------------------------------------------------------------ */

export const PRIVACY_ITEMS: (ChecklistItem & { minutes: number })[] = [
  {
    id: "social",
    title: "Review social media privacy settings",
    detail:
      "Check who can see your posts, find you by phone number or email, and tag you in photos.",
    minutes: 10,
  },
  {
    id: "permissions",
    title: "Check app permissions on your phone",
    detail:
      "Look for apps with camera, microphone, contacts or location access they don't really need.",
    minutes: 8,
  },
  {
    id: "connected",
    title: "Remove unused connected apps",
    detail:
      "Old quizzes, games and tools you signed in to with Google, Apple or Facebook may still have access.",
    minutes: 5,
  },
  {
    id: "recovery",
    title: "Review account recovery options",
    detail:
      "Make sure recovery emails and phone numbers are current — and that old ones are removed.",
    minutes: 5,
  },
  {
    id: "location",
    title: "Manage location sharing",
    detail:
      "See who you share live location with and turn off precise location for apps that don't need it.",
    minutes: 4,
  },
  {
    id: "ads",
    title: "Limit ad tracking & personalization",
    detail:
      "Turn off ad personalization and limit cross-app tracking in your phone and account settings.",
    minutes: 4,
  },
];

/* ------------------------------------------------------------------ */
/*  Security habits                                                     */
/* ------------------------------------------------------------------ */

export const HABITS: { id: string; title: string; hint: string }[] = [
  { id: "updates", title: "Installed a pending update", hint: "Phone, laptop, browser or apps." },
  { id: "pause", title: "Paused before clicking a link", hint: "Checked the sender and the real URL." },
  { id: "manager", title: "Used a password manager", hint: "Saved or generated a unique password." },
  { id: "lock", title: "Locked my screen when stepping away", hint: "Even for a minute." },
  { id: "review", title: "Reviewed a login alert or activity", hint: "Recognized every device and place." },
];

/* ------------------------------------------------------------------ */
/*  Breach awareness (fictional data only)                              */
/* ------------------------------------------------------------------ */

export interface DemoBreach {
  service: string;
  date: string;
  exposed: string[];
  note: string;
}

export interface DemoIdentity {
  id: string;
  email: string;
  label: string;
  breaches: DemoBreach[];
}

/** Every company and address here is invented for the demonstration. */
export const DEMO_IDENTITIES: DemoIdentity[] = [
  {
    id: "maya",
    email: "maya@example.com",
    label: "Maya — uses one password everywhere",
    breaches: [
      {
        service: "PixelPantry (fictional recipe app)",
        date: "March 2024",
        exposed: ["Email addresses", "Usernames", "Hashed passwords"],
        note: "Passwords were hashed with an outdated algorithm, so weak ones could be cracked.",
      },
      {
        service: "TrailMate (fictional fitness tracker)",
        date: "August 2022",
        exposed: ["Email addresses", "Names", "Approximate locations"],
        note: "Location history makes targeted phishing more convincing.",
      },
    ],
  },
  {
    id: "jordan",
    email: "jordan@example.com",
    label: "Jordan — careful, but has an old forum account",
    breaches: [
      {
        service: "RetroBoard Forums (fictional)",
        date: "January 2019",
        exposed: ["Email addresses", "Usernames", "IP addresses"],
        note: "Old, forgotten accounts are a common source of exposure.",
      },
    ],
  },
  {
    id: "sam",
    email: "sam@example.com",
    label: "Sam — brand-new address",
    breaches: [],
  },
];

export const BREACH_STEPS: ChecklistItem[] = [
  {
    id: "change",
    title: "Change the exposed password",
    detail: "Make it long and unique. If you reused it anywhere, change it there too.",
  },
  {
    id: "mfa",
    title: "Turn on multi-factor authentication",
    detail: "A stolen password alone is then no longer enough to get in.",
  },
  {
    id: "sessions",
    title: "Sign out other sessions",
    detail: "Most services let you sign out of every device from the security settings.",
  },
  {
    id: "watch",
    title: "Watch for follow-up phishing",
    detail: "Attackers often email breach victims pretending to be the affected company.",
  },
  {
    id: "money",
    title: "Check financial statements",
    detail: "If payment data was exposed, review transactions and talk to your bank.",
  },
];

/* ------------------------------------------------------------------ */
/*  Rewards                                                            */
/* ------------------------------------------------------------------ */

export interface RewardSpec {
  color: BrickColor;
  size: BrickSize;
}

export const REWARDS = {
  starter: [
    { color: "teal", size: "2x4" },
    { color: "teal", size: "2x4" },
    { color: "teal", size: "2x2" },
  ] as RewardSpec[],
  passwordFirstCheck: { color: "blue", size: "1x2" } as RewardSpec,
  passwordStrong: { color: "blue", size: "2x2" } as RewardSpec,
  passwordLesson: { color: "blue", size: "2x4" } as RewardSpec,
  phishingCorrect: { color: "yellow", size: "1x2" } as RewardSpec,
  phishingLesson: { color: "yellow", size: "2x4" } as RewardSpec,
  mfaStep: { color: "green", size: "1x2" } as RewardSpec,
  mfaModule: { color: "green", size: "2x4" } as RewardSpec,
  privacyItem: { color: "purple", size: "1x2" } as RewardSpec,
  privacyModule: { color: "purple", size: "2x4" } as RewardSpec,
  breachLesson: { color: "red", size: "2x4" } as RewardSpec,
  breachStep: { color: "red", size: "1x1" } as RewardSpec,
  habit: { color: "orange", size: "1x1" } as RewardSpec,
  habitWeek: { color: "orange", size: "2x4" } as RewardSpec,
};
