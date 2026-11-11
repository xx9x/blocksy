/**
 * Phishing practice scenarios. Every brand, person, number and address is
 * fictional. Example domains use reserved names (example.com, .test) or
 * invented companies so nothing here points at a real service.
 */

export type ScenarioKind = "email" | "sms" | "social" | "login";

export interface Scenario {
  id: string;
  kind: ScenarioKind;
  verdict: "safe" | "suspicious";
  /** Display name / sender. */
  from: string;
  /** Address, phone number or handle shown under the sender. */
  fromDetail: string;
  subject?: string;
  time: string;
  body: string[];
  /** Call to action as it appears in the message. */
  cta?: { label: string; href: string };
  /** For login pages: the address bar. */
  url?: string;
  clues: string[];
  takeaway: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "parcel",
    kind: "sms",
    verdict: "suspicious",
    from: "+1 (555) 014-2290",
    fromDetail: "Text message",
    time: "9:41 AM",
    body: [
      "ParcelPal: Your package could not be delivered due to an incomplete address. Pay the $1.99 redelivery fee within 12 hours or it will be returned:",
    ],
    cta: { label: "parcelpal-redelivery.help/pay", href: "#" },
    clues: [
      "Unexpected text from a random number, not the courier's usual short code.",
      "Urgency (“within 12 hours”) and a tiny fee designed to collect card details.",
      "The link isn't on the courier's real domain — it just contains its name.",
    ],
    takeaway:
      "Delivery scams are the most common text phishing. Track parcels in the courier's own app or by typing its address yourself.",
  },
  {
    id: "it-reset",
    kind: "email",
    verdict: "suspicious",
    from: "IT Service Desk",
    fromDetail: "it-support@northwind-helpdesk.test",
    subject: "ACTION REQUIRED: Password expires today",
    time: "Mon 8:02 AM",
    body: [
      "Dear user,",
      "Your Northwind account password will expire in 2 hours. To avoid losing access to email and files, confirm your current password using the secure portal below.",
      "Failure to do so will result in account suspension.",
    ],
    cta: { label: "Keep my current password", href: "#" },
    clues: [
      "Generic greeting (“Dear user”) instead of your name.",
      "The sender domain is northwind-helpdesk.test, not your company's real domain.",
      "Real IT teams never ask you to “confirm” your current password.",
      "Threat of suspension to rush you.",
    ],
    takeaway:
      "When an email asks for your password, go to the service directly (or call IT) instead of using the link.",
  },
  {
    id: "code-requested",
    kind: "sms",
    verdict: "safe",
    from: "Lumen Mail",
    fromDetail: "Verified sender · short code 40411",
    time: "Just now",
    body: [
      "Lumen Mail: 482 913 is your sign-in code. It expires in 10 minutes. Lumen will never call or text to ask for this code.",
    ],
    clues: [
      "You just tried to sign in, so you expected this code.",
      "There's no link to click and no request to reply.",
      "It reminds you not to share the code — a good sign.",
    ],
    takeaway:
      "A code you requested is normal. The danger is a code you didn't request — or anyone asking you to read one back.",
  },
  {
    id: "friend-code",
    kind: "social",
    verdict: "suspicious",
    from: "Priya ✿",
    fromDetail: "@priya.makes · Direct message",
    time: "11:15 PM",
    body: [
      "omg hey!! sorry to bother you 🙏 I'm locked out and the app is sending a reset code to YOUR number because you're my backup contact",
      "can you send me the 6 digit code you just got? need it asap",
    ],
    clues: [
      "Asking for a code sent to *you* means they're trying to take over *your* account.",
      "Friends' accounts are often hijacked first, then used to message their contacts.",
      "Late-night urgency and an unusual request.",
    ],
    takeaway:
      "Never share a verification code, even with a friend. Call them on a number you already know to check.",
  },
  {
    id: "login-lookalike",
    kind: "login",
    verdict: "suspicious",
    from: "Brightly",
    fromDetail: "Sign-in page",
    url: "https://brightly.account-verify.test/login",
    time: "",
    body: ["Sign in to continue to Brightly Cloud", "Your session has expired."],
    clues: [
      "The real site name is at the end of the domain. Here the actual domain is account-verify.test — Brightly is just a subdomain label.",
      "“Session expired” pages reached from an email link are a classic credential trap.",
      "A password manager wouldn't autofill here, because it's the wrong domain.",
    ],
    takeaway:
      "Read domains from right to left. If your password manager won't autofill, stop and check.",
  },
  {
    id: "login-real",
    kind: "login",
    verdict: "safe",
    from: "Brightly",
    fromDetail: "Sign-in page",
    url: "https://accounts.brightly.example/signin",
    time: "",
    body: ["Sign in to Brightly", "Use your passkey or password"],
    clues: [
      "You typed the address yourself from a bookmark.",
      "The domain ends in brightly.example — the service's own domain.",
      "It offers a passkey, which can't be used on a fake site anyway.",
    ],
    takeaway:
      "Bookmarks and typed addresses are your safest route to a login page.",
  },
  {
    id: "giveaway",
    kind: "social",
    verdict: "suspicious",
    from: "Kestrel Audio Official",
    fromDetail: "@kestrel.audio.giveaways · Not followed by you",
    time: "2:30 PM",
    body: [
      "🎉 CONGRATULATIONS! You've been selected as one of 3 winners of our Anniversary Giveaway — Kestrel X2 headphones!",
      "Claim within 24h by confirming your shipping details and a $4.95 handling fee.",
    ],
    cta: { label: "kestrel-claim.test/winner", href: "#" },
    clues: [
      "You didn't enter a giveaway.",
      "The handle isn't the brand's verified account and has “giveaways” bolted on.",
      "Real prizes don't come with a fee.",
    ],
    takeaway: "If you didn't enter, you didn't win. Check the brand's official, verified profile.",
  },
  {
    id: "newsletter",
    kind: "email",
    verdict: "safe",
    from: "TrailMate",
    fromDetail: "hello@news.trailmate.example",
    subject: "Your October activity recap",
    time: "Sun 10:00 AM",
    body: [
      "Hi Alex,",
      "You logged 14 walks and 42 km in October — nice work! Your full recap is waiting in the TrailMate app.",
      "Manage email preferences any time in Settings → Notifications.",
    ],
    cta: { label: "Open the app", href: "#" },
    clues: [
      "It's a service you use, sent from its own domain.",
      "It addresses you by name and asks for nothing sensitive.",
      "It points you to the app rather than a login form.",
    ],
    takeaway:
      "Legitimate emails don't create urgency or ask for credentials. Opening the app directly is still a great habit.",
  },
];
