import {
  Award,
  Blocks,
  CalendarCheck,
  Eye,
  Fish,
  KeyRound,
  LayoutGrid,
  Settings,
  Siren,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { BrickColor } from "@/lib/bricks";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  color: BrickColor;
}

export const DASHBOARD_NAV: NavItem[] = [
  { href: "/app", label: "Overview", icon: LayoutGrid, color: "teal" },
  { href: "/app/build", label: "My Build", icon: Blocks, color: "orange" },
  { href: "/app/password", label: "Password Check", icon: KeyRound, color: "blue" },
  { href: "/app/phishing", label: "Phishing Practice", icon: Fish, color: "yellow" },
  { href: "/app/mfa", label: "MFA Builder", icon: Smartphone, color: "green" },
  { href: "/app/privacy", label: "Privacy Check", icon: Eye, color: "purple" },
  { href: "/app/breach", label: "Breach Awareness", icon: Siren, color: "red" },
  { href: "/app/habits", label: "Habit Tracker", icon: CalendarCheck, color: "orange" },
  { href: "/app/achievements", label: "Achievements", icon: Award, color: "yellow" },
  { href: "/app/settings", label: "Settings", icon: Settings, color: "teal" },
];
