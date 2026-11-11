import type { BrickColor } from "./bricks";

export interface FeatureInfo {
  id: string;
  title: string;
  description: string;
  action: string;
  href: string;
  color: BrickColor;
  icon: "key" | "smartphone" | "fish" | "eye" | "siren" | "calendar";
  reward: string;
}

export const FEATURES: FeatureInfo[] = [
  {
    id: "password",
    title: "Password Check",
    description:
      "See what makes a password strong — length, variety and the patterns attackers guess first. Analysed on your device, never sent or saved.",
    action: "Test a password",
    href: "/app/password",
    color: "blue",
    icon: "key",
    reward: "Blue bricks",
  },
  {
    id: "mfa",
    title: "MFA Builder",
    description:
      "Learn how a second factor stops stolen passwords, compare methods from passkeys to SMS, and work through a setup checklist.",
    action: "Start the checklist",
    href: "/app/mfa",
    color: "green",
    icon: "smartphone",
    reward: "Green bricks",
  },
  {
    id: "phishing",
    title: "Phishing Practice",
    description:
      "Realistic but fictional emails, texts, DMs and login pages. Decide safe or suspicious, then see the clues you might have missed.",
    action: "Play a round",
    href: "/app/phishing",
    color: "yellow",
    icon: "fish",
    reward: "Yellow bricks",
  },
  {
    id: "privacy",
    title: "Privacy Check",
    description:
      "A friendly checklist for social settings, app permissions, connected apps, recovery options and location sharing.",
    action: "Run the checkup",
    href: "/app/privacy",
    color: "purple",
    icon: "eye",
    reward: "Purple bricks",
  },
  {
    id: "breach",
    title: "Breach Awareness",
    description:
      "Understand data breaches with fictional examples and a clearly labeled demo checker — plus exactly what to do if an account is exposed.",
    action: "Explore the demo",
    href: "/app/breach",
    color: "red",
    icon: "siren",
    reward: "Red bricks",
  },
  {
    id: "habits",
    title: "Habit Tracker",
    description:
      "Log small daily habits, keep a streak going and watch your week fill up with bricks. Milestones unlock bigger pieces.",
    action: "Log today's habits",
    href: "/app/habits",
    color: "orange",
    icon: "calendar",
    reward: "Orange bricks",
  },
];
