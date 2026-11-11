import type { BrickColor } from "./bricks";
import type { DemoState } from "./state";
import { MFA_STEPS, PRIVACY_ITEMS } from "./content";
import { SCENARIOS } from "./phishing";
import { currentStreak } from "./dates";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  color: BrickColor;
  /** Returns [current, goal] for progress display. */
  progress: (s: DemoState) => [number, number];
}

const correctCount = (s: DemoState) =>
  Object.values(s.phishing).filter((a) => a.correct).length;

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-brick",
    title: "First Brick",
    description: "Complete your first cybersecurity activity.",
    color: "teal",
    progress: (s) => [Math.min(1, s.bricks.filter((b) => b.source !== "Starter kit").length), 1],
  },
  {
    id: "password-pro",
    title: "Password Pro",
    description: "Complete the password safety lesson.",
    color: "blue",
    progress: (s) => [s.rewards["password:lesson"] ? 1 : 0, 1],
  },
  {
    id: "phish-finder",
    title: "Phish Finder",
    description: "Correctly identify five phishing practice examples.",
    color: "yellow",
    progress: (s) => [Math.min(5, correctCount(s)), 5],
  },
  {
    id: "mfa-master",
    title: "MFA Master",
    description: "Complete the MFA education module.",
    color: "green",
    progress: (s) => [MFA_STEPS.filter((m) => s.mfa[m.id]).length, MFA_STEPS.length],
  },
  {
    id: "privacy-builder",
    title: "Privacy Builder",
    description: "Complete the privacy checklist.",
    color: "purple",
    progress: (s) => [PRIVACY_ITEMS.filter((p) => s.privacy[p.id]).length, PRIVACY_ITEMS.length],
  },
  {
    id: "breach-ready",
    title: "Breach Ready",
    description: "Finish the breach awareness lesson and response plan.",
    color: "red",
    progress: (s) => [s.rewards["breach:lesson"] ? 1 : 0, 1],
  },
  {
    id: "habit-streak",
    title: "Steady Builder",
    description: "Log a security habit three days in a row.",
    color: "orange",
    progress: (s) => [Math.min(3, currentStreak(s.habits)), 3],
  },
  {
    id: "first-build",
    title: "Architect",
    description: "Place ten bricks in My Blocksy Build.",
    color: "teal",
    progress: (s) => [Math.min(10, s.placements.length), 10],
  },
  {
    id: "master-builder",
    title: "Master Builder",
    description: "Earn 25 bricks.",
    color: "purple",
    progress: (s) => [Math.min(25, s.bricks.length), 25],
  },
];

export const TOTAL_PHISHING = SCENARIOS.length;
